import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const waterEntriesTable = pgTable("water_entries", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  usageLiters: numeric("usage_liters", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWaterEntrySchema = createInsertSchema(waterEntriesTable).omit({ id: true, createdAt: true });
export type InsertWaterEntry = z.infer<typeof insertWaterEntrySchema>;
export type WaterEntry = typeof waterEntriesTable.$inferSelect;
