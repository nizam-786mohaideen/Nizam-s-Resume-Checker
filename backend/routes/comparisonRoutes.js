import { Router } from "express";
import { submitComparison } from "../controller/comparisonController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.post("/comparisons", upload.single("resume"), submitComparison);

export default router;
