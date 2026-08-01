# Pipeline de video AvíspateYa

Mismo motor que `geeknoticias/scripts/video-pipeline` (ver ese README para
la mecánica técnica completa), adaptado a esta marca:

- Voz: `es-CL-CatalinaNeural` (distinta de Lorenzo, la de GeekNoticias), con
  `rate: +16%, pitch: +4Hz` para más energía (ajustado tras feedback real).
- Marca: logo + `avispateya.cl` en vez de geeknoticias.com. Se dice
  "AvíspateYa" en la narración, nunca "punto cl" hablado (sonaba cortado) —
  el dominio completo queda solo en la marca de agua visual.
- Efectos de sonido puntuales (risas, stingers): opcional por bloque,
  `efecto: { archivo: "risa.mp3", enSegundo: 2 }` — busca el archivo en
  `sonidos/` (carpeta vacía a propósito, ver `sonidos/README.md` para
  fuentes gratis). Si no existe el archivo, se omite sin romper el render.

## Dos estilos de contenido, dos estilos visuales

- **Ofertas/producto** (ej. `notebook-hp.mjs`): fotorrealista, igual que
  GeekNoticias — precio real, comparativa, urgencia real (fluctuación de
  precios, nunca inventada).
- **Cahuín/chisme** (ej. `cahuin-vecino-tacano.mjs`, `cahuin-separacion.mjs`,
  `cahuin-botota-fox.mjs`): **estilo cómic/dibujo gracioso**, no
  fotorrealista. Personajes inventados y anónimos (o reales pero sin pedirle
  a FLUX su rostro específico), la marca se menciona orgánicamente dentro
  del relato (no como corte publicitario) — **2 menciones por video como
  máximo** (ej. una a mitad de historia + CTA final). Se probó una versión
  con la marca repetida en cada tramo ("muletilla") y el feedback real fue
  que se sentía pesado — no repetir ese patrón.
  Descubrimiento importante: el estilo cómic **esquiva el filtro de
  contenido de FLUX** (que es estricto con rostros fotorrealistas, no con
  ilustración estilizada) — así que en este formato SÍ se pueden mostrar
  caras y expresiones exageradas de los personajes, algo que en el resto
  del pipeline (GeekNoticias, ofertas) no se puede hacer directamente.

  **Fuente del chisme/contenido — sin encasillarse en un solo tipo, a
  propósito.** Categorías válidas, todas mezclables:
  - Inventado (vecinos ficticios, situaciones cotidianas)
  - Farándula real (verificar la fuente antes, evitar temas trágicos/
    sensibles — ver criterio en el propio guion de Botota Fox)
  - Adaptado de los libretos ya escritos en `guiones-asistente-social/`
  - Noticias del día (mismo `scripts/tendencias/obtenerTendencias.mjs` que
    usa GeekNoticias para newsjacking)
  - Fechas especiales / efemérides / días conmemorativos
  - Eventos puntuales (estrenos, lanzamientos, competencias)
  - Comentario de teleseries/dramas de TV en curso
  - Reacciones/comentario a comedias o shows del momento

  La variedad de fuente es la estrategia — no fijarse en un solo nicho o
  tipo de historia. El hilo común entre todas: estilo cómic, marca mencionada
  con moderación (máx. 2 veces), y verificar que el tono sea liviano antes
  de convertir algo en contenido (mismo criterio en todas: no explotar
  desgracias reales de nadie).

## Uso

```
npm install
NVIDIA_API_KEY=nvapi-... node build.mjs guiones/<archivo>.mjs
```

Resultado en `assets/<id-del-guion>/final.mp4`.

Ver el skill `producir-video-geeknoticias` (compartido entre ambos repos
conceptualmente) para la metodología base; este README documenta solo lo
que es específico de AvíspateYa.
