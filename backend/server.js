import "dotenv/config";
import cors from "cors";
import express from "express";
import connectDatabase from "./config/database.js";
import errorHandler from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "32kb" }));
app.use("/api", apiRoutes);
app.use(errorHandler);

async function startServer() {
  await connectDatabase();
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}

startServer().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
