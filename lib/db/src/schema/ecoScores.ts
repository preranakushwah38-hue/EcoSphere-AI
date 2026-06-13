import { pgTable, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ecoScoresTable = pgTable("eco_scores", {
  id: serial("id").primaryKey(),
  ecoScore: integer("eco_score").notNull(),
  travelScore: integer("travel_score").notNull(),
  energyScore: integer("energy_score").notNull(),
  waterScore: integer("water_score").notNull(),
  dietScore: integer("diet_score").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEcoScoreSchema = createInsertSchema(ecoScoresTable).omit({ id: true, createdAt: true });
export type InsertEcoScore = z.infer<typeof insertEcoScoreSchema>;
export type EcoScore = typeof ecoScoresTable.$inferSelect;
