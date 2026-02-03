import express from "express";
import cors from "cors";

const app = express();

/* ---- MIDDLEWARE ---- */
app.use(express.json());

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.options("*", cors());

/* ---- HEALTH CHECK ---- */
app.get("/", (req, res) => {
  res.status(200).send("PK Voice AI Backend is LIVE 🚀");
});

/* ---- API ---- */
app.post("/api/ai", (req, res) => {
  const { prompt } = req.body || {};
  res.json({
    reply: `Tumne bola: ${prompt}`
  });
});

/* ---- START SERVER ---- */
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
