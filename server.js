import express from "express";
import cors from "cors";

const app = express();

/* ===== CORS (MOST IMPORTANT PART) ===== */
app.use(cors({
  origin: "https://prem87696.github.io",   // GitHub Pages domain
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

// 🔥 Preflight fix (THIS SOLVES YOUR ERROR)
app.options("*", cors());

app.use(express.json());

/* ===== TEST ROUTE ===== */
app.get("/", (req, res) => {
  res.send("PK Voice AI is running 🚀");
});

/* ===== API ROUTE ===== */
app.post("/api/ai", (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text missing" });
  }

  res.json({
    success: true,
    reply: "यह PK Voice AI का सही response है ✅"
  });
});

/* ===== PORT ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
