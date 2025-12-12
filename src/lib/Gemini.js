const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL;

export async function getGeminiResponse(history, systemInstruction = "") {
  if (!GEMINI_API_KEY || !GEMINI_API_URL) {
    throw new Error("Missing Gemini API key or URL");
  }

  const contents = Array.isArray(history)
    ? history
    : [{ role: "user", parts: [{ text: history }] }];

  const body = { contents };

  // ✅ Correct field name
  if (systemInstruction) {
    body.systemInstruction = {
      role: "system",
      parts: [{ text: systemInstruction }],
    };
  }

  // 🔹 Make sure URL ends with `?key=YOUR_KEY`
  const url = `${GEMINI_API_URL}${GEMINI_API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // 🔹 Read raw text (prevents JSON parse crash)
  const raw = await response.text();

  if (!raw) {
    console.error("❌ Gemini returned empty body");
    throw new Error("Empty response from Gemini API");
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Gemini returned non-JSON:", raw);
    throw new Error("Invalid JSON from Gemini API");
  }

  if (!response.ok) {
    console.error("❌ Gemini error:", data.error);
    throw new Error(data.error?.message || "Gemini API error");
  }

  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text ||
    data.candidates?.[0]?.output_text ||
    "";

  return text?.replace("*", "").trim();
}
