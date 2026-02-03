 import http from "http";

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

  // Gemini AI endpoint
  if (req.method === "POST" && req.url === "/api/ai") {
    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const { text } = JSON.parse(body || "{}");

        const aiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
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

        const data = await aiResponse.json();

        let reply = "Gemini se jawab nahi mila";

        if (
          data.candidates &&
          data.candidates[0] &&
          data.candidates[0].content &&
          data.candidates[0].content.parts &&
          data.candidates[0].content.parts[0]
        ) {
          reply = data.candidates[0].content.parts[0].text;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: true, reply }));

      } catch (err) {
        res.writeHead(500);
        res.end(JSON.stringify({
          success: false,
          error: err.message
        }));
      }
    });
    return;
  }

  // Root
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("PK Voice AI backend with GEMINI FREE 🤖");

});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
