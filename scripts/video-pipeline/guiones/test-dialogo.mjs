export const id = "test-dialogo";
export const sinMarca = true; // prueba técnica, no contenido real para publicar

// Prueba del nuevo soporte de diálogo multi-personaje: bloque.dialogo en vez
// de bloque.texto, cada línea con su propia voz.
const ESTILO = "colorful comic book illustration style, bold outlines, flat vibrant colors, funny exaggerated cartoon expressions, vertical composition";

export const bloques = [
  {
    id: "dialogo1",
    dialogo: [
      { texto: "Oye, ¿viste la oferta que dejaron en el grupo del pasaje?", voz: "es-CL-CatalinaNeural" },
      { texto: "¿Cuál oferta? Yo no vi nada.", voz: "es-CL-LorenzoNeural" },
      { texto: "La del notebook, pues. Cuarenta y cinco por ciento de descuento.", voz: "es-CL-CatalinaNeural" },
      { texto: "¿En serio? A ver, mándame el link altiro.", voz: "es-CL-LorenzoNeural" },
    ],
    tomas: [
      { imagenPrompt: `Two cartoon neighbors chatting over a fence, one showing excitement, ${ESTILO}` },
      { imagenPrompt: `A cartoon man with a confused expression scratching his head, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman excitedly pointing at a phone screen with a discount badge, ${ESTILO}` },
      { imagenPrompt: `A cartoon man eagerly reaching for a phone, excited expression, ${ESTILO}` },
    ],
    keyword: null,
  },
];
