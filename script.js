async function askAI() {
  const question = document.getElementById("q").value;

  document.getElementById("res").innerText = "Thinking... ⏳";

  try {
    const r = await fetch(
      "https://pk-voice-ai-production.up.railway.app/api/ai",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question })
      }
    );

    const data = await r.json();
    document.getElementById("res").innerText = data.reply;

  } catch (e) {
    document.getElementById("res").innerText =
      "Server se response nahi mila ❌";
  }
}
