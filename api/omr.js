// /api/omr.js
// Lector de la hoja de respuestas de las guías Profe Emi: recibe una foto,
// usa el modelo de visión de Groq para detectar el código de guía y qué
// alternativa (A/B/C/D) quedó marcada por pregunta, y corrige contra la
// clave oficial (server-side, nunca expuesta al navegador).
import { rateLimit } from '../lib/rateLimit.js';
import { CLAVES_M1, FOLIO_RANGOS } from '../scripts/guias/claves-m1.mjs';

const MAX_BASE64_LEN = 4 * 1024 * 1024; // Vercel limita el body de la función a ~4.5MB

export default async function handler(req, res) {
  if (!(await rateLimit(req, res, { limit: 10, windowSeconds: 60, blockSeconds: 300 }))) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const imagenBase64 = String(body.imagen || '');
  if (!imagenBase64.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Falta la imagen (formato data:image/...).' });
  }
  if (imagenBase64.length > MAX_BASE64_LEN) {
    return res.status(400).json({ error: 'La imagen es demasiado grande.' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    console.error('Falta GROQ_API_KEY.');
    return res.status(500).json({ error: 'El servidor no está configurado todavía. Intenta más tarde.' });
  }

  const prompt = `Esta imagen es una hoja de respuestas de una guía de matemática. Tiene un recuadro con marcas en las 4 esquinas. Dentro, arriba, dice "Código de guía: AY-M1-XX". Debajo hay preguntas numeradas en dos columnas, cada una con 4 círculos rotulados A, B, C, D — el alumno rellena (colorea) el círculo de su respuesta.

Devuelve SOLO un JSON válido, sin texto extra, con esta forma exacta:
{"folio":"AY-M1-01","respuestas":{"1":"B","2":null,"3":"A"}}

Reglas:
- "folio" es el código de guía que aparece en el recuadro (formato AY-M1-XX). Si no se lee con claridad, usa null.
- "respuestas" debe tener una entrada por CADA número de pregunta visible en la hoja.
- El valor es la letra (A, B, C o D) del círculo que está claramente relleno/marcado.
- Si una pregunta no tiene ningún círculo marcado, o tiene más de uno marcado, o no se alcanza a leer, el valor debe ser null.
- No inventes respuestas: ante la duda, usa null.`;

  try {
    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'qwen/qwen3.6-27b',
        temperature: 0,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imagenBase64 } },
            ],
          },
        ],
      }),
    });

    if (!resp.ok) {
      const detalle = await resp.text();
      console.error('Groq vision error:', resp.status, detalle);
      return res.status(502).json({ error: 'No pude leer la hoja en este momento. Intenta de nuevo.' });
    }

    const data = await resp.json();
    const crudo = data.choices?.[0]?.message?.content || '';
    const match = crudo.match(/\{[\s\S]*\}/);
    if (!match) {
      return res.status(502).json({ error: 'No logré interpretar la hoja. Prueba con una foto más nítida y derecha.' });
    }

    let lectura;
    try {
      lectura = JSON.parse(match[0]);
    } catch {
      return res.status(502).json({ error: 'No logré interpretar la hoja. Prueba con una foto más nítida y derecha.' });
    }

    const folio = lectura.folio;
    const rango = folio ? FOLIO_RANGOS[folio] : null;
    if (!rango) {
      return res.status(200).json({ folio: folio || null, reconocido: false, mensaje: 'No pude identificar el código de la guía en la foto. Asegúrate de encuadrar el recuadro completo.' });
    }

    const [desde, hasta] = rango;
    const detalle = [];
    let aciertos = 0;
    let respondidas = 0;
    for (let n = desde; n <= hasta; n++) {
      const marcada = lectura.respuestas?.[String(n)] ?? null;
      const correcta = CLAVES_M1[n];
      const ok = marcada && marcada === correcta;
      if (marcada) respondidas++;
      if (ok) aciertos++;
      detalle.push({ n, marcada, ok });
    }

    return res.status(200).json({
      folio,
      reconocido: true,
      total: hasta - desde + 1,
      respondidas,
      aciertos,
      detalle,
    });
  } catch (err) {
    console.error('Error en /api/omr:', err);
    return res.status(500).json({ error: 'No se pudo procesar la imagen.' });
  }
}
