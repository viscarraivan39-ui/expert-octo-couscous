// /api/cron/fetch-destacado.js
//
// Cada 2-3 días (cron externo en cron-job.org, ver nota abajo) elige un
// producto real del catálogo (data/productos.json, la misma fuente que usa
// el sitio) — prioriza el de mayor descuento entre los que no salieron
// destacados recientemente — y genera un artículo: qué es, specs, para qué
// sirve, qué tan bueno es. Usa la FOTO REAL del producto (no imagen de IA),
// porque es lo más honesto para algo que se presenta como reseña.
//
// Guarda el resultado en Vercel KV (mismo KV que usa fetch-offers.js), en
// una lista "destacados:chile" con los últimos 30, para tener historial.
//
// ─── VARIABLES DE ENTORNO NECESARIAS ───────────────────────────────────────
//   GROQ_API_KEY, NVIDIA_API_KEY (respaldo), KV_REST_API_URL,
//   KV_REST_API_TOKEN, CRON_SECRET / ADMIN_KEY (mismas que fetch-offers.js)
//
// ─── PROGRAMACIÓN ───────────────────────────────────────────────────────────
// El plan Hobby de Vercel ya usa su único cron nativo diario en
// fetch-offers.js — este se dispara desde cron-job.org, cada 2-3 días,
// pegándole a /api/cron/fetch-destacado?key=ADMIN_KEY

const MAX_HISTORY = 30;
const RECENT_AVOID = 10; // no repetir un producto que salió en los últimos N destacados

function parseDiscount(off) {
  if (!off) return 0;
  const n = parseInt(String(off).replace(/[^0-9-]/g, ''), 10);
  return Number.isFinite(n) ? Math.abs(n) : 0;
}

async function loadCatalog() {
  const resp = await fetch('https://www.avispateya.cl/data/productos.json');
  if (!resp.ok) throw new Error(`No se pudo leer el catálogo (HTTP ${resp.status})`);
  return resp.json();
}

async function kvGet(kvUrl, kvToken, key) {
  const resp = await fetch(`${kvUrl}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${kvToken}` },
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  if (!data.result) return null;
  try {
    const parsed = JSON.parse(data.result);
    return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
  } catch {
    return null;
  }
}

async function kvSet(kvUrl, kvToken, key, value) {
  const resp = await fetch(`${kvUrl}/set/${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${kvToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(JSON.stringify(value)),
  });
  if (!resp.ok) throw new Error(`KV rechazó la escritura (HTTP ${resp.status}): ${await resp.text()}`);
}

function pickProduct(catalog, recentLinks) {
  const candidatos = catalog.filter((p) => p.price && !recentLinks.includes(p.link));
  const pool = candidatos.length ? candidatos : catalog.filter((p) => p.price);
  return pool.reduce((best, p) => (parseDiscount(p.off) > parseDiscount(best.off) ? p : best), pool[0]);
}

function buildPrompt(producto) {
  return `Actuás como un redactor de reseñas de productos honesto y directo, para la sección "Producto Destacado" de un sitio de ofertas chileno (AvíspateYa). Te paso los datos reales de un producto — nunca inventes specs que no te doy, y si no tenés un dato específico, hablá en términos generales de esa categoría de producto en vez de inventar un número.

Producto: ${producto.name}
Categoría: ${producto.cat}
Tienda: ${producto.store}
Precio actual: $${producto.price}${producto.old ? ` (antes $${producto.old}, ${producto.off} de descuento)` : ''}

Escribí un artículo breve tipo "producto destacado":
1. Qué es el producto y para quién/qué uso sirve (trabajo, gaming, hogar, deporte, etc. — el que corresponda según el nombre)
2. Sus características principales, basándote SOLO en lo que el nombre del producto ya dice (no inventes specs técnicas que no están ahí)
3. Por qué esta oferta puntual vale la pena (o si el descuento es chico, sé honesto y no lo exageres)
4. Una valoración final honesta — no todo producto es "el mejor", si es una opción correcta y sin más, decilo así

Español de Chile, tono cercano pero informativo, sin exagerar con superlativos vacíos.

Devolvé SOLO un JSON válido (sin markdown, sin \`\`\`) con esta forma exacta:
{"titulo": "...", "resumen": "1-2 líneas para la vista previa", "contenido_html": "<p>...</p><p>...</p>...", "copy_instagram": "..."}

- "contenido_html": 3-5 párrafos <p>, total 200-350 palabras.
- "copy_instagram": versión corta para redes, gancho + precio + link implícito, máximo 500 caracteres.`;
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end === -1) throw new Error('No se encontró JSON en la respuesta del modelo');
    return JSON.parse(text.slice(start, end + 1));
  }
}

async function writeWithGroq(prompt) {
  const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      max_tokens: 1800,
    }),
  });
  if (!resp.ok) throw new Error(`Groq HTTP ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error(`Groq no devolvió contenido: ${JSON.stringify(data)}`);
  return parseJson(text);
}

async function writeWithNvidia(prompt) {
  const resp = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'meta/llama-3.3-70b-instruct',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 1800,
    }),
  });
  if (!resp.ok) throw new Error(`NVIDIA NIM HTTP ${resp.status}: ${await resp.text()}`);
  const data = await resp.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error(`NVIDIA NIM no devolvió contenido: ${JSON.stringify(data)}`);
  return parseJson(text);
}

async function writeReview(prompt) {
  try {
    return await writeWithGroq(prompt);
  } catch (err) {
    console.error('Groq falló, reintento con NVIDIA:', err.message || err);
    if (!process.env.NVIDIA_API_KEY) throw err;
    return await writeWithNvidia(prompt);
  }
}

export default async function handler(req, res) {
  const authHeader = req.headers.authorization;
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const providedKey = req.query.key;
  const isManualTrigger = providedKey && providedKey === process.env.ADMIN_KEY;

  if (!isVercelCron && !isManualTrigger) {
    return res.status(401).json({ error: 'No autorizado.' });
  }

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ error: 'No hay base de datos KV conectada.' });
  }

  try {
    const catalog = await loadCatalog();
    const historial = (await kvGet(KV_URL, KV_TOKEN, 'destacados:chile')) || [];
    const recentLinks = historial.slice(0, RECENT_AVOID).map((d) => d.link);

    const producto = pickProduct(catalog, recentLinks);
    if (!producto) throw new Error('No hay productos disponibles en el catálogo.');

    const review = await writeReview(buildPrompt(producto));

    const entry = {
      titulo: review.titulo,
      resumen: review.resumen,
      contenido_html: review.contenido_html,
      copy_instagram: review.copy_instagram,
      producto: {
        name: producto.name,
        img: producto.img,
        price: producto.price,
        old: producto.old,
        off: producto.off,
        link: producto.link,
        store: producto.store,
        cat: producto.cat,
      },
      publicado_en: new Date().toISOString(),
    };

    const nuevoHistorial = [entry, ...historial].slice(0, MAX_HISTORY);
    await kvSet(KV_URL, KV_TOKEN, 'destacados:chile', nuevoHistorial);

    return res.status(200).json({ ok: true, titulo: entry.titulo, producto: producto.name });
  } catch (err) {
    console.error('Error generando el producto destacado:', err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}
