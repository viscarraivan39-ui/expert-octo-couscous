// /api/guia-personalizada.js
// Genera una guía PDF nueva a pedido del alumno sobre el tema que indique.
// El modelo (Groq, texto) inventa las preguntas originales; se arma el PDF
// con el mismo formato de las guías oficiales y se guarda la clave de
// respuestas en Vercel KV (nunca en el PDF) para poder corregirla después
// vía /api/omr.
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { rateLimit } from '../lib/rateLimit.js';
import { generarGuiaPDF } from '../lib/pdfGuia.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLAVE_TTL_SEGUNDOS = 60 * 60 * 24 * 60; // 60 días

function limpiarJson(texto) {
  const match = texto.match(/\[[\s\S]*\]/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
}

export default async function handler(req, res) {
  if (!(await rateLimit(req, res, { limit: 6, windowSeconds: 3600, blockSeconds: 600 }))) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const tema = String(body.tema || '').trim().slice(0, 120);
  if (!tema) {
    return res.status(400).json({ error: 'Cuéntame sobre qué tema quieres la guía.' });
  }
  const cantidad = Math.min(10, Math.max(4, parseInt(body.cantidad, 10) || 8));

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  if (!GROQ_API_KEY || !KV_URL || !KV_TOKEN) {
    console.error('Falta GROQ_API_KEY o configuración de KV.');
    return res.status(500).json({ error: 'El servidor no está configurado todavía. Intenta más tarde.' });
  }

  const prompt = `Genera ${cantidad} preguntas de alternativas ORIGINALES de matemática, estilo prueba PAES M1 chilena, sobre el tema: "${tema}".

Reglas:
- Cada pregunta debe poder resolverse SOLO con el texto (sin figuras, gráficos ni tablas).
- Exactamente 4 alternativas por pregunta (A, B, C, D), solo una correcta.
- Verifica tú mismo el cálculo antes de fijar la alternativa correcta — no te equivoques en el valor.
- Nivel escolar chileno (3°-4° medio), en español, contexto cotidiano cuando aplique.

Responde SOLO con un JSON array, sin texto extra, con esta forma exacta:
[{"enun":"texto de la pregunta","alt":["opción A","opción B","opción C","opción D"],"correcta":"A"}]`;

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.6,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if (!resp.ok) {
      console.error('Groq error:', resp.status, await resp.text());
      return res.status(502).json({ error: 'No pude generar la guía en este momento. Intenta de nuevo.' });
    }
    const data = await resp.json();
    const crudo = data.choices?.[0]?.message?.content || '';
    const items = limpiarJson(crudo);
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(502).json({ error: 'No logré armar la guía. Intenta reformular el tema.' });
    }

    const validos = items.filter(
      (it) => it && typeof it.enun === 'string' && Array.isArray(it.alt) && it.alt.length === 4 && ['A', 'B', 'C', 'D'].includes(it.correcta)
    );
    if (validos.length === 0) {
      return res.status(502).json({ error: 'No logré armar la guía. Intenta reformular el tema.' });
    }

    const folio = `AY-C-${Date.now().toString(36).toUpperCase()}`;
    const preguntas = validos.map((it, i) => ({ n: i + 1, enun: it.enun, alt: it.alt }));
    const claves = {};
    validos.forEach((it, i) => { claves[i + 1] = it.correcta; });

    const kvHeaders = { Authorization: `Bearer ${KV_TOKEN}` };
    const valorKV = encodeURIComponent(JSON.stringify({ tema, total: preguntas.length, claves }));
    await fetch(`${KV_URL}/setex/guia%3Acustom%3A${folio}/${CLAVE_TTL_SEGUNDOS}/${valorKV}`, { headers: kvHeaders });

    const logoBytes = await readFile(path.join(__dirname, '..', 'scripts', 'branding', 'logo_icono_transp.png'));
    const pdfBytes = await generarGuiaPDF(
      {
        folio,
        titulo: `Guía personalizada · ${tema}`,
        preguntas,
        footer: 'AvispateYa.cl — Profe Emi · Guía personalizada, contenido 100% generado con IA a pedido del alumno',
      },
      logoBytes
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${folio}.pdf"`);
    return res.status(200).send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('Error en /api/guia-personalizada:', err);
    return res.status(500).json({ error: 'No se pudo generar la guía.' });
  }
}
