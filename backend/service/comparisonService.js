import Comparison from "../models/Comparison.js";
import { extractPdfText } from "./pdfTextService.js";
import { scoreResume } from "./labdService.js";
import { hasPdfSignature, HttpError, maxJobDescriptionLength } from "../utils.js";

export async function createComparison({ file, jobDescription }) {
  if (!file) {
    throw new HttpError(400, "A resume PDF is required.");
  }
  if (!hasPdfSignature(file.buffer)) {
    throw new HttpError(400, "The uploaded file does not look like a valid PDF.");
  }

  const description = typeof jobDescription === "string" ? jobDescription.trim() : "";
  if (!description) {
    throw new HttpError(400, "A job description is required.");
  }
  if (description.length > maxJobDescriptionLength) {
    throw new HttpError(400, "The job description must be 30,000 characters or fewer.");
  }

  const comparison = await Comparison.create({
    resume: {
      data: file.buffer,
      contentType: "application/pdf",
      originalName: file.originalname,
      size: file.size,
    },
    jobDescription: description,
    status: "pending_ai",
  });

  try {
    const resumeText = await extractPdfText(file.buffer);
    const { analysis, creditsPercentLeft } = await scoreResume({
      resumeText,
      jobDescription: description,
    });

    comparison.status = "completed";
    comparison.aiResult = analysis;
    comparison.creditsPercentLeft = creditsPercentLeft;
    await comparison.save();
    return comparison;
  } catch (error) {
    comparison.status = "failed";
    await comparison.save().catch(() => {});
    throw error;
  }
}
