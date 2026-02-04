// server.js  (ES Module)

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

// ===== MIDDLEWARE =====
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("PK Voice AI backend running ✅");
});

// ===== AI API =====
app.post("/api/ai", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.json({ success: false, reply: "Text missing" });
    }

    // ===== GEMINI =====
    if (process.env.GEMINI_API_KEY) {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text }] }]
          })
        }
      );

      const data = await response.json();

      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini";

      return res.json({ success: true, reply });
    }

    // ===== FALLBACK =====
    res.json({ success: false, reply: "No AI key configured" });

  } catch (err) {
    console.error("AI Error:", err);
    res.json({ success: false, reply: err.message });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
