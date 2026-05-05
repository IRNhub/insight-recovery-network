import { pgTable, serial, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const enquiriesTable = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  preferredContact: text("preferred_contact").notNull(),
  supportType: text("support_type").notNull(),
  message: text("message").notNull(),
  consent: boolean("consent").notNull().default(true),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEnquirySchema = createInsertSchema(enquiriesTable).omit({
  id: true,
  status: true,
  createdAt: true,
});

export type InsertEnquiry = z.infer<typeof insertEnquirySchema>;
export type Enquiry = typeof enquiriesTable.$inferSelect;
