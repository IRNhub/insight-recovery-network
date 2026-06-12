import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const resourceLeadsTable = pgTable("resource_leads", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  email: text("email").notNull(),
  resourceSlug: text("resource_slug").notNull(),
  consent: boolean("consent").notNull().default(true),
  landingPage: text("landing_page"),
  currentPage: text("current_page"),
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  utmTerm: text("utm_term"),
  utmContent: text("utm_content"),
  emailSent: boolean("email_sent").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertResourceLeadSchema = createInsertSchema(resourceLeadsTable).omit({
  id: true,
  emailSent: true,
  createdAt: true,
});

export type InsertResourceLead = z.infer<typeof insertResourceLeadSchema>;
export type ResourceLead = typeof resourceLeadsTable.$inferSelect;
