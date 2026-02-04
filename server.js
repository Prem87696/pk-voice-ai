// server.js (ES Module)
import express from "express";
import cors from "cors";

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
    
    // 1. Check if text exists
    if (!text) {
      return res.status(400).json({ success: false, reply: "Text missing" });
    }

    // 2. Check if API Key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, reply: "Server error: API Key missing" });
    }

    // 3. Stable Gemini URL (v1/gemini-pro is most reliable)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: text }] }]
      })
    });

    const data = await response.json();

    // 4. Detailed Error Handling for API Response
    if (data.error) {
      console.error("Google API Error Details:", data.error);
      return res.status(data.error.code || 500).json({ 
        success: false, 
        reply: `Google API Error: ${data.error.message}` 
      });
    }

    // 5. Extract Text Safely
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      return res.json({ success: true, reply });
    } else {
      return res.json({ 
        success: false, 
        reply: "AI generated an empty response. This could be due to safety filters." 
      });
    }

  } catch (err) {
    console.error("Critical Server Error:", err);
    res.status(500).json({ success: false, reply: "Internal Server Error: " + err.message });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});
