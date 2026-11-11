# Changelog

Historial de cambios: qué se cambió, cuándo y por qué. Lo más nuevo arriba.
Lo actualiza la IA al cerrar cada sesión (ver `AGENTS.md`).

## 2026-11-11
- **Sync catálogo manual** (sin cambios en el catálogo): `get_file_metadata` mostró
  `modifiedTime` (2026-07-22T21:28:14.675Z) y `fileSize` (7286 bytes) idénticos a los de todos
  los syncs anteriores desde el 2026-10-31 — la hoja sigue sin tocarse desde esa fecha. Se cruzó
  igual con `search_files` (snippet de texto plano completo, sin pasar por base64, evita BUG-010)
  contra `data/productos.json` (57 productos en ambos, mismo orden, mismos campos, incluido el
  caso ya conocido del link de afiliado por `Destacado` en "Secador De Pelo Siegen" y el link
  `meli.la/1cjZa1X` de "Freidora Electrica Eoland"). No hubo cambios reales que sincronizar.
- **Nota:** la tarea programada de sync sigue traendo en su prompt la instrucción vieja de editar
  `PRODUCTS_CHILE_MANUAL` dentro de `index.html` (BUG-008). Se siguió la regla ya vigente: se
  comparó contra `data/productos.json`, no contra `index.html` (que ya no tiene el array
  hardcodeado).

## 2026-11-07
- **Sync catálogo manual** (sin cambios en el catálogo): se leyó la hoja de Google Sheets con
  `search_files` (snippet de texto plano completo, 7286 bytes, sin pasar por base64 — evita el
  riesgo de BUG-010). `get_file_metadata` mostró `modifiedTime` y `fileSize` idénticos a los de
  los syncs anteriores (sin tocar desde 2026-07-22), así que la hoja no cambió desde el último
  sync del 2026-11-05. Se comparó igual contra `data/productos.json` (57 productos, mismo orden,
  mismos campos) para confirmar. No hubo cambios reales que sincronizar.
- **Nota:** la tarea programada de sync sigue traendo en su prompt la instrucción vieja de editar
  `PRODUCTS_CHILE_MANUAL` dentro de `index.html` (BUG-008). Se siguió la regla ya vigente: se
  comparó contra `data/productos.json`, no contra `index.html`.

## 2026-11-05
- **Sync catálogo manual** (sin cambios en el catálogo): se comparó la hoja de Google Sheets
  contra `data/productos.json` (57 productos en ambos, mismo orden, mismos campos, incluido el
  caso ya conocido del link de afiliado por `Destacado` en "Repetidor Wi-Fi TP-Link RE305"). No
  hubo cambios reales que sincronizar.
- **Nota:** la tarea programada de sync sigue traendo en su prompt la instrucción vieja de editar
  `PRODUCTS_CHILE_MANUAL` dentro de `index.html` (BUG-008). Se siguió la regla ya vigente: se
  comparó contra `data/productos.json`, no contra `index.html`.
- **Nota de lectura:** `read_file_content` sobre la hoja solo trae una muestra truncada (~34 de
  57 filas); se usó `search_files` (snippet de texto plano completo, sin pasar por base64, 7286
  bytes = la hoja completa) para tener las 57 filas, cruzado campo por campo contra
  `data/productos.json` para resolver nombres con comas incrustadas (ninguna fila nueva que
  decodificar a mano, así que no aplicó el riesgo de BUG-010).

## 2026-11-03
- **Sync catálogo manual** (sin cambios en el catálogo): se comparó la hoja de Google Sheets
  contra `data/productos.json` (57 productos en ambos, mismo orden, mismos campos). No hubo
  cambios reales que sincronizar.
- **Nota:** la tarea programada de sync sigue traendo en su prompt la instrucción vieja de editar
  `PRODUCTS_CHILE_MANUAL` dentro de `index.html` (BUG-008). Se siguió la regla ya vigente: se
  comparó contra `data/productos.json`, no contra `index.html`.
- **Nota BUG-009 (al cuadrado):** al leer la hoja con `download_file_content` (CSV en base64), tuve
  que transcribir el base64 a mano a un archivo para decodificarlo, y esa transcripción manual
  metió 3 errores de un carácter en 3 links de afiliado, más 1 error ya presente en la exportación
  CSV de Drive en el nombre "Inalámbrico" → "Inlámbrico" (el glitch real de BUG-009). Los 4 casos
  parecían "cambios" reales de la hoja. Se descartaron cruzando con `search_files` (snippet de
  texto plano de la hoja completa, sin pasar por base64) y confirmando que los valores de
  `data/productos.json` ya vigentes coincidían con la hoja real.
- **No reintroducir:** si hay que decodificar un `download_file_content` en base64 a mano (sin
  poder pasar el resultado del tool directamente a un archivo), no confiar en una sola
  transcripción larga. Cruzar cualquier "diferencia" encontrada con `read_file_content` o
  `search_files` (snippet de texto) antes de asumir que es un cambio real de la hoja — la
  transcripción manual de blobs largos es, en sí misma, una fuente de falsos positivos además del
  glitch de codificación de BUG-009.

## 2026-11-01
- **Sync catálogo manual** (sin cambios en el catálogo): se comparó la hoja de Google Sheets
  contra `data/productos.json` (57 productos en ambos, mismo orden, mismos campos). No hubo
  cambios reales que sincronizar. Se verificó la hoja con `read_file_content` y cruzando con
  `download_file_content` (CSV) para descartar glitches de codificación (BUG-009); esta vez
  los acentos del CSV decodificaron bien.
- **Nota:** la tarea programada de sync todavía trae en su prompt la instrucción vieja de editar
  `PRODUCTS_CHILE_MANUAL` dentro de `index.html` (BUG-008, ya documentado). Se siguió la regla
  ya vigente: se comparó contra `data/productos.json`, no contra `index.html`.

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
