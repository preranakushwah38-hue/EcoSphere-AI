import { Router, type IRouter } from "express";
import { db, waterEntriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/water/entries", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit ?? "30"), 10), 100);
    const entries = await db
      .select()
      .from(waterEntriesTable)
      .orderBy(desc(waterEntriesTable.createdAt))
      .limit(limit);
    res.json(entries);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch water entries" });
  }
});

router.post("/water/entries", async (req, res) => {
  try {
    const { date, usageLiters } = req.body as { date: string; usageLiters: number };
    if (!date || usageLiters == null) {
      res.status(400).json({ error: "date and usageLiters are required" });
      return;
    }
    const [entry] = await db
      .insert(waterEntriesTable)
      .values({ date, usageLiters: String(usageLiters) })
      .returning();
    res.status(201).json(entry);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create water entry" });
  }
});

router.delete("/water/entries/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [existing] = await db.select().from(waterEntriesTable).where(eq(waterEntriesTable.id, id));
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }
    await db.delete(waterEntriesTable).where(eq(waterEntriesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete water entry" });
  }
});

export default router;
