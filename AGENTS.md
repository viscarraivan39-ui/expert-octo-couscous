# AGENTS.md — Contrato para agentes (Claude Code, Codex y otros)

Contrato corto y obligatorio. Se lee al iniciar cada sesión, antes de tocar nada.

> **Idioma:** el dueño (Iván) es chileno. Escribe en **español chileno neutro, con tuteo**,
> sin voseo argentino — en el chat, en los textos del sitio y en los commits.

## Qué es
AvíspateYa (avispateya.cl): sitio de ofertas con links de afiliado de Mercado Libre + reseñas
originales + producción de videos (cahuín, Avispanovela, anuncios). HTML estático + funciones
serverless en Vercel (plan **Hobby**) + Vercel KV. Proyecto Vercel `prj_twJCuA1c1x7vZXvL3ZXYMK93QrDL`
(repo `expert-octo-couscous`). Deploy = push a `main`.

> ⚠️ La copia local `Nueva carpeta/expert-octo-couscous` tiene cambios viejos sin commit y está
> atrasada. Trabajar desde un clon limpio o hacer `git pull` primero; no commitear esos cambios a ciegas.

## Antes de tocar código, lee
1. `docs/BUGS.md` — errores ya resueltos y lo que **no hay que reintroducir**.
2. `CHANGELOG.md` — qué se cambió último.

## Reglas de negocio que no se tocan
- **Mercado Libre automático está DESCONECTADO a propósito** (decisión de Iván, 2026-09-29).
  No volver a crear `fetch-offers` ni `/api/offers`. El catálogo es **manual**:
  `data/productos.json`, sincronizado desde la hoja de Google Sheets
  "AvíspateYa - Productos para subir", con links `meli.la`.
- **Nada de urgencia falsa ni testimonios inventados** ("alguien acaba de comprar…"). AdSense lo
  castiga y es engañoso (BUG-004). Las reseñas usan la **foto real** del producto, no imagen de IA.
- **Profe Emi ya no vive aquí**: vive en profeemi.cl (repo `profe-emi-web`). Las rutas viejas
  redirigen con 301 en `vercel.json`. No reactivarlas ni parchearlas aquí.
- Toda llamada a IA pasa por `lib/llmChat.js` (modelos con respaldo); nunca un modelo único en duro.
- Toda llamada externa lleva timeout propio; endpoints públicos con rate limit (`lib/rateLimit.js`).
- `vercel.json` → `functions` solo puede nombrar archivos que existen (BUG-001).
- `api/cron/fetch-destacado` lo dispara cron-job.org 1×día con `?key=ADMIN_KEY`.
- Variables de entorno solo en Vercel: `GROQ_API_KEY`, `NVIDIA_API_KEY`, `KV_REST_API_URL`,
  `KV_REST_API_TOKEN`, `CRON_SECRET`, `ADMIN_KEY`.
- **Código de servidor solo en `lib/`, `scripts/`, `sql/`**, bloqueadas al público por `redirects` en `vercel.json`; una carpeta nueva de ese tipo se agrega ahí (BUG-007).

## Cómo verificar
- Cambios en `index.html` o scripts del cliente: abrir la página y revisar la consola (un error
  de sintaxis deja todo en "Cargando…", BUG-003).
- Después del push: estado del deploy en Vercel.

## Al cerrar cada sesión (obligatorio)
La IA —no Iván— actualiza:
1. `CHANGELOG.md`: qué cambió, cuándo y **por qué**.
2. `docs/BUGS.md`: síntoma, causa, arreglo y qué no reintroducir.
3. Este archivo, si nació una regla nueva.
