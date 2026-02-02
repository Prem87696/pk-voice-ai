// server.js (Node 18+ FINAL FIX)
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 APNI REAL GROQ API KEY YAHAN PASTE KARO
const API_KEY = process.env.API_KEY; // 🔐 secret from env

app.post("/api/ai", async (req, res) => {
  try {
    const userText = req.body.text;
    if (!userText) {
      return res.status(400).json({ error: "No input text" });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + API_KEY
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: "Tum ek helpful Hindi/English AI assistant ho." },
            { role: "user", content: userText }
          ]
        })
      }
    );

    const data = await response.json();
    console.log("Groq response:", data);

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({ error: "Invalid AI response", data });
    }

    res.json(data);

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "AI server crashed" });
  }
});

app.listen(3001, () => {
  console.log("✅ Groq AI server running on http://localhost:3001");
});