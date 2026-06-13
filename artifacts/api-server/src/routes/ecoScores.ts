import { Router, type IRouter } from "express";
import { db, ecoScoresTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/eco-scores", async (req, res) => {
  try {
    const scores = await db
      .select()
      .from(ecoScoresTable)
      .orderBy(desc(ecoScoresTable.createdAt))
      .limit(20);
    res.json(scores);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch eco scores" });
  }
});

router.post("/eco-scores", async (req, res) => {
  try {
    const { ecoScore, travelScore, energyScore, waterScore, dietScore } = req.body as {
      ecoScore: number;
      travelScore: number;
      energyScore: number;
      waterScore: number;
      dietScore: number;
    };
    if (ecoScore == null) { res.status(400).json({ error: "ecoScore is required" }); return; }
    const [score] = await db
      .insert(ecoScoresTable)
      .values({ ecoScore, travelScore: travelScore ?? 0, energyScore: energyScore ?? 0, waterScore: waterScore ?? 0, dietScore: dietScore ?? 0 })
      .returning();
    res.status(201).json(score);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to save eco score" });
  }
});

export default router;
