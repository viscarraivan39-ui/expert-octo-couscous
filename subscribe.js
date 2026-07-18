// /api/subscribe.js
// Función serverless de Vercel. Recibe { email } por POST desde el
// formulario de la landing y lo guarda en Vercel KV (Redis administrado por
// Vercel, plan gratis). No requiere ningún paquete npm: usa la REST API de
// KV directamente con fetch, así el proyecto sigue sin necesitar build step.
//
// Requiere que el proyecto tenga una base de datos Vercel KV conectada
// (Vercel Dashboard → tu proyecto → Storage → Create Database → KV).
// Al conectarla, Vercel agrega automáticamente las variables de entorno
// KV_REST_API_URL y KV_REST_API_TOKEN — no hay que escribirlas a mano.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const email = String(body.email || '').trim().toLowerCase();
  const honeypot = String(body.empresa || '').trim();

  // Honeypot: si un bot llenó el campo "empresa" (oculto para humanos),
  // respondemos 200 igual (para no delatar el honeypot) pero no guardamos nada.
  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Ingresa un correo válido.' });
  }

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    console.error('Faltan KV_REST_API_URL / KV_REST_API_TOKEN. ¿Conectaste una base de datos KV al proyecto en Vercel?');
    return res.status(500).json({ error: 'El servidor no está configurado todavía. Intenta más tarde.' });
  }

  try {
    // SADD subscribers:emails <email>  -> lo agrega a un set (evita duplicados)
    const addResp = await fetch(
      `${KV_URL}/sadd/subscribers%3Aemails/${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${KV_TOKEN}` } }
    );
    const addResult = await addResp.json();
    // Upstash SADD devuelve 1 si es nuevo, 0 si ya existía.
    const alreadySubscribed = addResult.result === 0;

    if (!alreadySubscribed) {
      // Guardamos también la fecha de suscripción en un hash aparte.
      await fetch(
        `${KV_URL}/hset/subscribers%3Adates/${encodeURIComponent(email)}/${encodeURIComponent(new Date().toISOString())}`,
        { headers: { Authorization: `Bearer ${KV_TOKEN}` } }
      );
    }

    return res.status(200).json({ ok: true, alreadySubscribed });
  } catch (err) {
    console.error('Error guardando suscripción:', err);
    return res.status(500).json({ error: 'No se pudo guardar tu correo. Intenta de nuevo.' });
  }
}
