 // server.js
import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("PK Voice AI backend with GEMINI FREE 🤖");
});

app.post("/api/ai", async (req, res) => {
  try {
    const userText = req.body.text;
    if (!userText) {
      return res.json({ success: false, reply: "No text received" });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return res.json({ success: false, reply: "Gemini API key missing" });
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
      geminiKey;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userText }]
          }
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply from Gemini";

    res.json({ success: true, reply });
  } catch (err) {
    res.json({ success: false, reply: "Server error: " + err.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
