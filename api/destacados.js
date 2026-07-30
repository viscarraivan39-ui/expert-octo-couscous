// /api/destacados.js
//
// Endpoint público (sin clave) que la página web llama para mostrar los
// "Producto Destacado" guardados en KV por /api/cron/fetch-destacado.js.

import { rateLimit } from '../lib/rateLimit.js';

export default async function handler(req, res) {
  if (!(await rateLimit(req, res))) return;

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json({ destacados: [] });
  }

  try {
    const resp = await fetch(`${KV_URL}/get/destacados%3Achile`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    const data = await resp.json();

    if (!data.result) {
      return res.status(200).json({ destacados: [] });
    }

    let destacados = [];
    try {
      const parsed = JSON.parse(data.result);
      destacados = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
    } catch {
      destacados = [];
    }

    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    return res.status(200).json({ destacados });
  } catch (err) {
    console.error('Error leyendo destacados:', err);
    return res.status(200).json({ destacados: [] });
  }
}
