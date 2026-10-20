import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import { createClient } from "redis";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
await connectDB();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.log("Missing redis url");
  process.exit(1);
}

export const redisClient = createClient({
  url: redisUrl,
});

redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch(console.error);

//middleware
app.use(express.json());

// routes
app.use("/api/v1", userRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
