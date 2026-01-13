import "dotenv/config";
import express from "express";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();

/**
 * DYNAMIC CORS - The Permanent Fix
 * This mirrors whatever port your local machine uses.
 */
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Automatically allow any localhost port
    if (origin && origin.startsWith('http://localhost:')) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-rtb-fingerprint-id");
    res.header("Access-Control-Allow-Credentials", "true");

    // Handle Preflight
    if (req.method === "OPTIONS") {
        return res.status(200).json({});
    }
    next();
});

app.use(express.json());

const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ MongoDB Connected");

        app.use("/api/users", userRouter);
        app.use("/api/image", imageRouter);

        app.get("/", (req, res) => res.send("API is Live"));

        const PORT = process.env.PORT || 4000;
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server running on http://65.1.107.122:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Startup Error:", error.message);
    }
};

startServer();