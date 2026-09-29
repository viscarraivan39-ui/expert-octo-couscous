# Bugs y lecciones

Libreta de errores: síntoma, causa, arreglo y **qué no reintroducir**.
Agregar nuevos arriba, con el número siguiente. No borrar entradas viejas.

---

### BUG-007 — Código fuente descargable desde el sitio (2026-09-29)
- **Síntoma:** `/lib/*.js` y `/scripts/*` respondían 200: cualquiera podía leer prompts, lógica de crons y una copia vieja de las claves de las guías de Profe Emi (`scripts/guias/claves-m1.mjs`).
- **Causa:** Vercel sirve como archivo estático todo lo que está en la raíz del repo.
- **Arreglo:** `redirects` en `vercel.json` para `/lib/`, `/scripts/` y `/sql/` (se aplican antes que los estáticos; las funciones siguen importando esos archivos).
- **No reintroducir:** una carpeta nueva con código de servidor se agrega a esos `redirects`. No usar `.vercelignore` para carpetas que importan las funciones.

### BUG-006 — Producto Destacado sin generar: modelo retirado (2026-09-29, `f67f5c6`)
- **Síntoma:** las reseñas diarias dejaron de generarse.
- **Causa:** Groq y NVIDIA retiraron `llama-3.3-70b`, fijo en el código.
- **Arreglo:** `lib/llmChat.js` con lista de modelos de respaldo (igual que Geeknoticias).
- **No reintroducir:** nunca un modelo único en duro.

### BUG-005 — Profe Emi viejo con inyección de prompt (2026-08-05, `b918906`)
- **Síntoma:** `profe-emi.html` armaba el system prompt en el navegador (incluida la respuesta
  correcta, visible en Network) y no validaba roles antes de mandar a Groq.
- **Arreglo:** se apagó con redirects 301 a profeemi.cl (ya corregido allá).
- **No reintroducir:** el prompt de sistema se arma siempre en el servidor. No revivir estas rutas.

### BUG-004 — AdSense: "contenido de bajo valor" (2026-07-30, `9078776`)
- **Síntoma:** AdSense rechazó el sitio.
- **Causa:** solo tarjetas de productos, sin texto original; además, ticker de actividad falso y testimonios inventados.
- **Arreglo:** sección de metodología, guías de compra reales, reseñas diarias (`/resenas`); se quitó lo falso.
- **No reintroducir:** nada de actividad ni testimonios inventados.

### BUG-003 — Página pegada en "Cargando ofertas…" (2026-07-22, `dfddcb9`)
- **Síntoma:** no se mostraba ninguna oferta.
- **Causa:** comillas escapadas con `\` dentro de un `onclick` → SyntaxError que abortaba todo el script.
- **Arreglo:** corregida la sintaxis; se verificó con Chrome headless.
- **No reintroducir:** después de tocar JS inline, abrir la página y revisar la consola.

### BUG-002 — Mercado Libre responde 403 (2026-07-20 → 2026-09-29)
- **Síntoma:** el cron de ofertas guardaba listas vacías; luego fallaba siempre.
- **Causa:** la API pública de ML pasó a exigir OAuth y después siguió respondiendo 403.
- **Arreglo final:** se desconectó el automático (`0ffd029`); catálogo manual desde Google Sheets.
- **No reintroducir:** no reconectar ML automático sin que Iván lo pida.

### BUG-001 — Todos los deploys fallaban (2026-09-29, `0ffd029`)
- **Síntoma:** cada deploy en Vercel terminaba en error.
- **Causa:** `vercel.json` → `functions` nombraba `api/profe-emi-voz.js`, que ya no existía.
- **Arreglo:** se quitó la entrada.
- **No reintroducir:** al borrar un archivo de `api/`, revisar `vercel.json`.
