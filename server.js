 import http from "http";

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

  // CORS (frontend se request allow karne ke liye)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Browser ka preflight request
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // API route
  if (req.method === "POST" && req.url === "/api/ai") {
    let body = "";

    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const data = JSON.parse(body || "{}");

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({
        success: true,
        reply: "Tumne poocha: " + data.text
      }));
    });
    return;
  }

  // Default page
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("PK Voice AI backend running ✅");

});

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
