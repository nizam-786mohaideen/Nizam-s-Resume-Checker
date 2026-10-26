import multer from "multer";

export default function errorHandler(error, _req, res, _next) {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "The resume must be 10 MB or smaller." });
  }
  if (error instanceof multer.MulterError) {
    return res.status(400).json({ error: "Upload one PDF resume and a job description." });
  }
  if (error.status && error.status < 500) {
    return res.status(error.status).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "The request could not be saved." });
}
