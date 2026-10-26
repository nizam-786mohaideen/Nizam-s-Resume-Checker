import mongoose from "mongoose";

export default async function connectDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error("Set MONGODB_URI in backend/.env before starting the API.");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");
}

export function getDatabaseStatus() {
  return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
}
