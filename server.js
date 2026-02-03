import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

/* ===============================
   CORS – MUST BE AT TOP
================================ */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors()); // 🔥 VERY IMPORTANT

app.use(express.json());

/* ===============================
   TEST ROUTE
================================ */
app.get("/", (req, res) => {
  res.send("PK Voice AI Backend Running 🚀");
});

/* ===============================
   AI ROUTE
================================ */
app.post("/api/ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ reply: "Prompt missing" });
    }

    // 🔁 demo response (testing ke liye)
    // yaha baad me AI API call kar sakte ho
    res.json({
      reply: `Tumne poocha: ${prompt}`
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Server error" });
  }
});

/* ===============================
   PORT (Railway)
================================ */
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
