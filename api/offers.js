// /api/offers.js
//
// Endpoint público (sin clave) que la página web llama para mostrar las
// ofertas automáticas guardadas en KV por /api/cron/fetch-offers.js.
// Devuelve un JSON con la lista de ofertas.

export default async function handler(req, res) {
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    return res.status(200).json({ offers: [] });
  }

  try {
    const resp = await fetch(`${KV_URL}/get/offers%3Achile%3Aauto`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    const data = await resp.json();

    if (!data.result) {
      return res.status(200).json({ offers: [] });
    }

    // El valor guardado es un JSON string (doble serializado), lo parseamos dos veces
    let offers = [];
    try {
      const parsed = JSON.parse(data.result);
      offers = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
    } catch {
      offers = [];
    }

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // cachea 1 hora
    return res.status(200).json({ offers });
  } catch (err) {
    console.error('Error leyendo ofertas:', err);
    return res.status(200).json({ offers: [] });
  }
}
