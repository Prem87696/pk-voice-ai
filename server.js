import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

/* ===== Middleware ===== */
app.use(cors());
app.use(express.json());

/* ===== ENV ===== */
const API_KEY = process.env.API_KEY; // Railway Variables me set hoga
const PORT = process.env.PORT || 3001;

/* ===== API Route ===== */
app.post("/api/ai", async (req, res) => {
  try {
    const userText = req.body.text;
    if (!userText) {
      return res.status(400).json({ error: "Text missing" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: "You are a helpful Hindi AI assistant." },
            { role: "user", content: userText }
          ],
        }),
      }
    );

    const data = await response.json();

    res.json({
      reply: data.choices?.[0]?.message?.content || "No response",
    });

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "AI server error" });
  }
});

/* ===== Server Start ===== */
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});
