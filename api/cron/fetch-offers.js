// /api/cron/fetch-offers.js
//
// Este endpoint lo llama Vercel Cron automáticamente (ver vercel.json) una
// vez al día. Busca ofertas reales en la API pública de Mercado Libre Chile
// (no requiere login ni afiliación — es la búsqueda pública normal) y las
// guarda en Vercel KV para que la página las muestre.
//
// Estas ofertas NO tienen link de afiliado todavía (son "source: auto" sin
// comisión) — el objetivo es tener contenido fresco y real que genere
// tráfico mientras se gestiona la afiliación real con cada tienda.
//
// IMPORTANTE: Vercel Cron en el plan gratuito (Hobby) permite cron jobs con
// una frecuencia mínima de 1 vez al día, y llama a esta URL automáticamente
// según el "schedule" configurado en vercel.json. No necesitas hacer nada
// manual una vez desplegado.

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

async function fetchOffersForTerm(term, cat) {
  const url = `https://api.mercadolibre.com/sites/${ML_SITE}/search?q=${encodeURIComponent(term)}&limit=15`;
  const resp = await fetch(url);
  if (!resp.ok) return [];
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
    let allOffers = [];
    for (const { term, cat } of SEARCH_TERMS) {
      const offers = await fetchOffersForTerm(term, cat);
      allOffers = allOffers.concat(offers);
    }

    // Guardamos la lista completa como un solo JSON en KV
    await fetch(`${KV_URL}/set/offers%3Achile%3Aauto`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KV_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(allOffers)),
    });

    return res.status(200).json({ ok: true, count: allOffers.length, updatedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Error buscando ofertas automáticas:', err);
    return res.status(500).json({ error: 'No se pudieron buscar ofertas.' });
  }
}
