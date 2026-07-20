// /api/subscribe.js
import { rateLimit } from '../lib/rateLimit.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (!(await rateLimit(req, res))) return;

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

  if (honeypot) {
    return res.status(200).json({ ok: true });
  }

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Ingresa un correo válido.' });
  }

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  if (!KV_URL || !KV_TOKEN) {
    console.error('Faltan KV_REST_API_URL / KV_REST_API_TOKEN.');
    return res.status(500).json({ error: 'El servidor no está configurado todavía. Intenta más tarde.' });
  }

  try {
    const addResp = await fetch(
      `${KV_URL}/sadd/subscribers%3Aemails/${encodeURIComponent(email)}`,
      { headers: { Authorization: `Bearer ${KV_TOKEN}` } }
    );
    const addResult = await addResp.json();
    const alreadySubscribed = addResult.result === 0;

    if (!alreadySubscribed) {
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
