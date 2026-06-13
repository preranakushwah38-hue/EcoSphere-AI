import { Router, type IRouter } from "express";
import healthRouter from "./health";
import geminiRouter from "./gemini";
import carbonRouter from "./carbon";
import waterRouter from "./water";
import wasteRouter from "./waste";
import ecoScoresRouter from "./ecoScores";
import dashboardRouter from "./dashboard";
import wasteScannerRouter from "./wasteScanner";

const router: IRouter = Router();

router.use(healthRouter);
router.use(geminiRouter);
router.use(carbonRouter);
router.use(waterRouter);
router.use(wasteRouter);
router.use(ecoScoresRouter);
router.use(dashboardRouter);
router.use(wasteScannerRouter);

export default router;
