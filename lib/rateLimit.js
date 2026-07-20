// /lib/rateLimit.js
//
// Rate limiting simple por IP usando Vercel KV (mismo KV que ya usan
// offers.js/fetch-offers.js). Ventana fija de `windowSeconds` con límite
// `limit`; si se excede, la IP queda bloqueada `blockSeconds` adicionales.
//
// Uso en un handler de /api:
//   if (!(await rateLimit(req, res))) return;

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export async function rateLimit(req, res, { limit = 60, windowSeconds = 60, blockSeconds = 300 } = {}) {
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  if (!KV_URL || !KV_TOKEN) return true; // sin KV configurado, no bloqueamos

  const ip = getClientIp(req);
  const headers = { Authorization: `Bearer ${KV_TOKEN}` };

  const blockResp = await fetch(`${KV_URL}/get/blocked:${encodeURIComponent(ip)}`, { headers });
  const blockData = await blockResp.json();
  if (blockData.result) {
    res.setHeader('Retry-After', String(blockSeconds));
    res.status(429).json({ error: 'Demasiadas solicitudes. Intentá de nuevo en unos minutos.' });
    return false;
  }

  const bucket = Math.floor(Date.now() / 1000 / windowSeconds);
  const countKey = `ratelimit:${ip}:${bucket}`;
  const incrResp = await fetch(`${KV_URL}/incr/${encodeURIComponent(countKey)}`, { headers });
  const incrData = await incrResp.json();
  const count = incrData.result;

  if (count === 1) {
    await fetch(`${KV_URL}/expire/${encodeURIComponent(countKey)}/${windowSeconds + 5}`, { headers });
  }

  if (count > limit) {
    await fetch(`${KV_URL}/setex/blocked:${encodeURIComponent(ip)}/${blockSeconds}/1`, { headers });
    res.setHeader('Retry-After', String(blockSeconds));
    res.status(429).json({ error: 'Demasiadas solicitudes. Intentá de nuevo en unos minutos.' });
    return false;
  }

  return true;
}
