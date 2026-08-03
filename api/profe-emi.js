// /api/profe-emi.js
// Proxy a Groq para el widget de Profe Emi: usa la clave del servidor
// (GROQ_API_KEY en Vercel) para que el visitante no tenga que conseguir
// ni pegar su propia clave. Rate limit por IP para evitar abuso de cuota.
import { rateLimit } from '../lib/rateLimit.js';

export default async function handler(req, res) {
  if (!(await rateLimit(req, res, { limit: 20, windowSeconds: 60, blockSeconds: 300 }))) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const mensajes = body.mensajes;
  if (!Array.isArray(mensajes) || mensajes.length === 0) {
    return res.status(400).json({ error: 'Faltan mensajes.' });
  }
  if (mensajes.length > 60) {
    return res.status(400).json({ error: 'Conversación demasiado larga.' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error('Falta GROQ_API_KEY.');
    return res.status(500).json({ error: 'El servidor no está configurado todavía. Intenta más tarde.' });
  }

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: mensajes,
        temperature: 0.4,
      }),
    });

    if (!resp.ok) {
      const detalle = await resp.text();
      console.error('Groq error:', resp.status, detalle);
      return res.status(502).json({ error: 'Profe Emi no está disponible en este momento.' });
    }

    const data = await resp.json();
    const texto = data.choices?.[0]?.message?.content || '';
    return res.status(200).json({ texto });
  } catch (err) {
    console.error('Error llamando a Groq:', err);
    return res.status(500).json({ error: 'No se pudo conectar con Profe Emi.' });
  }
}
