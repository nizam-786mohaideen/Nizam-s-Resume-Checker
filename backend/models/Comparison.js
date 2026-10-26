import mongoose from "mongoose";

const comparisonSchema = new mongoose.Schema(
  {
    resume: {
      data: { type: Buffer, required: true },
      contentType: { type: String, required: true },
      originalName: { type: String, required: true },
      size: { type: Number, required: true },
    },
    jobDescription: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending_ai", "completed", "failed"],
      default: "pending_ai",
    },
    aiResult: {
      score: { type: Number, min: 0, max: 100 },
      summary: String,
      matchedSkills: [String],
      missingSkills: [String],
      strengths: [String],
      improvements: [String],
    },
    creditsPercentLeft: { type: Number, min: 0, max: 100 },
  },
  { timestamps: true },
);

const Comparison = mongoose.model("Comparison", comparisonSchema);

export default Comparison;
