import "dotenv/config";
import express from "express";
import cors from "cors"; // ✅ Better for production
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRouter.js";
import imageRouter from "./routes/imageRoutes.js";

const app = express();

// ✅ FIX: Proper CORS configuration for Vercel
app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://ai-image-generation-saas-platform.vercel.app'
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"]
}));

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
            console.log(`🚀 Server running on PORT: ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Startup Error:", error.message);
    }
};

startServer();