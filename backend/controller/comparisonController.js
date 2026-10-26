import { createComparison } from "../service/comparisonService.js";

export async function submitComparison(req, res, next) {
  try {
    const comparison = await createComparison({
      file: req.file,
      jobDescription: req.body.jobDescription,
    });

    return res.status(201).json({
      id: comparison.id,
      status: comparison.status,
      message: "Your resume was compared with the job description.",
      analysis: comparison.aiResult,
      creditsPercentLeft: comparison.creditsPercentLeft,
      createdAt: comparison.createdAt,
    });
  } catch (error) {
    return next(error);
  }
}
