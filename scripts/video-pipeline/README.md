# Pipeline de video AvíspateYa

Mismo motor que `geeknoticias/scripts/video-pipeline` (ver ese README para
la mecánica técnica completa), adaptado a esta marca:

- Voz: `es-CL-CatalinaNeural` (distinta de Lorenzo, la de GeekNoticias), con
  `rate: +8%, pitch: +3Hz` para más energía.
- Marca: logo + `avispateya.cl` en vez de geeknoticias.com.

## Dos estilos de contenido, dos estilos visuales

- **Ofertas/producto** (ej. `notebook-hp.mjs`): fotorrealista, igual que
  GeekNoticias — precio real, comparativa, urgencia real (fluctuación de
  precios, nunca inventada).
- **Cahuín/chisme** (ej. `cahuin-vecino-tacano.mjs`): **estilo cómic/dibujo
  gracioso**, no fotorrealista. Personajes inventados y anónimos, la marca
  se menciona orgánicamente dentro del relato (no como corte publicitario).
  Descubrimiento importante: el estilo cómic **esquiva el filtro de
  contenido de FLUX** (que es estricto con rostros fotorrealistas, no con
  ilustración estilizada) — así que en este formato SÍ se pueden mostrar
  caras y expresiones exageradas de los personajes, algo que en el resto
  del pipeline (GeekNoticias, ofertas) no se puede hacer directamente.

## Uso

```
npm install
NVIDIA_API_KEY=nvapi-... node build.mjs guiones/<archivo>.mjs
```

Resultado en `assets/<id-del-guion>/final.mp4`.

Ver el skill `producir-video-geeknoticias` (compartido entre ambos repos
conceptualmente) para la metodología base; este README documenta solo lo
que es específico de AvíspateYa.
