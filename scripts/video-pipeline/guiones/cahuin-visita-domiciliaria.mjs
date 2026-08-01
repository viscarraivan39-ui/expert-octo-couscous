export const id = "cahuin-visita-domiciliaria";

// "La visita domiciliaria del subsidio" (guiones-asistente-social/
// libretos_asistente_social_chile.md, GUION 1) — texto COMPLETO, sin
// resumir (a pedido explícito: "ese completo"), incluyendo el remate del
// informe leído en tono formal, que es la parte más graciosa del formato
// original. Marca mencionada 2 veces (mid-historia + cta).
const ESTILO = "colorful comic book illustration style, bold outlines, flat vibrant colors, funny exaggerated cartoon expressions, vertical composition";

export const bloques = [
  {
    id: "gancho",
    texto: "Pues sí, las visitas domiciliarias tienen su ciencia. De hecho, las considero el género de suspenso más subestimado que existe. Y eso que yo llevo casi diez años haciendo terreno.",
    tomas: [
      { imagenPrompt: `A cartoon woman with a clipboard confidently walking toward a house, professional outfit, suspenseful dramatic lighting, ${ESTILO}` },
      { imagenPrompt: `A cartoon dog with a mischievous grin watching from a window, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "contexto",
    texto: "A ver, para que entiendan el contexto: esta era una visita de rutina, típica, para verificar la composición del grupo familiar antes de una postulación al subsidio de arriendo. Nada del otro mundo. La señora Nilda vive con su hijo mayor, el Cristian, que en ese tiempo tenía como veintiocho años y todavía no se independizaba, cosa que en Chile es más común que raro, así que tampoco es que fuera un dato relevante para el informe, pero bueno, ahí queda. Yo había coordinado la visita para las once de la mañana. Llegué puntual, como corresponde. Y ahí fue cuando empezó todo.",
    tomas: [
      { imagenPrompt: `A cartoon small Chilean house with a garden, warm morning light, cozy neighborhood, ${ESTILO}` },
      { imagenPrompt: `A cartoon young man lounging lazily on a couch, sleepy expression, comedic style, ${ESTILO}` },
      { imagenPrompt: `A cartoon car parking in front of a house, a woman with a clipboard stepping out, ${ESTILO}` },
    ],
    keyword: "VISITA A LAS 11",
  },
  {
    id: "problema",
    texto: "Resulta que el Cristian, que se había levantado como a las diez y media, decidió que como venía la señorita del subsidio, tenía que dejar la casa presentable. Y su idea de presentable fue lavar el patio de acceso con manguera a máxima presión, quince minutos antes de que yo llegara. Sin escoba. Sin secar. Directo con la manguera, como si fuera el frontis de un supermercado.",
    tomas: [
      { imagenPrompt: `A cartoon young man spraying a garden hose at full blast on a house entrance patio, water splashing everywhere, comedic chaos, ${ESTILO}` },
      { imagenPrompt: `A cartoon wet shiny patio floor reflecting like an ice skating rink, danger implied, comedic style, ${ESTILO}` },
    ],
    keyword: "SIN ESCOBA. SIN SECAR.",
  },
  {
    id: "la_caida",
    texto: "Yo me bajo del auto, con mi carpeta, mis zapatos de taco medio institucional, porque uno también tiene que verse profesional, y camino tranquila hacia la puerta. Y ahí el patio, que parecía loza de patinaje olímpico, decide que yo no camino, sino que floto por dos segundos y después aterrizo con toda la humanidad hacia el lado.",
    tomas: [
      { imagenPrompt: `A cartoon woman comically slipping and falling on a wet shiny floor, papers flying everywhere, exaggerated motion lines, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman sprawled on the ground looking dazed with little stars circling her head, comedic style, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "el_perro",
    texto: "Ahora viene la parte que de verdad quiero que quede en acta. Porque en la casa había un perro, el Suertudo, labrador cruzado con quiltro, que en el momento exacto de mi caída decidió que la carpeta que se me había volado de las manos, con toda la documentación de renta de la familia, era un juguete nuevo. Y se la llevó. Bajo el sofá. Con la señora Nilda gritando ¡Suertudo, suelta eso!, y el Suertudo mirándola como diciendo primero negociamos.",
    tomas: [
      { imagenPrompt: `A cartoon dog joyfully running away with a folder full of papers in its mouth, ${ESTILO}` },
      { imagenPrompt: `A cartoon dog hiding under a sofa with only its tail and the folder corner visible, smug expression, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman with hands on her hips scolding a dog under a sofa, ${ESTILO}` },
    ],
    keyword: "\"PRIMERO NEGOCIAMOS\"",
  },
  {
    id: "la_negociacion",
    texto: "Terminamos los tres, la señora Nilda, el Cristian y yo, tirados en el suelo del living, tratando de sacarle la carpeta al perro con medio trozo de empanada de pino como método de negociación. Y funcionó, para que sepan. El Suertudo soltó la carpeta a cambio de la empanada, con toda la dignidad de quien acaba de cerrar un buen trato. Y entre risas, mientras nos recuperábamos del susto, alguien mencionó de pasada una oferta que había encontrado esa semana en AvíspateYa — anotado quedó, para revisar después.",
    tomas: [
      { imagenPrompt: `Three cartoon characters and a dog sitting on the living room floor negotiating over a piece of empanada, funny standoff, ${ESTILO}` },
      { imagenPrompt: `A cartoon dog happily trotting away with an empanada, folder left safely on the floor, ${ESTILO}` },
      { imagenPrompt: `A cartoon hand holding a smartphone with a shopping app open, relaxed casual pose, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "el_informe",
    texto: "Así que el informe que redacté ese día quedó, textual: Se deja constancia de que se realizó visita domiciliaria al grupo familiar compuesto por la señora Nilda y su hijo mayor, verificándose la residencia efectiva y composición familiar declarada. Se deja constancia asimismo de que la funcionaria que suscribe debió recuperar la documentación de la causa de la boca de un canino doméstico, mediante intercambio por media empanada de pino, y que dicho procedimiento no se encuentra contemplado en el manual de procedimientos vigente.",
    tomas: [
      { imagenPrompt: `A cartoon formal typed document with an official stamp, dramatic spotlight, comedic seriousness, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman reading a document out loud with an exaggerated serious formal expression, ${ESTILO}` },
    ],
    keyword: "INFORME OFICIAL",
  },
  {
    id: "cta",
    texto: "Así que no, esa visita no salió como el manual lo indicaba. Pero el subsidio, para que sepan, sí se aprobó. Y la oferta de esa semana, también se aprovechó. Entra a AvíspateYa y aprovechá la tuya.",
    imagenPrompt: `A cartoon hand holding a smartphone showing a cheerful shopping website with a big discount badge, sparkles, ${ESTILO}`,
    keyword: null,
    // Risa justo al remate del informe leído en tono formal (el punchline
    // del bloque anterior) — prueba real del mecanismo de efectos de sonido.
    efecto: { archivo: "risa_publico.wav", enSegundo: 0.2 },
  },
];
