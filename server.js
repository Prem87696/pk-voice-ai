const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Health check =====
app.get("/", (req, res) => {
  res.send("PK Voice AI backend running ✅");
});

// ===== AI Route =====
app.post("/api/ai", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.json({ success: false, reply: "No text provided" });
    }

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) {
      return res.json({ success: false, reply: "Gemini API key missing" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Gemini no response";

    res.json({ success: true, reply });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.json({ success: false, reply: "Server error" });
  }
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
