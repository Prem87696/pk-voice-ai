import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
  res.send("PK Voice AI backend running ✅");
});

app.post("/api/ai", async (req, res) => {
  try {
    const text = req.body.text;
    if (!text) {
      return res.json({ success: false, reply: "No input text" });
    }

   const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

    const data = await geminiRes.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return res.json({
        success: false,
        reply: "Gemini returned empty response",
        raw: data
      });
    }

    res.json({ success: true, reply });

  } catch (e) {
    res.json({ success: false, reply: e.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

