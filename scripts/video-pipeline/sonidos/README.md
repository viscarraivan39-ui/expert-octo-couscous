# Efectos de sonido (risas, ambientes)

Archivos `.wav` cortos de Mixkit (gratis, sin atribución requerida, uso
comercial permitido) para insertar en momentos puntuales de los cahuines.

## Ya disponibles

**Risas / aplausos** (para remates/punchlines):
- `risa_publico.wav` — risa de público, la más genérica y usada
- `risa_mujer.wav`, `risa_nino.wav`, `risa_nino2.wav`, `risa_nasal.wav`
- `risa_cartoon.wav`, `risa_criatura.wav`, `risa_personaje.wav` — más
  exageradas, para el estilo cómic
- `aplausos_risas.wav`, `aplausos_risas_chico.wav` — con aplausos incluidos

**Ambiente** (para escenas específicas, no solo remates):
- `perros_ladrando.wav`, `gato_maullido.wav`, `gallo.wav`
- `pajaros.wav`, `pajaritos.wav`, `lluvia.wav`
- `lobo_aullando.wav`, `lobos_bosque.wav`, `criatura_espeluznante.wav` —
  para momentos de tensión/drama en vez de comedia

## Uso en un guion

```js
{
  id: "cta",
  texto: "...",
  imagenPrompt: "...",
  efecto: { archivo: "risa_publico.wav", enSegundo: 0.2 },
}
```

`enSegundo` es el momento dentro de ESE bloque (no del video completo) en
que arranca el efecto. Si el archivo no existe, el render sigue igual sin
el efecto (no rompe nada).

## Conseguir más

- [Mixkit](https://mixkit.co/free-sound-effects/) — misma fuente de estos.
- [Pixabay](https://pixabay.com/sound-effects/) — misma licencia permisiva
  que ya usamos para música.
