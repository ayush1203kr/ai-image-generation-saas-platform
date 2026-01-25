import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

/* ===============================
   CORS — FINAL (AUTO-ALLOW)
================================ */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);

      // allow localhost
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // allow ALL Vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // allow ALL Cloudflare quick tunnels
      if (origin.endsWith(".trycloudflare.com")) {
        return callback(null, true);
      }

      // block everything else
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
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

/* ===============================
   HEALTH CHECK
================================ */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
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
