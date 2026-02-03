import express from "express";
import cors from "cors";

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors({
  origin: "*",               // अभी testing के लिए open
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

/* ===== TEST ROUTE ===== */
app.get("/", (req, res) => {
  res.send("PK Voice AI is running 🚀");
});

/* ===== AI API ROUTE ===== */
app.post("/api/ai", async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text missing" });
    }

    // 🔹 अभी demo reply
    res.json({
      success: true,
      question: text,
      reply: "यह PK Voice AI का demo response है ✅"
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ===== PORT (Railway Compatible) ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
