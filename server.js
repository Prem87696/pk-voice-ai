import express from "express";
import cors from "cors";

const app = express();

/* ===== OPEN CORS (NO BLOCKING) ===== */
app.use(cors());
app.options("*", cors());

app.use(express.json());

/* ===== ROOT TEST ===== */
app.get("/", (req, res) => {
  res.status(200).send("PK Voice AI is running 🚀");
});

/* ===== API ===== */
app.post("/api/ai", (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text missing" });
    }

    res.status(200).json({
      success: true,
      reply: "PK Voice AI working perfectly ✅"
    });

  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/* ===== PORT ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
