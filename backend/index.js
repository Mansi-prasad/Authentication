import express from "express";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin.routes.js";
import { createClient } from "redis";
import cookieParser from "cookie-parser";
import cors from "cors";

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
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }),
);

// routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", adminRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
