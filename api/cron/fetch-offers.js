// /api/cron/fetch-offers.js
//
// Este endpoint lo llama Vercel Cron automáticamente (ver vercel.json) una
// vez al día. Junta ofertas reales de varias fuentes y las guarda en Vercel
// KV para que la página las muestre.
//
// ─── ARQUITECTURA MULTI-FUENTE ───────────────────────────────────────────
// Cada fuente es una función async que devuelve una lista de ofertas en el
// formato normalizado que usa la página (cat, name, price, old, off, link…).
// Para agregar una tienda nueva (por ejemplo un feed de afiliados de SOICOS
// o Admitad con Falabella/Paris/Ripley), se escribe otra función fuente y
// se agrega al array SOURCES de abajo. Si una fuente falla, las demás
// siguen funcionando.
//
// ─── FUENTE: MERCADO LIBRE ───────────────────────────────────────────────
// Desde 2024 la API de Mercado Libre ya NO es pública (devuelve 403 sin
// token). Se necesita una app en https://developers.mercadolibre.cl y estas
// variables de entorno en Vercel:
//
//   ML_CLIENT_ID     → App ID de la aplicación
//   ML_CLIENT_SECRET → Secret key de la aplicación
//
// LINKS DE AFILIADO: si configuras estas variables opcionales, cada link
// sale con tus parámetros de afiliado de Mercado Libre y las ventas
// generan comisión para tu cuenta:
//
//   ML_MATT_TOOL → valor del parámetro "matt_tool" de tus links de afiliado
//   ML_MATT_WORD → valor del parámetro "matt_word" (opcional, campaña)
//
// Para encontrarlos: en el portal de afiliados genera un link de cualquier
// producto, ábrelo en el navegador, y copia de la URL final los valores de
// matt_tool y matt_word.

const ML_SITE = 'MLC'; // Chile
const SEARCH_TERMS = [
  { term: 'audifonos bluetooth', cat: 'tech' },
  { term: 'smartwatch', cat: 'tech' },
  { term: 'notebook', cat: 'tech' },
  { term: 'smart tv', cat: 'tech' },
  { term: 'zapatillas running', cat: 'deporte' },
  { term: 'bicicleta', cat: 'deporte' },
  { term: 'freidora de aire', cat: 'hogar' },
  { term: 'aspiradora robot', cat: 'hogar' },
  { term: 'refrigerador', cat: 'hogar' },
  { term: 'mochila notebook', cat: 'moda' },
  { term: 'parka hombre', cat: 'moda' },
  { term: 'perfume mujer', cat: 'moda' },
];

function formatCLP(n) {
  return Math.round(n).toLocaleString('es-CL');
}

// Agrega los parámetros de afiliado de Mercado Libre al link del producto.
function withAffiliateParams(permalink) {
  const mattTool = process.env.ML_MATT_TOOL;
  if (!mattTool) return permalink;
  try {
    const url = new URL(permalink);
    url.searchParams.set('matt_tool', mattTool);
    if (process.env.ML_MATT_WORD) {
      url.searchParams.set('matt_word', process.env.ML_MATT_WORD);
    }
    return url.toString();
  } catch {
    return permalink;
  }
}

async function getMercadoLibreToken() {
  const clientId = process.env.ML_CLIENT_ID;
  const clientSecret = process.env.ML_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('Faltan ML_CLIENT_ID / ML_CLIENT_SECRET en las variables de entorno.');
  }

  const resp = await fetch('https://api.mercadolibre.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Mercado Libre rechazó las credenciales (HTTP ${resp.status}): ${body}`);
  }

  const data = await resp.json();
  if (!data.access_token) {
    throw new Error('Mercado Libre no devolvió access_token.');
  }
  return data.access_token;
}

async function fetchMLTerm(token, term, cat) {
  const url = `https://api.mercadolibre.com/sites/${ML_SITE}/search?q=${encodeURIComponent(term)}&limit=15`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    console.error(`ML: búsqueda "${term}" falló con HTTP ${resp.status}`);
    return [];
  }
  const data = await resp.json();
  const results = data.results || [];

  // Solo productos que YA tienen descuento real (original_price > price)
  return results
    .filter(item => item.original_price && item.original_price > item.price)
    .slice(0, 3) // máximo 3 ofertas por término de búsqueda
    .map(item => {
      const off = Math.round(((item.original_price - item.price) / item.original_price) * 100);
      return {
        cat,
        country: 'chile',
        store: 'Mercado Libre',
        source: 'auto',
        img: item.thumbnail ? item.thumbnail.replace('http://', 'https://') : '',
        name: item.title,
        old: `$${formatCLP(item.original_price)}`,
        price: `$${formatCLP(item.price)}`,
        off: `-${off}%`,
        meta: item.condition === 'new' ? 'Nuevo' : 'Usado',
        link: withAffiliateParams(item.permalink),
        featured: false,
        fetchedAt: new Date().toISOString(),
      };
    });
}

async function sourceMercadoLibre() {
  const token = await getMercadoLibreToken();
  let offers = [];
  for (const { term, cat } of SEARCH_TERMS) {
    offers = offers.concat(await fetchMLTerm(token, term, cat));
  }
  return offers;
}

// ─── REGISTRO DE FUENTES ─────────────────────────────────────────────────
// Para sumar Falabella/Paris/Ripley etc. vía feeds de afiliados (SOICOS,
// Admitad, Awin…), agregar aquí otra entrada { name, fn }.
const SOURCES = [
  { name: 'Mercado Libre', fn: sourceMercadoLibre },
];

export default async function handler(req, res) {
  // Protección simple: solo Vercel Cron o alguien con la clave puede ejecutar esto
  const authHeader = req.headers.authorization;
  const isVercelCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const providedKey = req.query.key;
  const isManualTrigger = providedKey && providedKey === process.env.ADMIN_KEY;

  if (!isVercelCron && !isManualTrigger) {
    return res.status(401).json({ error: 'No autorizado.' });
  }

  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;
  if (!KV_URL || !KV_TOKEN) {
    return res.status(500).json({ error: 'No hay base de datos KV conectada.' });
  }

  const allOffers = [];
  const sourceReport = {};

  for (const { name, fn } of SOURCES) {
    try {
      const offers = await fn();
      allOffers.push(...offers);
      sourceReport[name] = { ok: true, count: offers.length };
    } catch (err) {
      console.error(`Fuente "${name}" falló:`, err);
      sourceReport[name] = { ok: false, error: String(err.message || err) };
    }
  }

  // Si TODAS las fuentes fallaron o no trajeron nada, avisar en vez de pisar
  // el KV con una lista vacía (dejaría la página sin ofertas hasta mañana).
  if (allOffers.length === 0) {
    console.error('Ninguna fuente devolvió ofertas; se conserva lo que haya en KV.', sourceReport);
    return res.status(500).json({ error: 'Ninguna fuente devolvió ofertas.', sources: sourceReport });
  }

  try {
    const kvResp = await fetch(`${KV_URL}/set/offers%3Achile%3Aauto`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(allOffers)),
    });
    if (!kvResp.ok) {
      const body = await kvResp.text();
      throw new Error(`KV rechazó la escritura (HTTP ${kvResp.status}): ${body}`);
    }

    return res.status(200).json({
      ok: true,
      count: allOffers.length,
      sources: sourceReport,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error guardando ofertas:', err);
    return res.status(500).json({ error: 'No se pudieron guardar las ofertas.', detail: String(err.message || err) });
  }
}
