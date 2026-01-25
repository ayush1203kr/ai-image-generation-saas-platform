import express from "express";

/* ===============================
   🔥 MANUAL CORS — MUST BE FIRST
================================ */
const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (
    origin &&
    (origin.startsWith("http://localhost") ||
      origin.endsWith(".vercel.app"))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

/* ===============================
   EVERYTHING ELSE AFTER
================================ */
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
import imageRouter from "./routes/imageRoutes.js";

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/image", imageRouter);

app.get("/", (req, res) => {
  res.send("API is running...");
});

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
