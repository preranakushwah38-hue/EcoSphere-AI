import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const wasteEntriesTable = pgTable("waste_entries", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  organicKg: numeric("organic_kg", { precision: 10, scale: 3 }).notNull(),
  recyclableKg: numeric("recyclable_kg", { precision: 10, scale: 3 }).notNull(),
  trashKg: numeric("trash_kg", { precision: 10, scale: 3 }).notNull(),
  totalKg: numeric("total_kg", { precision: 10, scale: 3 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWasteEntrySchema = createInsertSchema(wasteEntriesTable).omit({ id: true, createdAt: true });
export type InsertWasteEntry = z.infer<typeof insertWasteEntrySchema>;
export type WasteEntry = typeof wasteEntriesTable.$inferSelect;
