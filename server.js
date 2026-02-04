import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

// ====== MIDDLEWARE ======
app.use(cors());
app.use(express.json());

// ====== ROOT CHECK ======
app.get("/", (req, res) => {
  res.send("PK Voice AI backend running ✅");
});

// ====== AI API ROUTE ======
app.post("/api/ai", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.json({
        success: false,
        reply: "Text missing",
      });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return res.json({
        success: false,
        reply: "API key not found",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
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
      "No response from Gemini";

    res.json({
      success: true,
      reply,
    });
  } catch (err) {
    res.json({
      success: false,
      reply: "Server error",
      error: err.message,
    });
  }
});

// ====== START SERVER ======
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
