import { Router, type IRouter } from "express";
import { db, carbonEntriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/carbon/entries", async (req, res) => {
  try {
    const limit = Math.min(parseInt(String(req.query.limit ?? "50"), 10), 200);
    const entries = await db
      .select()
      .from(carbonEntriesTable)
      .orderBy(desc(carbonEntriesTable.createdAt))
      .limit(limit);
    res.json(entries);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch carbon entries" });
  }
});

router.post("/carbon/entries", async (req, res) => {
  try {
    const { date, transportCo2, energyCo2, dietCo2, shoppingCo2, totalCo2 } = req.body as {
      date: string;
      transportCo2: number;
      energyCo2: number;
      dietCo2: number;
      shoppingCo2: number;
      totalCo2: number;
    };
    if (!date || totalCo2 == null) {
      res.status(400).json({ error: "date and totalCo2 are required" });
      return;
    }
    const [entry] = await db
      .insert(carbonEntriesTable)
      .values({
        date,
        transportCo2: String(transportCo2),
        energyCo2: String(energyCo2),
        dietCo2: String(dietCo2),
        shoppingCo2: String(shoppingCo2),
        totalCo2: String(totalCo2),
      })
      .returning();
    res.status(201).json(entry);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create carbon entry" });
  }
});

router.delete("/carbon/entries/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [existing] = await db.select().from(carbonEntriesTable).where(eq(carbonEntriesTable.id, id));
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }
    await db.delete(carbonEntriesTable).where(eq(carbonEntriesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete carbon entry" });
  }
});

export default router;
