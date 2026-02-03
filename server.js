import express from "express";
import cors from "cors";

const app = express();

/* ---- CORS ---- */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));
app.options("*", cors());

app.use(express.json());

/* ---- ROOT ---- */
app.get("/", (req, res) => {
  res.status(200).send("PK Voice AI Backend is LIVE 🚀");
});

/* ---- API ---- */
app.post("/api/ai", async (req, res) => {
  const { prompt } = req.body;
  res.json({
    reply: `Tumne bola: ${prompt}`
  });
});

/* ---- PORT (VERY IMPORTANT) ---- */
const PORT = process.env.PORT || 8080;
app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
