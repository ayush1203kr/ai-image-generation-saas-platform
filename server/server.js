import "dotenv/config";
import express from "express";
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();

// 1. MANUAL CORS MIDDLEWARE (MUST BE AT THE TOP)
app.use((req, res, next) => {
    // This matches the 'Referer' seen in your screenshot
    res.header("Access-Control-Allow-Origin", "http://localhost:5175");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");

    // 2. IMMEDIATE RESPONSE FOR PREFLIGHT (OPTIONS)
    // This fixes the 'Response Headers (0)' issue in your screenshot
    if (req.method === "OPTIONS") {
        console.log(`✅ CORS Preflight handled for: ${req.url}`);
        return res.status(204).send(); 
    }
    next();
});

app.use(express.json());

const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ Database Connected");

        app.use("/api/users", userRouter);
        app.use("/api/image", imageRouter);

        app.get("/", (req, res) => res.send("API is Live on AWS"));

        const PORT = process.env.PORT || 4000;
        // Bind to 0.0.0.0 is mandatory for AWS accessibility
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server fully live on http://65.1.107.122:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Startup Error:", error.message);
    }
};

startServer();