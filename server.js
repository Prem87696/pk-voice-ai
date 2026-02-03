import http from "http";

const PORT = process.env.PORT || 3000;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

const server = http.createServer(async (req, res) => {

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/api/ai") {
    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { text } = JSON.parse(body || "{}");

        const aiRes = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${OPENAI_KEY}`
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [
                { role: "system", content: "Tum ek helpful Hindi AI ho" },
                { role: "user", content: text }
              ]
            })
          }
        );

        const aiData = await aiRes.json();
        const reply = aiData.choices[0].message.content;

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, reply }));

      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({ error: "AI error", detail: err.message }));
      }
    });
    return;
  }

  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("PK Voice AI backend with REAL AI 🤖");

});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
