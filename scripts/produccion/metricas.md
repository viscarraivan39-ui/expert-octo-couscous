# Registro de métricas reales — AvíspateYa

Solo datos reales observados (screenshots de analytics), no estimaciones.
El objetivo es que el brief/guion de la próxima sesión tenga en cuenta lo que
ya se probó, en vez de repetir experimentos a ciegas.

| Fecha | Contenido | Plataforma / método de subida | Resultado | Aprendizaje |
|---|---|---|---|---|
| 2026-07-30 | Video con marca AvíspateYa, compartido solo por link directo | TikTok, subido vía TikTok Studio (web) | 15-19 vistas, todas del entorno cercano | Sin actividad del algoritmo — sospecha de "cold start" de cuenta nueva, no necesariamente censura por marca |
| 2026-07-30/31 | Video sin contenido de marca (`test-sin-marca-chiste`) | TikTok, subido vía celular (app nativa) | Salto a ~200 vistas | Fuerte indicio de que la app nativa distribuye distinto que TikTok Studio web — variable de subida, no de marca, parece la causa principal |
| 2026-07-31 | Video con marca (`cahuin-condominio`) | TikTok, subido vía celular | Pendiente acumular datos comparables | Celda "branded + phone" del test 2x2, falta la celda "unbranded + web" para cerrar la comparación |
| — | Cualquier video corto | TikTok | Retención cae fuerte en el segundo 1 (visto en analytics real) | Hipótesis: el `LEAD_IN_GANCHO` de 0.7s de silencio al inicio da tiempo a que el viewer se vaya antes de que pase algo. Fix no implementado aún — pendiente sonic logo real (grito/zumbido con impacto) para retener atención en el primer segundo. |

## Pendiente de cerrar antes de sacar conclusiones firmes

- Celda "unbranded + subida por web" del test 2x2 (branding × método de subida).
- Fix del lead-in de 0.7s + sonic logo real (el primer intento sintetizado por
  ffmpeg sonó "genérico tipo streaming", fue descartado).
