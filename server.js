import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());

/* ---------- CHECK ---------- */
app.get("/", (req, res) => {
  res.send("PK Voice AI backend running ✅");
});

/* ---------- AI API ---------- */
app.post("/api/ai", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        reply: "Text missing",
      });
    }

    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      return res.status(500).json({
        success: false,
        reply: "GEMINI_API_KEY not found in environment",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Gemini returned empty response";

    res.json({
      success: true,
      reply,
      raw: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      reply: err.message,
    });
  }
});

/* ---------- PORT ---------- */
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
