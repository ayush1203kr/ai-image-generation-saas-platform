import "dotenv/config";
import express from "express";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();

app.use((req, res, next) => {
    const origin = req.headers.origin;
    const allowedOrigins = [
        'http://localhost:5173', 
        'http://localhost:5174', 
        'http://localhost:5175',
        'https://ai-image-generation-saas-platform.vercel.app' // Add your Vercel URL here
    ];

    if (allowedOrigins.includes(origin) || (origin && origin.startsWith('http://localhost:'))) {
        res.header("Access-Control-Allow-Origin", origin);
    }
    
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-rtb-fingerprint-id");
    res.header("Access-Control-Allow-Credentials", "true");

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