import multer from "multer";
import { HttpError, maxResumeBytes } from "../utils.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxResumeBytes, files: 1, fields: 1, fieldSize: 120 * 1024 },
  fileFilter: (_req, file, callback) => {
    const isPdf = file.originalname.toLowerCase().endsWith(".pdf");
    callback(isPdf ? null : new HttpError(400, "Please upload a PDF resume."), isPdf);
  },
});

export default upload;
