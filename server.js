import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// health check
app.get("/", (req, res) => {
  res.send("PK Voice AI backend running ✅");
});

app.post("/api/ai", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.json({ success: false, reply: "No input text" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
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
      "Gemini did not return any text";

    res.json({ success: true, reply });

  } catch (err) {
    res.json({
      success: false,
      reply: "Gemini error",
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
