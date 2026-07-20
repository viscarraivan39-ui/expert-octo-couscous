// /api/cron/fetch-offers.js
//
// Este endpoint lo llama Vercel Cron automáticamente (ver vercel.json) una
// vez al día. Busca ofertas reales en la API de Mercado Libre Chile y las
// guarda en Vercel KV para que la página las muestre.
//
// IMPORTANTE: desde 2024 la API de búsqueda de Mercado Libre ya NO es
// pública: toda petición sin token devuelve 403 "forbidden". Por eso este
// endpoint necesita una app de desarrollador de Mercado Libre
// (https://developers.mercadolibre.cl) y estas variables de entorno en
// Vercel:
//
//   ML_CLIENT_ID     → App ID de la aplicación
//   ML_CLIENT_SECRET → Secret key de la aplicación
//
// Con ellas se pide un token "client credentials" en cada ejecución (el
// token dura 6 horas, así que no vale la pena cachearlo para un cron que
// corre una vez al día).
//
// Estas ofertas NO tienen link de afiliado todavía (son "source: auto" sin
// comisión) — el objetivo es tener contenido fresco y real que genere
// tráfico mientras se gestiona la afiliación real con cada tienda.

const ML_SITE = 'MLC'; // Chile
const SEARCH_TERMS = [
  { term: 'audifonos bluetooth', cat: 'tech' },
  { term: 'zapatillas running', cat: 'deporte' },
  { term: 'freidora de aire', cat: 'hogar' },
  { term: 'mochila notebook', cat: 'moda' },
  { term: 'smartwatch', cat: 'tech' },
  { term: 'aspiradora robot', cat: 'hogar' },
];

function formatCLP(n) {
  return Math.round(n).toLocaleString('es-CL');
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

async function fetchOffersForTerm(token, term, cat) {
  const url = `https://api.mercadolibre.com/sites/${ML_SITE}/search?q=${encodeURIComponent(term)}&limit=15`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!resp.ok) {
    console.error(`Búsqueda "${term}" falló con HTTP ${resp.status}`);
    return [];
  }
  const data = await resp.json();
  const results = data.results || [];

  // Solo nos interesan productos que YA tienen descuento real (original_price > price)
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
        link: item.permalink,
        featured: false,
        fetchedAt: new Date().toISOString(),
      };
    });
}

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

  try {
    const token = await getMercadoLibreToken();

    let allOffers = [];
    for (const { term, cat } of SEARCH_TERMS) {
      const offers = await fetchOffersForTerm(token, term, cat);
      allOffers = allOffers.concat(offers);
    }

    // Si todas las búsquedas fallaron, mejor avisar que pisar el KV con una
    // lista vacía (dejaría la página sin ofertas hasta el día siguiente).
    if (allOffers.length === 0) {
      console.error('Ninguna búsqueda devolvió ofertas; se conserva lo que haya en KV.');
      return res.status(500).json({ error: 'Ninguna búsqueda devolvió ofertas.' });
    }

    // Guardamos la lista completa como un solo JSON en KV
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

    return res.status(200).json({ ok: true, count: allOffers.length, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Error buscando ofertas automáticas:', err);
    return res.status(500).json({ error: 'No se pudieron buscar ofertas.', detail: String(err.message || err) });
  }
}
