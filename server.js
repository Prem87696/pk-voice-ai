// 🔵 BACKEND FILE
// server.js

import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/ai", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.json({ reply: "Prompt missing" });
  }

  // 👉 Yahan tumhara AI logic / API call hoga
  res.json({
    reply: `Tumne pucha: ${prompt}`
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on", PORT));
