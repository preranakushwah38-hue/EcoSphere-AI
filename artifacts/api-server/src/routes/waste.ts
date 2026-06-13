import { Router, type IRouter } from "express";
import { db, wasteEntriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/waste/entries", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit ?? "30"), 10), 100);
    const entries = await db
      .select()
      .from(wasteEntriesTable)
      .orderBy(desc(wasteEntriesTable.createdAt))
      .limit(limit);
    res.json(entries);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch waste entries" });
  }
});

router.post("/waste/entries", async (req, res) => {
  try {
    const { date, organicKg, recyclableKg, trashKg } = req.body as {
      date: string;
      organicKg: number;
      recyclableKg: number;
      trashKg: number;
    };
    if (!date) { res.status(400).json({ error: "date is required" }); return; }
    const totalKg = (organicKg ?? 0) + (recyclableKg ?? 0) + (trashKg ?? 0);
    const [entry] = await db
      .insert(wasteEntriesTable)
      .values({
        date,
        organicKg: String(organicKg ?? 0),
        recyclableKg: String(recyclableKg ?? 0),
        trashKg: String(trashKg ?? 0),
        totalKg: String(totalKg),
      })
      .returning();
    res.status(201).json(entry);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create waste entry" });
  }
});

router.delete("/waste/entries/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [existing] = await db.select().from(wasteEntriesTable).where(eq(wasteEntriesTable.id, id));
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }
    await db.delete(wasteEntriesTable).where(eq(wasteEntriesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete waste entry" });
  }
});

export default router;
