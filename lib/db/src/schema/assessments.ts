import { pgTable, serial, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";

export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  consent: boolean("consent").notNull().default(true),
  answers: jsonb("answers").notNull(),
  scoreValue: integer("score_value").notNull(),
  scoreLevel: text("score_level").notNull(),
  redFlags: jsonb("red_flags").notNull().default([]),
  tags: jsonb("tags").notNull().default([]),
  anchorResponse: text("anchor_response"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Assessment = typeof assessmentsTable.$inferSelect;
export type InsertAssessment = typeof assessmentsTable.$inferInsert;
