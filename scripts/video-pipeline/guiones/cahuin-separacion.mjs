export const id = "cahuin-separacion";

// Adaptado de "El cahuín de la separación" (guiones-asistente-social/
// libretos_asistente_social_cahuinera.md, GUION 1) — historia ficticia ya
// escrita y probada en tono, se adapta a formato de video + marca
// AvíspateYa. A diferencia del guion "-largo", la marca se menciona solo
// 2 veces (gancho tangencial + cta), no como muletilla repetida —
// feedback real: la versión con mención en cada tramo se sentía pesada.
const ESTILO = "colorful comic book illustration style, bold outlines, flat vibrant colors, funny exaggerated cartoon expressions, vertical composition";

export const bloques = [
  {
    id: "gancho",
    texto: "El marido se fue de la casa hace tres días. Pero no se fue lejos — se fue literal a la casa de al lado. Y esto se lo cuento tal como me lo contaron, con pelos y señales.",
    tomas: [
      { imagenPrompt: `A cartoon woman peeking dramatically through a window curtain with wide shocked eyes, ${ESTILO}` },
      { imagenPrompt: `Two cartoon houses side by side with a suspicious glowing window in the neighboring one, night scene, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "contexto",
    texto: "El Nelson, según cuentan, se fue a vivir a la casa de la prima de su señora, la Yasna, que vive en la casa de al lado. Y la señora, en vez de estar destruida, andaba con una energía impresionante — porque según ella, todo el pasaje ya sabía, menos la mamá de la Yasna, que todavía cree que el Nelson está durmiendo ahí por una gotera en el techo.",
    tomas: [
      { imagenPrompt: `A cartoon man sneaking with a suitcase from one house to the neighboring house at night, comedic tiptoeing pose, ${ESTILO}` },
      { imagenPrompt: `A cartoon elderly woman looking confused at a ceiling, pointing up with a puzzled expression, no clue what's really happening, ${ESTILO}` },
    ],
    keyword: "TODO EL PASAJE SABÍA",
  },
  {
    id: "problema",
    texto: "Y no queda ahí la cosa. Resulta que la prima, la Yasna, llevaba meses coqueteando con el Nelson en el grupo de WhatsApp del comité de vecinos, donde se supone que compartían puros memes de política. Pero según cuentan, puros corazones.",
    tomas: [
      { imagenPrompt: `A cartoon smartphone screen showing a group chat with heart emojis flying everywhere, comedic exaggeration, ${ESTILO}` },
      { imagenPrompt: `A cartoon person laughing and covering their mouth in shock while looking at a phone screen, ${ESTILO}` },
    ],
    keyword: "PUROS CORAZONES",
  },
  {
    id: "giro",
    texto: "Y mientras todo esto se destapaba, la vecina que me lo contó lo hizo tomando once con dos amigas más, cada una sumando un dato nuevo — porque en el fondo, todas ya sabían algo distinto. En algún momento de esa tarde, alguien mencionó de pasada que había encontrado una oferta buenísima en AvíspateYa, y la conversación siguió como si nada, entre el cahuín y el descuento.",
    tomas: [
      { imagenPrompt: `Three cartoon women sitting around a table having tea, animatedly gossiping with exaggerated expressions, ${ESTILO}` },
      { imagenPrompt: `A cartoon hand holding a smartphone with a shopping app open next to a teacup on a table, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "cta",
    texto: "Así que ojo: entre el cahuín del Nelson y la Yasna, y la oferta que se coló en la conversación, quedó claro que en este pasaje no se pierden ni un chisme ni un descuento. Entra a AvíspateYa y no te pierdas el tuyo tampoco.",
    imagenPrompt: `A cartoon hand holding a smartphone showing a cheerful shopping website with a big discount badge, sparkles, ${ESTILO}`,
    keyword: null,
  },
];
