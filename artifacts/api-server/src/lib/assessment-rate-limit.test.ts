import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  ASSESSMENT_RATE_LIMIT_WINDOW_SECONDS,
  AssessmentRateLimitUnavailableError,
  createAssessmentRateLimiter,
  deriveAssessmentRateLimitKey,
  type AssessmentRateLimitDecision,
  type AssessmentRateLimitIncrement,
  type AssessmentRateLimitStore,
} from "../assessment-engine/assessment-rate-limit.ts";

interface MemoryRow {
  count: number;
  expiresAt: number;
}

class SharedAtomicRateLimitStore implements AssessmentRateLimitStore {
  readonly writes: AssessmentRateLimitIncrement[] = [];
  private readonly rows = new Map<string, MemoryRow>();
  private operationTail: Promise<void> = Promise.resolve();
  private nowMs: number;

  constructor(nowMs = Date.parse("2026-08-30T12:00:00.000Z")) {
    this.nowMs = nowMs;
  }

  setNow(nowMs: number): void {
    this.nowMs = nowMs;
  }

  size(): number {
    return this.rows.size;
  }

  async increment(input: AssessmentRateLimitIncrement): Promise<AssessmentRateLimitDecision> {
    const operation = this.operationTail.then(async () => {
      await new Promise<void>((resolve) => setImmediate(resolve));
      this.writes.push({ ...input });
      const key = `${input.scope}:${input.keyHash}`;
      const current = this.rows.get(key);
      const row = !current || current.expiresAt <= this.nowMs
        ? { count: 1, expiresAt: this.nowMs + input.windowSeconds * 1000 }
        : {
            count: Math.min(current.count + 1, input.maximum + 1),
            expiresAt: current.expiresAt,
          };
      this.rows.set(key, row);
      return {
        limited: row.count > input.maximum,
        count: row.count,
        retryAfterSeconds: Math.max(1, Math.ceil((row.expiresAt - this.nowMs) / 1000)),
      };
    });
    this.operationTail = operation.then(() => undefined, () => undefined);
    return operation;
  }

  async cleanupExpired(): Promise<number> {
    let deleted = 0;
    for (const [key, row] of this.rows) {
      if (row.expiresAt <= this.nowMs) {
        this.rows.delete(key);
        deleted += 1;
      }
    }
    return deleted;
  }
}

const TEST_SECRET = "synthetic-rate-limit-secret-with-sufficient-entropy";

function limiter(store: AssessmentRateLimitStore) {
  return createAssessmentRateLimiter(store, () => TEST_SECRET);
}

test("distributed limiter uses PostgreSQL atomic upsert and trusted Express IP derivation, not process memory", async () => {
  const postgresSource = await readFile(
    new URL("../assessment-engine/assessment-rate-limit-postgres.ts", import.meta.url),
    "utf8",
  );
  const routeSource = await readFile(new URL("../routes/assessments.ts", import.meta.url), "utf8");
  const appSource = await readFile(new URL("../app.ts", import.meta.url), "utf8");
  const migrationSource = await readFile(
    new URL("../../../../lib/db/migrations/20260830_assessment_distributed_rate_limit.sql", import.meta.url),
    "utf8",
  );

  assert.match(postgresSource, /pool\.query/);
  assert.match(postgresSource, /ON CONFLICT \("scope", "key_hash"\) DO UPDATE/);
  assert.match(postgresSource, /LEAST\(current_limit\."request_count" \+ 1, \$4::integer \+ 1\)/);
  assert.doesNotMatch(routeSource, /new Map/);
  assert.doesNotMatch(postgresSource, /new Map/);
  assert.match(routeSource, /req\.ip \|\| "unknown"/);
  assert.doesNotMatch(routeSource, /x-forwarded-for/i);
  assert.match(appSource, /app\.set\("trust proxy", 1\)/);
  assert.match(migrationSource, /assessment_rate_limits_scope_key_uq/);
  assert.match(migrationSource, /assessment_rate_limits_expires_at_idx/);
});

test("two simulated application instances share one effective allowance", async () => {
  const store = new SharedAtomicRateLimitStore();
  const instances = [limiter(store), limiter(store)];
  const decisions = await Promise.all(
    Array.from({ length: 6 }, (_, index) => instances[index % instances.length]!.check("192.0.2.10", "submit", 4)),
  );
  assert.equal(decisions.filter((decision) => !decision.limited).length, 4);
  assert.equal(decisions.filter((decision) => decision.limited).length, 2);
});

test("three simulated application instances do not multiply the allowance", async () => {
  const store = new SharedAtomicRateLimitStore();
  const instances = [limiter(store), limiter(store), limiter(store)];
  const decisions = await Promise.all(
    Array.from({ length: 9 }, (_, index) => instances[index % instances.length]!.check("192.0.2.20", "submit", 6)),
  );
  assert.equal(decisions.filter((decision) => !decision.limited).length, 6);
  assert.equal(decisions.filter((decision) => decision.limited).length, 3);
});

test("concurrent requests cannot bypass the configured shared limit", async () => {
  const store = new SharedAtomicRateLimitStore();
  const instances = [limiter(store), limiter(store), limiter(store)];
  const decisions = await Promise.all(
    Array.from({ length: 100 }, (_, index) => instances[index % 3]!.check("198.51.100.5", "submit", 12)),
  );
  assert.equal(decisions.filter((decision) => !decision.limited).length, 12);
  assert.equal(decisions.filter((decision) => decision.limited).length, 88);
  assert.equal(decisions.at(-1)?.count, 13);
});

