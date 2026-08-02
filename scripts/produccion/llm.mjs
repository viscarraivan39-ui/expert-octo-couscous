// Cliente LLM compartido para el equipo de producción (guionistas + validador
// de contenido). Mismo patrón que api/cron/fetch-destacado.js: Groq primero
// (rápido, gratis dentro de límites), NVIDIA NIM como respaldo si Groq falla
// o si no hay GROQ_API_KEY configurada localmente.

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("No se encontró JSON en la respuesta del modelo");
    return JSON.parse(text.slice(start, end + 1));
  }
}

async function llamarGroq(prompt) {
  const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 2500,
      temperature: 0.9,
    }),
  });
  if (!resp.ok) throw new Error(`Groq HTTP ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error(`Groq no devolvió contenido: ${JSON.stringify(data)}`);
  return parseJson(text);
}

async function llamarNvidia(prompt) {
  const resp = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "meta/llama-3.3-70b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      max_tokens: 2500,
    }),
  });
  if (!resp.ok) throw new Error(`NVIDIA NIM HTTP ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error(`NVIDIA NIM no devolvió contenido: ${JSON.stringify(data)}`);
  return parseJson(text);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function pedirJSON(prompt, intento = 0) {
  if (process.env.GROQ_API_KEY) {
    try {
      return await llamarGroq(prompt);
    } catch (err) {
      console.log(`      ⚠ Groq falló (${err.message}), reintento con NVIDIA`);
    }
  }
  if (!process.env.NVIDIA_API_KEY) throw new Error("Falta GROQ_API_KEY y NVIDIA_API_KEY en el entorno");
  try {
    return await llamarNvidia(prompt);
  } catch (err) {
    // 504/429/5xx transitorios de NVIDIA son comunes sin Groq de respaldo —
    // reintentar en vez de tirar abajo todo el guion por un timeout puntual.
    if (intento < 2) {
      console.log(`      ⚠ NVIDIA falló (${err.message}), reintentando (${intento + 1}/2)...`);
      await sleep(5000 * (intento + 1));
      return pedirJSON(prompt, intento + 1);
    }
    throw err;
  }
}
