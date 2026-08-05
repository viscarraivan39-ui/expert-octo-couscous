// /lib/rateLimit.js
//
// Rate limiting simple por IP usando Vercel KV (mismo KV que ya usan
// offers.js/fetch-offers.js). Ventana fija de `windowSeconds` con límite
// `limit`; si se excede, la IP queda bloqueada `blockSeconds` adicionales.
//
// Uso en un handler de /api:
//   if (!(await rateLimit(req, res))) return;
//   if (!(await rateLimit(req, res, { cerrarSiFalla: true }))) return; // endpoints sensibles
//
// Política de fallos (auditoría checklist-10-etapas, 2026-08-05 — antes
// esto fallaba abierto Y en silencio si faltaba KV, y las llamadas a KV no
// tenían try/catch ni timeout propio, mismo patrón ya corregido en
// profe-emi-web el día anterior):
//   - Si faltan las variables de entorno o KV no responde a tiempo: se
//     loguea SIEMPRE fuerte, con el prefijo "RATE LIMIT INACTIVO" para que
//     sea imposible de perder entre otros logs.
//   - `cerrarSiFalla: true` (endpoints sensibles/caros) rechaza la request
//     con 503 si el rate limit no está operativo. Por defecto (false) falla
//     abierto para no cortarle el servicio a nadie por un blip de KV.

const KV_TIMEOUT_MS = 2500;

function fetchConTimeout(url, opts) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), KV_TIMEOUT_MS);
  return fetch(url, { ...opts, signal: controller.signal }).finally(() => clearTimeout(timer));
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function reportarInactivo(res, motivo, cerrarSiFalla) {
  console.error(`[rateLimit] RATE LIMIT INACTIVO — ${motivo} — ${cerrarSiFalla ? 'FALLANDO CERRADO (bloqueando request, endpoint sensible)' : 'fallando abierto (sin límite aplicado esta request)'}`);
  if (cerrarSiFalla) {
    res.status(503).json({ error: 'Servicio temporalmente no disponible. Intentá de nuevo en unos minutos.' });
  }
}

export async function rateLimit(req, res, { limit = 60, windowSeconds = 60, blockSeconds = 300, cerrarSiFalla = false } = {}) {
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    reportarInactivo(res, 'faltan KV_REST_API_URL/KV_REST_API_TOKEN', cerrarSiFalla);
    return !cerrarSiFalla;
  }

  const ip = getClientIp(req);
  const headers = { Authorization: `Bearer ${KV_TOKEN}` };

  try {
    const blockResp = await fetchConTimeout(`${KV_URL}/get/blocked:${encodeURIComponent(ip)}`, { headers });
    const blockData = await blockResp.json();
    if (blockData.result) {
      res.setHeader('Retry-After', String(blockSeconds));
      res.status(429).json({ error: 'Demasiadas solicitudes. Intentá de nuevo en unos minutos.' });
      return false;
    }

    const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
    const countKey = `ratelimit:${ip}:${bucket}`;
    const incrResp = await fetchConTimeout(`${KV_URL}/incr/${encodeURIComponent(countKey)}`, { headers });
    const incrData = await incrResp.json();
    const count = incrData.result;

    if (count === 1) {
      await fetchConTimeout(`${KV_URL}/expire/${encodeURIComponent(countKey)}/${windowSeconds + 5}`, { headers });
    }

    if (count > limit) {
      await fetchConTimeout(`${KV_URL}/setex/blocked:${encodeURIComponent(ip)}/${blockSeconds}/1`, { headers });
      res.setHeader('Retry-After', String(blockSeconds));
      res.status(429).json({ error: 'Demasiadas solicitudes. Intentá de nuevo en unos minutos.' });
      return false;
    }

    return true;
  } catch (err) {
    reportarInactivo(res, `KV no respondió a tiempo (timeout o caída): ${err.message}`, cerrarSiFalla);
    return !cerrarSiFalla;
  }
}
