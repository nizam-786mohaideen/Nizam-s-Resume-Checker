import { Router } from "express";
import comparisonRoutes from "./comparisonRoutes.js";
import healthRoutes from "./healthRoutes.js";

const router = Router();

router.use(healthRoutes);
router.use(comparisonRoutes);

export default router;
