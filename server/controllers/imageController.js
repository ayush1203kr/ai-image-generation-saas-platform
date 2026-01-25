import axios from "axios";
import userModel from "../models/userModel.js";

export const generateImage = async (req, res) => {
  try {
    const { prompt } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.creditBalance <= 0) {
      return res.status(403).json({
        success: false,
        message: "Insufficient credits",
        creditBalance: user.creditBalance,
      });
    }

    // 🔥 Generate image FIRST
    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      { prompt },
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    if (!response.data) {
      return res.status(502).json({
        success: false,
        message: "Image generation failed",
      });
    }

    // 🔥 Deduct credit AFTER successful generation
    user.creditBalance = user.creditBalance - 1;
    await user.save();

    const base64 = Buffer.from(response.data).toString("base64");

    // 🔥 ALWAYS RETURN CREDIT
    return res.json({
      success: true,
      image: `data:image/png;base64,${base64}`,
      creditBalance: user.creditBalance, // ✅ GUARANTEED
    });

  } catch (err) {
    console.error("Image generation error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Image generation failed",
    });
  }
};

