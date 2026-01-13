import userModel from "../models/userModel.js";
import FormData from "form-data";
import axios from "axios";

export const generateImage = async (req, res) => {
  try {
    const userId = req.userId; 
    const { prompt } = req.body;

    if (!prompt) {
      return res.json({ success: false, message: "Prompt is required" });
    }

    const user = await userModel.findById(userId);
    if (!user || user.creditBalance <= 0) {
      return res.json({ 
        success: false, 
        message: user ? "Insufficient credits" : "User not found",
        creditBalance: user?.creditBalance 
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    user.creditBalance -= 1;
    await user.save();

    // ✅ FIX: Changed 'resultImage' to 'image' to match your Frontend/AppContext expectations
    res.json({
      success: true,
      message: "Image Generated",
      creditBalance: user.creditBalance,
      image: resultImage, 
    });

  } catch (error) {
    console.log("Image generation error:", error.message);
    res.json({ success: false, message: error.message });
  }
};