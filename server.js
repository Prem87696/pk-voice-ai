 import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PK Voice AI backend running ✅");
});

app.post("/api/ai", async (req, res) => {
  try {
    const text = req.body.text;
    if (!text) {
      return res.json({ success: false, reply: "Text missing" });
    }

    // Gemini FREE
    const gRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text }] }]
        })
      }
    );

    const gData = await gRes.json();

    if (gData?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return res.json({
        success: true,
        reply: gData.candidates[0].content.parts[0].text
      });
    }

    return res.json({
      success: false,
      reply: "Gemini no response"
    });

  } catch (err) {
    console.error("Server error:", err.message);
    return res.status(500).json({
      success: false,
      reply: "Backend crashed ❌"
    });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
