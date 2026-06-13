import { Router, type IRouter } from "express";
import { db, carbonEntriesTable, waterEntriesTable, wasteEntriesTable, ecoScoresTable } from "@workspace/db";
import { desc, asc } from "drizzle-orm";

const router: IRouter = Router();

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

router.get("/dashboard/summary", async (req, res) => {
  try {
    const [latestEcoScore] = await db
      .select()
      .from(ecoScoresTable)
      .orderBy(desc(ecoScoresTable.createdAt))
      .limit(1);

    const carbonHistory = await db
      .select()
      .from(carbonEntriesTable)
      .orderBy(asc(carbonEntriesTable.createdAt))
      .limit(10);

    const waterHistory = await db
      .select()
      .from(waterEntriesTable)
      .orderBy(desc(waterEntriesTable.createdAt))
      .limit(7);

    const wasteHistory = await db
      .select()
      .from(wasteEntriesTable)
      .orderBy(desc(wasteEntriesTable.createdAt))
      .limit(7);

    const ecoScoreHistory = await db
      .select()
      .from(ecoScoresTable)
      .orderBy(asc(ecoScoresTable.createdAt))
      .limit(8);

    // Compute stats
    const ecoScore = latestEcoScore?.ecoScore ?? null;

    const latestCarbon = carbonHistory.length > 0 ? carbonHistory[carbonHistory.length - 1] : null;
    const prevCarbon = carbonHistory.length > 1 ? carbonHistory[carbonHistory.length - 2] : null;
    const carbonTotal = latestCarbon ? parseFloat(latestCarbon.totalCo2) : null;
    const carbonTrend = carbonTotal != null && prevCarbon
      ? Math.round((carbonTotal - parseFloat(prevCarbon.totalCo2)) * 100) / 100
      : 0;

    const waterAvg = waterHistory.length > 0
      ? Math.round(waterHistory.reduce((s, e) => s + parseFloat(e.usageLiters), 0) / waterHistory.length)
      : null;
    const waterGoal = 120;
    const waterTrend = waterAvg != null ? waterAvg - waterGoal : 0;

    const wasteTotalKg = wasteHistory.length > 0
      ? wasteHistory.reduce((s, e) => s + parseFloat(e.totalKg), 0)
      : null;
    const wasteDiversionRate = wasteHistory.length > 0
      ? Math.round(
          wasteHistory.reduce((s, e) => s + parseFloat(e.organicKg) + parseFloat(e.recyclableKg), 0) /
          wasteHistory.reduce((s, e) => s + parseFloat(e.totalKg), 0) * 100
        )
      : null;

    // Carbon chart — one point per entry labeled with ordinal weeks
    const carbonChartData = carbonHistory.map((e, i) => ({
      week: `W${i + 1}`,
      value: Math.round(parseFloat(e.totalCo2) * 10) / 10,
      average: 16.0,
    }));

    // Water chart — last 7 entries in chronological order
    const waterChartData = [...waterHistory].reverse().map((e) => ({
      day: DAYS[new Date(e.date).getDay()] ?? e.date.slice(5),
      usage: Math.round(parseFloat(e.usageLiters)),
    }));

    // Waste chart — last 7 entries in chronological order
    const wasteChartData = [...wasteHistory].reverse().map((e) => ({
      name: DAYS[new Date(e.date).getDay()] ?? e.date.slice(5),
      organic: parseFloat(e.organicKg),
      recyclable: parseFloat(e.recyclableKg),
      trash: parseFloat(e.trashKg),
    }));

    // Eco score trend chart
    const ecoScoreChartData = ecoScoreHistory.map((e, i) => ({
      week: `W${i + 1}`,
      score: e.ecoScore,
    }));

    const hasData =
      carbonHistory.length > 0 ||
      waterHistory.length > 0 ||
      wasteHistory.length > 0 ||
      !!latestEcoScore;

    res.json({
      hasData,
      ecoScore,
      carbonTotal,
      carbonTrend,
      waterAvg,
      waterTrend,
      wasteTotalKg: wasteTotalKg != null ? Math.round(wasteTotalKg * 10) / 10 : null,
      wasteDiversionRate,
      carbonChartData,
      waterChartData,
      wasteChartData,
      ecoScoreChartData,
    });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to compute dashboard summary" });
  }
});

export default router;
