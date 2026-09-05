import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { createEnquiryStore, EnquiryConflict } from "./enquiry-store.ts";
import { enquiryInput } from "./enquiry-input.ts";
import { createEnquiryDeliveryRunner } from "./enquiry-delivery.ts";
const { Pool } = createRequire(
  new URL("../../../../lib/db/package.json", import.meta.url),
)("pg");
const connectionString = process.env.IRN_ENQUIRY_TEST_DATABASE_URL;
if (!connectionString)
  throw new Error(
    "Supply IRN_ENQUIRY_TEST_DATABASE_URL for an isolated local test database",
  );
const url = new URL(connectionString);
if (
  !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname) ||
  !url.pathname.endsWith("_test")
)
  throw new Error("Refusing a non-local or non-test database");

test("real PostgreSQL enquiry acceptance and recovery", async (t) => {
  const admin = new Pool({ connectionString });
  const schema = `enquiry_test_${randomUUID().replaceAll("-", "")}`;
  await admin.query(`CREATE SCHEMA ${schema}`);
  const pool = new Pool({
    connectionString,
    options: `-c search_path=${schema}`,
  });
  const store = createEnquiryStore(pool, () => "test-only-hmac-secret");
  const input = (extra = {}) =>
    enquiryInput.parse({
      name: "Synthetic Test",
      phone: "+447700900123",
      preferredContact: "phone",
      consent: true,
      submissionId: randomUUID(),
      ...extra,
    });
  const clear = () =>
    pool.query(
      "TRUNCATE enquiries, enquiry_deliveries, enquiry_rate_limits RESTART IDENTITY CASCADE",
    );
  try {
    await pool.query(
      `CREATE TABLE enquiries (id serial PRIMARY KEY,name text NOT NULL,email text NOT NULL,phone text NOT NULL,preferred_contact text NOT NULL,support_type text NOT NULL,message text NOT NULL,consent boolean NOT NULL DEFAULT true,status text NOT NULL DEFAULT 'new',notification_sent boolean NOT NULL DEFAULT false,created_at timestamp NOT NULL DEFAULT now())`,
    );
    await pool.query(
      `INSERT INTO enquiries(name,email,phone,preferred_contact,support_type,message,notification_sent) VALUES('Historical test','old@example.com','','email','general','Preserve this record',true)`,
    );
    const migration = await readFile(
      new URL(
        "../../../../lib/db/migrations/20260905_enquiry_delivery.sql",
        import.meta.url,
      ),
      "utf8",
    );
    await t.test(
      "additive migration is repeatable and does not replay historical enquiries",
      async () => {
        await pool.query(migration);
        await pool.query(migration);
        assert.equal(
          (await pool.query("SELECT message,notification_sent FROM enquiries"))
            .rows[0].message,
          "Preserve this record",
        );
        assert.equal(
          (
            await pool.query(
              "SELECT count(*)::integer AS count FROM enquiry_deliveries",
            )
          ).rows[0].count,
          0,
        );
      },
    );
    await t.test(
      "concurrent identical retries produce one enquiry and two jobs",
      async () => {
        await clear();
        const request = input();
        const receipts = await Promise.all(
          Array.from({ length: 12 }, () => store.accept(request)),
        );
        assert.equal(new Set(receipts.map((r) => r.id)).size, 1);
        assert.equal(receipts.filter((r) => r.created).length, 1);
        assert.equal(
          (
            await pool.query(
              "SELECT count(*)::integer AS count FROM enquiry_deliveries",
            )
          ).rows[0].count,
          2,
        );
        await assert.rejects(
          store.accept({ ...request, message: "changed request" }),
          EnquiryConflict,
        );
      },
    );
    await t.test(
      "queue failure rolls back the enquiry transaction",
      async () => {
        await clear();
        await pool.query(
          `ALTER TABLE enquiry_deliveries ADD CONSTRAINT injected_failure CHECK (channel='crm')`,
        );
        await assert.rejects(store.accept(input()));
        assert.equal(
          (await pool.query("SELECT count(*)::integer AS count FROM enquiries"))
            .rows[0].count,
          0,
        );
        await pool.query(
          "ALTER TABLE enquiry_deliveries DROP CONSTRAINT injected_failure",
        );
      },
    );
    await t.test(
      "shared rate limits survive a new store instance and expire",
      async () => {
        await clear();
        const limits = await Promise.all(
          Array.from({ length: 12 }, () => store.rateLimit("127.0.0.25")),
        );
        assert.equal(limits.filter((r) => r.limited).length, 2);
        assert.equal(
          (
            await createEnquiryStore(
              pool,
              () => "test-only-hmac-secret",
            ).rateLimit("127.0.0.25")
          ).limited,
          true,
        );
        const row = (await pool.query("SELECT * FROM enquiry_rate_limits"))
          .rows[0];
        assert.equal(row.key_hash.length, 64);
        assert.ok(!JSON.stringify(row).includes("127.0.0.25"));
        await pool.query(
          `UPDATE enquiry_rate_limits SET expires_at=now()-interval '1 second'`,
        );
        assert.equal((await store.rateLimit("127.0.0.25")).limited, false);
      },
    );
    await t.test(
      "competing workers cannot claim the same active job and stale completion is fenced",
      async () => {
        await clear();
        await store.accept(input());
        const claimed = (
          await Promise.all(Array.from({ length: 8 }, () => store.claim()))
        ).filter(Boolean);
        assert.equal(claimed.length, 2);
        assert.equal(new Set(claimed.map((d) => d.channel)).size, 2);
        const old = claimed[0];
        await pool.query(
          `UPDATE enquiry_deliveries SET claimed_until=now()-interval '1 second' WHERE channel=$1`,
          [old.channel],
        );
        const recovered = await store.claim();
        assert.equal(recovered.channel, old.channel);
        assert.equal(recovered.attempts, 2);
        await store.complete(old);
        assert.equal(
          (
            await pool.query(
              "SELECT status FROM enquiry_deliveries WHERE channel=$1",
              [old.channel],
            )
          ).rows[0].status,
          "processing",
        );
        await store.complete(recovered);
        assert.equal(
          (
            await pool.query(
              "SELECT status FROM enquiry_deliveries WHERE channel=$1",
              [old.channel],
            )
          ).rows[0].status,
          "sent",
        );
      },
    );
    await t.test(
      "temporary IRNOS and notification failures retry independently with stable identifiers",
      async () => {
        await clear();
        await store.accept(input());
        const warnings = [];
        const keys = [];
        const crmIds = [];
        let ready = false;
        const run = createEnquiryDeliveryRunner({
          store,
          notify: async (_, key) => {
            keys.push(key);
            if (!ready) throw new Error("Do not log private provider response");
          },
          forward: async (p) => {
            crmIds.push(p.enquiryId);
            return ready
              ? { forwarded: true, leadId: "test-crm-id" }
              : { forwarded: false };
          },
          warn: (data) => warnings.push(data),
        });
        await run();
        assert.deepEqual(
          (await pool.query("SELECT status FROM enquiry_deliveries")).rows.map(
            (r) => r.status,
          ),
          ["queued", "queued"],
        );
        assert.equal(
          (await pool.query("SELECT notification_sent FROM enquiries")).rows[0]
            .notification_sent,
          false,
        );
        ready = true;
        await pool.query("UPDATE enquiry_deliveries SET next_attempt_at=now()");
        await run();
        assert.ok(
          (
            await pool.query("SELECT status FROM enquiry_deliveries")
          ).rows.every((r) => r.status === "sent"),
        );
        assert.equal(keys[0], keys[1]);
        assert.equal(crmIds[0], crmIds[1]);
        assert.equal(
          (await pool.query("SELECT notification_sent FROM enquiries")).rows[0]
            .notification_sent,
          true,
        );
        assert.ok(!JSON.stringify(warnings).includes("private provider"));
        assert.equal(warnings.length, 2);
      },
    );
    await t.test(
      "false success or absent CRM receipt never marks delivery sent; attempts stop after eight",
      async () => {
        await clear();
        await store.accept(input());
        await pool.query(
          `UPDATE enquiry_deliveries SET status='sent' WHERE channel='notification'`,
        );
        await pool.query(
          `UPDATE enquiry_deliveries SET attempts=7 WHERE channel='crm'`,
        );
        const run = createEnquiryDeliveryRunner({
          store,
          notify: async () => {},
          forward: async () => ({ forwarded: true }),
          warn: () => {},
        });
        await run();
        assert.equal(
          (
            await pool.query(
              "SELECT status FROM enquiry_deliveries WHERE channel='crm'",
            )
          ).rows[0].status,
          "failed",
        );
        await pool.query(
          `UPDATE enquiry_deliveries SET status='processing',claimed_until=now()-interval '1 second' WHERE channel='crm'`,
        );
        assert.equal(await store.claim(), undefined);
        assert.equal(
          (
            await pool.query(
              "SELECT status FROM enquiry_deliveries WHERE channel='crm'",
            )
          ).rows[0].status,
          "failed",
        );
      },
    );
  } finally {
    await pool.end();
    await admin.query(`DROP SCHEMA ${schema} CASCADE`);
    await admin.end();
  }
});
