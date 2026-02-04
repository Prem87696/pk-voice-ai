// server.js
import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = process.env.PORT || 8080;

/* ---------- Middlewares ---------- */
app.use(cors());
app.use(express.json());

/* ---------- Gemini Setup ---------- */
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ---------- Home Route ---------- */
app.get("/", (req, res) => {
  res.send("PK Voice AI backend running ✅");
});

/* ---------- AI Route ---------- */
app.post("/api/ai", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.json({
        success: false,
        reply: "Text missing"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"   // FREE & fast
    });

    const result = await model.generateContent(text);
    const reply = result.response.text();

    return res.json({
      success: true,
      reply
    });

  } catch (err) {
    console.error("❌ Gemini Error:", err.message);
    return res.json({
      success: false,
      reply: "Gemini error: " + err.message
    });
  }
});

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
