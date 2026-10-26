import "dotenv/config";
import express from "express";
import connectDatabase from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(express.json({ limit: "32kb" }));
app.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});
app.use("/api", apiRoutes);
app.use(errorHandler);

if (process.env.VERCEL !== "1") {
  connectDatabase()
    .then(() => app.listen(port, () => console.log(`API listening on http://localhost:${port}`)))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}

export default app;
