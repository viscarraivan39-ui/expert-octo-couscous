// /api/profe-emi-voz.js
// Sintetiza la voz de Profe Emi en el servidor con Edge TTS (misma voz y
// ajustes que ya se validaron en los videos: es-CL-CatalinaNeural,
// rate+16%/pitch+4Hz, "más dinámica" según feedback real) — reemplaza la
// voz nativa del navegador (plana/robótica) sin depender de que el alumno
// pegue su propia clave de ElevenLabs (que además está por agotar su tier
// gratis).
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';
import { rateLimit } from '../lib/rateLimit.js';

const VOICE = 'es-CL-CatalinaNeural';
const VOICE_OPTIONS = { rate: '+16%', pitch: '+4Hz' };
const MAX_CHARS = 600; // una respuesta de Profe Emi es corta (2-4 líneas); evita abuso de cuota

export default async function handler(req, res) {
  if (!(await rateLimit(req, res, { limit: 30, windowSeconds: 60, blockSeconds: 300 }))) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const texto = typeof body.texto === 'string' ? body.texto.trim() : '';
  if (!texto) return res.status(400).json({ error: 'Falta el texto.' });
  if (texto.length > MAX_CHARS) return res.status(400).json({ error: 'Texto demasiado largo.' });

  try {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(VOICE, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    const { audioStream } = await tts.toStream(texto, VOICE_OPTIONS);
    const chunks = [];
    await new Promise((resolve, reject) => {
      audioStream.on('data', (c) => chunks.push(c));
      audioStream.on('end', resolve);
      audioStream.on('error', reject);
    });
    const audio = Buffer.concat(chunks);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(audio);
  } catch (err) {
    console.error('Error sintetizando voz Edge TTS:', err);
    return res.status(502).json({ error: 'No se pudo generar la voz.' });
  }
}
