import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

/* ===============================
   CORS — FINAL & BULLETPROOF
================================ */
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // curl, server-side
    if (origin.startsWith("http://localhost")) return callback(null, true);
    if (origin.endsWith(".vercel.app")) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

/* 🔥 THIS IS CRITICAL */
app.options("*", cors(corsOptions)); // <-- handles preflight properly

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
  res.send("API is running...");
});

/* ===============================
   START SERVER
================================ */
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB Connected");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed:", err.message);
    process.exit(1);
  }
};

startServer();
