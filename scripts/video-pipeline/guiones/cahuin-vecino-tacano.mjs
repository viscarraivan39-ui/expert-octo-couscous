export const id = "cahuin-vecino-tacano";

// Formato nuevo: cahuín/chisme narrado, no la estructura noticiosa de
// gancho/contexto/problema/giro. Personajes inventados y anónimos (vecinos
// sin nombre real) -> todo genérico. Estilo cómic/dibujo gracioso en vez de
// fotorrealista: además de calzar mejor con el tono de chisme, esquiva el
// filtro de contenido de FLUX (que es estricto con rostros fotorrealistas,
// no con ilustración estilizada) — así que acá SÍ se pueden mostrar caras y
// expresiones exageradas, a diferencia del resto del pipeline.
const ESTILO = "colorful comic book illustration style, bold outlines, flat vibrant colors, funny exaggerated cartoon expressions, vertical composition";

export const bloques = [
  {
    id: "gancho",
    texto: "Pues mire, yo pensé que había visto todo en este pasaje, hasta que me tocó enterarme del cahuín del Rodrigo, el del 15. Y esto se lo cuento tal como me lo contaron a mí, con pelos y señales.",
    tomas: [
      { imagenPrompt: `Wide shot of a cheerful Chilean neighborhood street with colorful small houses, ${ESTILO}` },
      { imagenPrompt: `A woman with a mischievous grin peeking through a window curtain, big expressive eyes, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "contexto",
    texto: "Resulta que el Rodrigo, que todo el pasaje sabe que es tacaño — tacaño de los que apagan la luz aunque uno esté todavía en el baño — apareció la semana pasada con una tele nueva, gigante, de esas que ni entran bien por la puerta.",
    tomas: [
      { imagenPrompt: `A grumpy stingy-looking cartoon man with a big frown clutching his wallet tightly, ${ESTILO}` },
      { imagenPrompt: `A delivery man struggling to carry a giant TV box through a narrow doorway, comedic exaggerated pose, ${ESTILO}` },
      { imagenPrompt: `A huge flat screen TV barely fitting in a small living room, comedic scale, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "problema",
    texto: "Y ojo que el Rodrigo es de los que se queja hasta por el vuelto de las sopaipillas, así que la vecina que me cuenta esto quedó con la boca abierta. Y no se aguantó y le preguntó directo: ¿y esa tele, Rodrigo, se ganó el Kino o qué?",
    tomas: [
      { imagenPrompt: `Two cartoon neighbors talking over a garden fence, one with a shocked jaw-dropped expression, ${ESTILO}` },
      { imagenPrompt: `A cartoon man with a sly wink and a mysterious smile, arms crossed proudly, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "giro",
    texto: "Y el Rodrigo, con esa sonrisa de que se guardó un secreto, le dice: no poh, si la encontré con 45% de descuento revisando AvíspateYa, ni yo lo podía creer. Y resulta que ahora anda mostrándole a todo el que se deje el link, como si hubiera descubierto el agua tibia. Y lo peor es que no se equivoca — la vecina entró a mirar por curiosidad y ya lleva dos compras.",
    tomas: [
      { imagenPrompt: `A cartoon hand holding a smartphone with a giant glowing discount badge on screen, excited sparkle effects, ${ESTILO}` },
      { imagenPrompt: `A cartoon man excitedly showing his phone screen to a curious neighbor, both smiling big, ${ESTILO}` },
      { imagenPrompt: `A cheerful cartoon woman happily carrying shopping bags with a big smile, ${ESTILO}` },
    ],
    keyword: "-45% OFF",
  },
  {
    id: "cta",
    texto: "Así que ojo: si el vecino más tacaño del pasaje está gastando plata feliz, algo raro está pasando. Y ese algo raro se llama AvíspateYa — ofertas reales, todos los días. Entra a avispateya punto cl y mira vos mismo.",
    imagenPrompt: `A cartoon hand holding a smartphone showing a cheerful shopping website, sparkles and stars around it, ${ESTILO}`,
    keyword: null,
  },
];
