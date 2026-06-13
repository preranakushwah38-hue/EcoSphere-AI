import { pgTable, serial, text, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const carbonEntriesTable = pgTable("carbon_entries", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(),
  transportCo2: numeric("transport_co2", { precision: 10, scale: 4 }).notNull(),
  energyCo2: numeric("energy_co2", { precision: 10, scale: 4 }).notNull(),
  dietCo2: numeric("diet_co2", { precision: 10, scale: 4 }).notNull(),
  shoppingCo2: numeric("shopping_co2", { precision: 10, scale: 4 }).notNull(),
  totalCo2: numeric("total_co2", { precision: 10, scale: 4 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertCarbonEntrySchema = createInsertSchema(carbonEntriesTable).omit({ id: true, createdAt: true });
export type InsertCarbonEntry = z.infer<typeof insertCarbonEntrySchema>;
export type CarbonEntry = typeof carbonEntriesTable.$inferSelect;
