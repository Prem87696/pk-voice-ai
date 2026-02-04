import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8080;

// ===== Middleware =====
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

// ===== Test route =====
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

    // ===== Gemini API call =====
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
    res.json({
      success: false,
      reply: "Server AI error"
    });
  }
});

// ===== 404 fallback (IMPORTANT) =====
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ===== Start server =====
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
