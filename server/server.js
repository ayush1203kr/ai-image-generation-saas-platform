import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

/* ===============================
   CORS — SIMPLE & CORRECT
================================ */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://ai-image-generation-saas-platform.vercel.app",
    ],
    credentials: true,
  })
);

/* ===============================
   MIDDLEWARE
================================ */
app.use(express.json());

/* ===============================
   ROUTES
================================ */
app.use("/api/users", userRouter);
app.use("/api/image", imageRouter);

app.get("/", (req, res) => {
  res.send("API is live 🚀");
});

/* ===============================
   START SERVER
================================ */
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://65.1.107.122:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed:", err.message);
    process.exit(1);
  }
};

startServer();
