# Changelog

Historial de cambios: qué se cambió, cuándo y por qué. Lo más nuevo arriba.
Lo actualiza la IA al cerrar cada sesión (ver `AGENTS.md`).

## 2026-10-31
- **Sync catálogo manual** (sin commit): se comparó la hoja de Google Sheets contra
  `data/productos.json` (57 productos en ambos, mismo orden, mismos campos). No hubo cambios
  reales que sincronizar, así que no se tocó el archivo ni se hizo commit (BUG-009: dos nombres
  parecían distintos por un glitch de codificación en la exportación CSV de la hoja, no por un
  cambio real — se descartó cruzando con otra lectura de la misma hoja).

## 2026-10-29
- **Sync catálogo manual** (`a0014e9`): se comparó la hoja de Google Sheets contra
  `data/productos.json` (57 productos en ambos, mismo orden y mismos campos).
  Único cambio real: el link de afiliado de "Freidora Electrica Eoland" en la
  hoja es `meli.la/1cjZa1X`, no `meli.la/1ciZa1X` como había quedado del sync
  del 27-10. Se corrigió para que vuelva a coincidir con la hoja (si esto se
  repite, puede que el campo de la hoja esté oscilando entre dos valores por
  error de tipeo de Iván — vale la pena que lo revise).

## 2026-10-27
- **Sync catálogo manual** (`5ab1ea7`): se comparó la hoja de Google Sheets contra
  `data/productos.json` (57 productos en ambos, mismo orden). Único cambio real: el
  link de afiliado de "Freidora Electrica Eoland" estaba mal tipeado en el sync
  anterior (`meli.la/1cjZa1X` en vez de `meli.la/1ciZa1X` de la hoja). Se corrigió.
  Se preservó el campo `masVendido` del Notebook Hp (no viene de la hoja).

## 2026-09-29
- **Código de servidor oculto**: `/lib/`, `/scripts/` y `/sql/` ya no se sirven al público (BUG-007).
- **IA con respaldo** en Producto Destacado (`f67f5c6`). Por qué: modelo retirado (BUG-006).
- **Mercado Libre automático desconectado** + build arreglado (`0ffd029`). Por qué: ML respondía
  403 desde julio y el deploy fallaba por una función inexistente (BUG-001, BUG-002).
- **Catálogo manual sincronizado** con Google Sheets: +15 productos de hogar (`6fe8630`).
- **Docs:** se agregan `AGENTS.md`, `CLAUDE.md`, `docs/BUGS.md` y este changelog.

## 2026-08-05
- **Auditoría de seguridad** (`b918906`): se apaga el Profe Emi viejo (BUG-005), rate limit con
  timeout y log visible, timeouts en llamadas a IA y ML.

## 2026-08-01 → 08-03
- Profe Emi (luego movido a profeemi.cl): landing, banco de ejercicios, guías PDF, lector OMR,
  guías personalizadas, pizarra con demostraciones.
- Pipeline de contenido (tendencias → brief → guionistas → validación), Avispanovela cap. 1-6,
  cahuines, voces Google Chirp 3 HD, efectos de sonido, diálogo multivoz.
- Página `/resenas`, Open Graph, redes sociales, Vercel Web Analytics, logo y favicon.

## 2026-07-30 → 07-31
- Contenido editorial y fin de la urgencia falsa (BUG-004). "Producto Destacado" con catálogo en
  `data/productos.json`. Pipeline de video (anuncios + cahuín). Node 24.x.

## 2026-07-16 → 07-22
- Lanzamiento: suscripción por correo, cron de ofertas de ML (OAuth), 42 productos reales de
  afiliado, SEO técnico, AdSense, rate limit y cabeceras de seguridad, widget de ayuda sin IA.
