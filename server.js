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
    
    if (!text) {
      return res.status(400).json({ success: false, reply: "Text missing in request body" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, reply: "API Key is not configured on server" });
    }

    // Gemini 1.5 Flash का उपयोग करना बेहतर है (Latest & Fast)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: text }] }]
      })
    });

    const data = await response.json();

    // Debugging के लिए: Railway Logs में पूरा response देखने के लिए
    console.log("Gemini Raw Response:", JSON.stringify(data));

    // अगर Google कोई एरर भेजता है
    if (data.error) {
      return res.status(data.error.code || 500).json({ 
        success: false, 
        reply: `Google API Error: ${data.error.message}` 
      });
    }

    // Response से टेक्स्ट निकालना
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      return res.json({ success: true, reply });
    } else {
      // अगर safety filters की वजह से जवाब न मिले
      return res.json({ 
        success: false, 
        reply: "AI could not generate a response (Safety filters or empty result)." 
      });
    }

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ success: false, reply: "Internal Server Error: " + err.message });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