test("an expired window resets atomically to a first allowed request", async () => {
  const startedAt = Date.parse("2026-08-30T12:00:00.000Z");
  const store = new SharedAtomicRateLimitStore(startedAt);
  const instance = limiter(store);
  assert.equal((await instance.check("203.0.113.7", "submit", 1)).limited, false);
  assert.equal((await instance.check("203.0.113.7", "submit", 1)).limited, true);
  store.setNow(startedAt + ASSESSMENT_RATE_LIMIT_WINDOW_SECONDS * 1000 + 1);
  const reset = await instance.check("203.0.113.7", "submit", 1);
  assert.equal(reset.limited, false);
  assert.equal(reset.count, 1);
});

test("separate derived identifiers do not interfere", async () => {
  const store = new SharedAtomicRateLimitStore();
  const instance = limiter(store);
  assert.equal((await instance.check("192.0.2.1", "submit", 1)).limited, false);
  assert.equal((await instance.check("192.0.2.2", "submit", 1)).limited, false);
  assert.equal((await instance.check("192.0.2.1", "submit", 1)).limited, true);
  assert.equal((await instance.check("192.0.2.2", "submit", 1)).limited, true);
});

test("submit and contact actions retain independent counters", async () => {
  const store = new SharedAtomicRateLimitStore();
  const instance = limiter(store);
  assert.equal((await instance.check("192.0.2.3", "submit", 1)).limited, false);
  assert.equal((await instance.check("192.0.2.3", "contact", 1)).limited, false);
  assert.equal((await instance.check("192.0.2.3", "submit", 1)).limited, true);
  assert.equal((await instance.check("192.0.2.3", "contact", 1)).limited, true);
});

test("limiter storage receives only scope, HMAC key, window and count policy", async () => {
  const store = new SharedAtomicRateLimitStore();
  const instance = limiter(store);
  const sensitiveIdentifier = "result-token-user@example.test-acute-opioid-answer";
  await instance.check(sensitiveIdentifier, "contact", 6);
  assert.deepEqual(Object.keys(store.writes[0]!).sort(), ["keyHash", "maximum", "scope", "windowSeconds"]);
  assert.doesNotMatch(JSON.stringify(store.writes), /result-token|example\.test|opioid|answer/i);

  const migrationSource = await readFile(
    new URL("../../../../lib/db/migrations/20260830_assessment_distributed_rate_limit.sql", import.meta.url),
    "utf8",
  );
  const columns = [...migrationSource.matchAll(/^\s*"([a-z_]+)"\s+(?:serial|text|varchar|timestamptz|integer)/gm)]
    .map((match) => match[1]);
  assert.deepEqual(columns, [
    "id",
    "scope",
    "key_hash",
    "window_started_at",
    "request_count",
    "expires_at",
    "created_at",
    "updated_at",
  ]);
});

test("HMAC limiter keys are deterministic, scoped and do not expose identifiers or tokens", () => {
  const identifier = "198.51.100.42-result-token-clinical-content";
  const submitKey = deriveAssessmentRateLimitKey(identifier, "submit", TEST_SECRET);
  const repeated = deriveAssessmentRateLimitKey(identifier, "submit", TEST_SECRET);
  const contactKey = deriveAssessmentRateLimitKey(identifier, "contact", TEST_SECRET);
  assert.equal(submitKey, repeated);
  assert.notEqual(submitKey, contactKey);
  assert.match(submitKey, /^[a-f0-9]{64}$/);
  assert.equal(submitKey.includes(identifier), false);
  assert.doesNotMatch(submitKey, /result-token|clinical/i);
});

test("shared limiter unavailability fails closed and never falls back to process memory", async () => {
  const unavailableStore: AssessmentRateLimitStore = {
    async increment() { throw new Error("synthetic database outage"); },
    async cleanupExpired() { return 0; },
  };
  await assert.rejects(
    () => limiter(unavailableStore).check("192.0.2.50", "submit", 12),
    AssessmentRateLimitUnavailableError,
  );
  const routeSource = await readFile(new URL("../routes/assessments.ts", import.meta.url), "utf8");
  assert.match(routeSource, /status\(503\)/);
  assert.match(routeSource, /Shared assessment rate limiter unavailable/);
  assert.doesNotMatch(routeSource, /fallback|rateLimitBuckets|new Map/i);
});

test("expired counter cleanup is bounded and independent of endpoint decisions", async () => {
  const startedAt = Date.parse("2026-08-30T12:00:00.000Z");
  const store = new SharedAtomicRateLimitStore(startedAt);
  await limiter(store).check("192.0.2.60", "submit", 12);
  assert.equal(store.size(), 1);
  store.setNow(startedAt + ASSESSMENT_RATE_LIMIT_WINDOW_SECONDS * 1000 + 1);
  assert.equal(await store.cleanupExpired(), 1);
  assert.equal(store.size(), 0);

  const workerSource = await readFile(
    new URL("../assessment-engine/assessment-rate-limit-worker.ts", import.meta.url),
    "utf8",
  );
  assert.match(workerSource, /cleanupExpired\(\)/);
  assert.match(workerSource, /catch \(error\)/);
  assert.match(workerSource, /timer\.unref\(\)/);
});
