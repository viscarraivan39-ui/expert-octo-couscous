// /api/subscribers.js
// Endpoint privado para que TÚ (el dueño del sitio) veas la lista de
// correos suscritos. Está protegido con una clave secreta (ADMIN_KEY) que
// tú defines en Vercel → Settings → Environment Variables.
//
// Cómo verla: visita
//   https://avispateya.cl/api/subscribers?key=TU_ADMIN_KEY
// (reemplaza TU_ADMIN_KEY por el valor que hayas puesto en Vercel).
// No compartas esa URL con nadie — quien la tenga puede ver todos los correos.

export default async function handler(req, res) {
  const providedKey = req.query.key;
  const ADMIN_KEY = process.env.ADMIN_KEY;

  if (!ADMIN_KEY) {
    return res.status(500).json({ error: 'Falta configurar ADMIN_KEY en Vercel (Settings → Environment Variables).' });
  }
  if (!providedKey || providedKey !== ADMIN_KEY) {
    return res.status(401).json({ error: 'No autorizado.' });
  }

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ error: 'No hay base de datos KV conectada todavía.' });
  }

  try {
    const resp = await fetch(`${KV_URL}/smembers/subscribers%3Aemails`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    });
    const data = await resp.json();
    const emails = data.result || [];
    return res.status(200).json({ count: emails.length, emails });
  } catch (err) {
    console.error('Error leyendo suscriptores:', err);
    return res.status(500).json({ error: 'No se pudo leer la lista.' });
  }
}
