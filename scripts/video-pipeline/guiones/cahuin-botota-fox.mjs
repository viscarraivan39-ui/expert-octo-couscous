export const id = "cahuin-botota-fox";

// Cahuín basado en un hecho REAL y público (comediante chilena, show viral
// en Punta Arenas, ella misma salió a disculparse) — no inventado, a
// diferencia del guion del "vecino tacaño". Estilo cómic/caricatura
// genérica (no se le pide a FLUX el rostro real de la persona específica,
// solo "una comediante en un escenario" genérico) para mantener el mismo
// tono liviano del resto de esta serie, sin depender de que el modelo
// acierte un parecido real.
const ESTILO = "colorful comic book illustration style, bold outlines, flat vibrant colors, funny exaggerated cartoon expressions, vertical composition";

export const bloques = [
  {
    id: "gancho",
    texto: "Esto no me lo contó ninguna vecina — esto lo vio Chile entero en vivo, en pleno escenario, sin filtro.",
    tomas: [
      { imagenPrompt: `A cartoon female comedian on a stage with a spotlight, holding a microphone, exaggerated wobbly pose, ${ESTILO}` },
      { imagenPrompt: `A cartoon crowd in a theater looking confused and whispering to each other, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "contexto",
    texto: "Resulta que la comadre se presentó lanzando su nuevo show en un casino del sur, y ahí no más empezó el escándalo, porque los videos que subió la gente la mostraban perdiendo el hilo de la historia, como si se le hubiera olvidado de qué estaba hablando a mitad de camino.",
    tomas: [
      { imagenPrompt: `A cartoon comedian on stage with a dizzy confused expression, spiral eyes, comedic effect, ${ESTILO}` },
      { imagenPrompt: `Multiple cartoon smartphones held up filming a stage, glowing screens, ${ESTILO}` },
    ],
    keyword: "PUNTA ARENAS",
  },
  {
    id: "problema",
    texto: "El público, que había pagado entrada, no se quedó callado — empezaron a pedir la devolución de la plata. Y la cosa se puso peor cuando el video se hizo viral y todo Chile empezó a comentar, mientras yo, para que sepan, me enteraba de todo esto scrolleando el celular mientras revisaba ofertas en AvíspateYa, como quien no quiere la cosa.",
    tomas: [
      { imagenPrompt: `A cartoon angry crowd with raised fists demanding refund, comedic exaggerated anger, ${ESTILO}` },
      { imagenPrompt: `A cartoon phone screen showing a viral video with thousands of comment bubbles flying out, ${ESTILO}` },
      { imagenPrompt: `A cartoon person lying on a couch scrolling a phone with a shopping app open, sneaky grin, ${ESTILO}` },
    ],
    keyword: "SE HIZO VIRAL",
  },
  {
    id: "giro",
    texto: "Pero acá viene lo bueno: la comediante no se escondió. Salió ella misma a dar la cara y dijo, textual, me pasé siete mil pueblos, tengo tanta vergüenza. Reconoció que había tomado antes del show, que no había comido nada, y confesó que su ánimo había estado raro últimamente.",
    tomas: [
      { imagenPrompt: `A cartoon woman recording a heartfelt apology video on her phone, sincere teary expression, ${ESTILO}` },
      { imagenPrompt: `A cartoon speech bubble with an exaggerated embarrassed face inside, sweat drops, comedic style, ${ESTILO}` },
    ],
    keyword: "\"ME PASÉ 7 MIL PUEBLOS\"",
  },
  {
    id: "cta",
    texto: "Así que ojo: entre el escándalo y las ofertas que encontré esa misma tarde en AvíspateYa, la noche me salió redonda igual — el chisme gratis, y el descuento, pagando la mitad. Entra a AvíspateYa ahora.",
    imagenPrompt: `A cartoon hand holding a smartphone showing a cheerful shopping website with a big discount badge, sparkles, ${ESTILO}`,
    keyword: null,
  },
];
