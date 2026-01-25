import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();
const PORT = process.env.PORT || 4000;

/* ===============================
   CORS — FINAL & CORRECT
   - Allows localhost (dev)
   - Allows ALL *.vercel.app (preview + prod)
   - Blocks everything else
================================ */
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (curl, server-to-server)
      if (!origin) return callback(null, true);

      // allow localhost (development)
      if (origin.startsWith("http://localhost")) {
        return callback(null, true);
      }

      // allow all Vercel deployments (preview + production)
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      // otherwise block
      return callback(new Error("Not allowed by CORS"));
    },
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
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed:", err.message);
    process.exit(1);
  }
};

startServer();
