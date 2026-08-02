// /api/resenas.js
//
// Archivo público de todas las reseñas "Producto Destacado" generadas por
// /api/cron/fetch-destacado.js — antes solo se mostraba la más reciente en
// la home, oculta detrás de una llamada JS del navegador (Google no siempre
// ve bien ese tipo de contenido). Esta página se renderiza en el servidor
// como HTML real, con TODO el historial (no solo la última), para que
// cuente como contenido original de verdad — necesario para pasar la
// revisión de "contenido de bajo valor" de AdSense, que marcó el sitio
// porque hoy es mayormente listados de producto sin texto editorial propio.

function esc(s) {
  return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function formatearFecha(iso) {
  try {
    return new Date(iso).toLocaleDateString("es-CL", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}

function renderArticulo(d, i) {
  const fecha = formatearFecha(d.publicado_en);
  const precioViejo = d.producto?.old ? `<span style="text-decoration:line-through; opacity:.55; margin-right:8px;">$${esc(d.producto.old)}</span>` : "";
  return `
<article id="resena-${i}" style="border:2px solid var(--ink); border-radius:14px; padding:24px; margin-bottom:32px; background:var(--paper);">
  <div style="display:flex; gap:8px; align-items:center; margin-bottom:10px; flex-wrap:wrap;">
    <span style="font-family:'JetBrains Mono', monospace; font-size:12px; opacity:.6;">${esc(fecha)}</span>
    ${d.producto?.cat ? `<span style="background:var(--paper-2); border:1.5px solid var(--ink); border-radius:999px; padding:2px 10px; font-size:11.5px; font-weight:700;">${esc(d.producto.cat)}</span>` : ""}
  </div>
  <h2 style="font-family:'Archivo Black', sans-serif; font-size:24px; margin:0 0 6px;">${esc(d.titulo)}</h2>
  <p style="opacity:.75; font-size:14.5px; margin:0 0 16px;">${esc(d.resumen)}</p>
  ${d.producto?.img ? `<img src="${esc(d.producto.img)}" alt="${esc(d.producto.name)}" style="width:100%; max-width:420px; border-radius:10px; border:2px solid var(--ink); margin-bottom:16px;" loading="lazy">` : ""}
  <div style="font-size:15px; line-height:1.7;">${d.contenido_html || ""}</div>
  <div style="margin-top:18px; padding-top:16px; border-top:1.5px solid var(--line); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
    <div style="font-family:'Archivo Black', sans-serif; font-size:20px;">${precioViejo}$${esc(d.producto?.price)}</div>
    ${d.producto?.link ? `<a href="${esc(d.producto.link)}" target="_blank" rel="noopener sponsored" style="background:var(--trust); color:#fff; font-weight:700; padding:10px 18px; border-radius:999px; border:2px solid var(--ink); text-decoration:none; font-size:13.5px;">Ver oferta en ${esc(d.producto.store || "la tienda")} →</a>` : ""}
  </div>
</article>`;
}

export default async function handler(req, res) {
  const KV_URL = process.env.KV_REST_API_URL;
  const KV_TOKEN = process.env.KV_REST_API_TOKEN;

  let destacados = [];
  if (KV_URL && KV_TOKEN) {
    try {
      const resp = await fetch(`${KV_URL}/get/destacados%3Achile`, { headers: { Authorization: `Bearer ${KV_TOKEN}` } });
      const data = await resp.json();
      if (data.result) {
        const parsed = JSON.parse(data.result);
        destacados = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
      }
    } catch (err) {
      console.error("Error leyendo destacados para /resenas:", err);
    }
  }

  const articulos = destacados.length
    ? destacados.map(renderArticulo).join("\n")
    : `<p style="opacity:.7;">Todavía no hay reseñas publicadas — vuelve pronto.</p>`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reseñas de productos — AvíspateYa.cl</title>
<meta name="description" content="Reseñas honestas de productos en oferta: qué son, para qué sirven, y si el descuento realmente vale la pena. Escritas por el equipo de AvíspateYa.cl.">
<link rel="canonical" href="https://avispateya.cl/resenas">
<meta property="og:type" content="website">
<meta property="og:site_name" content="AvíspateYa.cl">
<meta property="og:title" content="Reseñas de productos — AvíspateYa.cl">
<meta property="og:description" content="Reseñas honestas de productos en oferta: qué son, para qué sirven, y si el descuento realmente vale la pena.">
<meta property="og:url" content="https://avispateya.cl/resenas">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
<style>
  :root{--ink:#171521; --paper:#FFF6E9; --paper-2:#FFE0B8; --trust:#2B5CFF; --line:rgba(23,21,33,0.14);}
  *{box-sizing:border-box;}
  body{margin:0; background:var(--paper-2); color:var(--ink); font-family:'Space Grotesk', sans-serif;}
  .banner{background:var(--ink); color:#fff; text-align:center; padding:10px 16px; font-family:'Archivo Black', sans-serif; font-size:13.5px; letter-spacing:.02em;}
  .banner span{color:#FFC629;}
  .wrap{max-width:760px; margin:0 auto; padding:32px 20px 80px;}
  a{color:var(--trust);}
  .back{display:inline-block; margin-bottom:20px; font-weight:700; text-decoration:none; color:var(--ink);}
  .brand{display:flex; align-items:center; gap:10px; margin-bottom:18px;}
  .brand img{width:44px; height:44px; border-radius:50%; border:2px solid var(--ink);}
  .brand span{font-family:'Archivo Black', sans-serif; font-size:20px;}
  h1{font-family:'Archivo Black', sans-serif; font-size:36px; margin:0 0 8px;}
  .lead{opacity:.75; margin:0 0 32px; max-width:60ch;}
</style>
</head>
<body>
<div class="banner">🐝 <span>Ofertas que pican</span> todos los días — avispateya.cl</div>
<div class="wrap">
  <a class="back" href="/">← Volver a AvíspateYa.cl</a>
  <div class="brand"><img src="/img/logo.png" alt="AvíspateYa.cl"><span>Avíspate<span style="color:#FFC629;">Ya</span></span></div>
  <h1>Reseñas de productos</h1>
  <p class="lead">Analizamos las ofertas que rastreamos y contamos, sin vueltas, qué tan buenas son de verdad — qué es el producto, para qué sirve, y si el descuento vale la pena.</p>
  ${articulos}
</div>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate");
  return res.status(200).send(html);
}
