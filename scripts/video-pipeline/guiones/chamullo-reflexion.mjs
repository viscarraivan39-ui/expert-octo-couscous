export const id = "chamullo-reflexion";

// Contenido original (no adaptación) — parodia del típico reel motivacional
// que suena profundo pero no dice absolutamente nada ("puro chamullo"),
// hasta que se autodesarma en el cierre. Sin marca hasta el remate final
// (regla del checklist: no forzar la mención, y acá el chiste ES que no se
// note hasta el final).
const ESTILO = "colorful comic book illustration style, bold outlines, flat vibrant colors, exaggerated dramatic guru expressions, vertical composition";

export const bloques = [
  {
    id: "gancho",
    texto: "A veces me pregunto: ¿qué es realmente vivir? Y créanme, la respuesta no es tan simple como parece.",
    tomas: [
      { imagenPrompt: `A cartoon man with a wise philosophical expression, dramatic lighting, staring into the distance, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "chamullo_1",
    texto: "El universo no te da lo que mereces. Te da lo que estás listo para recibir. Y eso, amigos míos, es una lección que la vida nos repite todos los días, aunque casi nadie la escuche.",
    tomas: [
      { imagenPrompt: `A cartoon man gesturing dramatically at the sky with cosmic stars and galaxies swirling around, ${ESTILO}` },
    ],
    keyword: "EL UNIVERSO TE ESCUCHA",
  },
  {
    id: "chamullo_2",
    texto: "Porque no se trata de tener más. Se trata de necesitar menos para sentir que ya tenés todo. Y cuando entendés eso, ahí, justo ahí, todo empieza a cambiar. O no cambia. Pero vos ya no sos el mismo.",
    tomas: [
      { imagenPrompt: `A cartoon man meditating cross-legged on a mountain, exaggerated serene expression, floating sparkles, ${ESTILO}` },
      { imagenPrompt: `A cartoon man with a confused but profound expression, question marks floating around his head, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "chamullo_3",
    texto: "La abundancia no llega cuando la buscás. Llega cuando estás en sintonía con el momento exacto en que las cosas simplemente... suceden. Y ese momento, créanme, puede ser hoy.",
    tomas: [
      { imagenPrompt: `A cartoon man with arms wide open under a golden light beam from the sky, dramatic revelation pose, ${ESTILO}` },
    ],
    keyword: "SINTONÍA CON EL MOMENTO",
  },
  {
    id: "giro",
    texto: "Y hoy, justo hoy, el universo puso en tu camino una señal clara: un descuento real, verificado, esperándote en avispateya.cl. ¿Coincidencia? El universo no cree en las coincidencias. Yo tampoco. Aprovéchala.",
    tomas: [
      { imagenPrompt: `A cartoon man with a shocked realization expression suddenly holding up a smartphone showing a discount badge, comedic tonal shift from mystical to salesy, ${ESTILO}` },
    ],
    keyword: "AVISPATEYA.CL",
    efecto: { archivo: "risa_publico.wav", enSegundo: 0.3 },
  },
];
