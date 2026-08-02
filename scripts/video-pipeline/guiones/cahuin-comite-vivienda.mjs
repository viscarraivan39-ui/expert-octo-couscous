export const id = "cahuin-comite-vivienda";

// "El comité de vivienda" (guiones-asistente-social/
// libretos_asistente_social_chile.md, GUION 2) — texto COMPLETO, sin
// resumir, mismo criterio verbatim que los anteriores. Marca mencionada 2
// veces (aside mid-historia + cta), igual que el resto de la serie. Risa en
// el remate de la frase del vecino en la oscuridad (línea con más punch de
// toda la historia).
const ESTILO = "colorful comic book illustration style, bold outlines, flat vibrant colors, funny exaggerated cartoon expressions, vertical composition";

export const bloques = [
  {
    id: "gancho",
    texto: "Pues yo lo de las asambleas de comité de vivienda creo que funcionan bien solo en la teoría del curso de capacitación. De hecho, las considero más intensas que una teleserie de las ocho, y esta que les voy a contar todavía la recuerdo con lujo de detalle.",
    tomas: [
      { imagenPrompt: `A cartoon woman with a folder under her arm looking exhausted, thinking of a dramatic soap opera scene, ${ESTILO}` },
      { imagenPrompt: `A small cartoon neighborhood community hall (sede vecinal) with a sign, modest building, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "contexto",
    texto: "El contexto: Comité de Vivienda \"Los Aromos\", en trámite de postulación colectiva a un subsidio habitacional. Como asistente social, mi pega era acompañar el proceso, verificar que la directiva estuviera al día con los estatutos, y mediar cuando hiciera falta. Y créanme que hizo falta.",
    tomas: [
      { imagenPrompt: `A cartoon sign reading community meeting hall with a housing committee banner, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman with a clipboard mediating between two groups of neighbors, ${ESTILO}` },
    ],
    keyword: "COMITÉ \"LOS AROMOS\"",
  },
  {
    id: "llegada",
    texto: "La asamblea estaba citada para las siete de la tarde. A las siete no había nadie, obviamente, esto es Chile. A las siete y cuarenta llegó la mitad. A las ocho menos veinte llegó la otra mitad, y ahí recién empezamos, con la sede vecinal a medio iluminar porque un foco estaba quemado desde la reunión anterior y nadie lo había cambiado.",
    tomas: [
      { imagenPrompt: `A cartoon empty community hall with a clock showing 7pm, empty chairs, comedic loneliness, ${ESTILO}` },
      { imagenPrompt: `A cartoon dimly lit community hall slowly filling with neighbors, one flickering broken light bulb, ${ESTILO}` },
    ],
    keyword: "7 PM = 8 PM EN CHILE",
  },
  {
    id: "punto_uno",
    texto: "Punto uno de la tabla: lectura del acta anterior. Aprobada sin comentarios, milagrosamente.",
    tomas: [
      { imagenPrompt: `A cartoon paper document being approved with a stamp, surprised relieved expression, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "azucar_olla",
    texto: "Punto dos: estado de la postulación. Ahí yo estaba exponiendo tranquila, con mis láminas, cuando la señora Herminia levanta la mano. Pensé que iba a preguntar por los plazos del SERVIU. No. Levantó la mano para decir, textual: \"aprovechando que estamos todos, quiero dejar constancia de que la Marta me debe dos kilos de azúcar desde el año pasado\". Y ahí la Marta, que estaba sentada justo al frente, salta que \"eso fue en compensación por el préstamo de la olla a presión que nunca me devolvió completa, le faltaba la válvula\". Y de ahí para adelante fue una discusión de quince minutos sobre azúcar, ollas y válvulas, mientras yo, con mi carpeta del SERVIU en la mano, esperaba que alguien se acordara de que estábamos hablando de un subsidio habitacional.",
    tomas: [
      { imagenPrompt: `A cartoon elderly woman raising her hand dramatically in a meeting, presentation slides in background, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman pointing accusingly at another woman across a meeting room, comedic gossip confrontation, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman holding a pressure cooker lid dramatically as evidence in an argument, ${ESTILO}` },
      { imagenPrompt: `A cartoon social worker with a folder, exasperated expression, waiting patiently amid chaos, ${ESTILO}` },
    ],
    keyword: "DOS KILOS DE AZÚCAR",
  },
  {
    id: "corte_luz",
    texto: "Logré retomar el orden recién en el punto tres, cuando se cortó la luz del sector completo. Cero foco, cero proyector, cero nada. Y ahí un vecino, en la oscuridad total, suelta la frase que se ganó el aplauso de la noche: \"esto pasa siempre que hablamos de plata\". Y la sede entera se rió en la oscuridad, azúcar y olla a presión incluidos.",
    tomas: [
      { imagenPrompt: `A cartoon community hall suddenly in complete darkness, silhouettes of surprised neighbors, ${ESTILO}` },
      { imagenPrompt: `A cartoon silhouette of a man delivering a punchline in the dark, everyone laughing, comedic timing, ${ESTILO}` },
    ],
    keyword: "\"ESTO PASA SIEMPRE QUE HABLAMOS DE PLATA\"",
    efecto: { archivo: "risa_publico.wav", enSegundo: 0.5 },
  },
  {
    id: "cierre_asamblea",
    texto: "Terminamos la asamblea a la luz de las linternas de los celulares, sin firmar nada, con el compromiso de retomar \"la próxima semana, temprano, antes que se corte la luz\". Cosa que, dicho sea de paso, tampoco pasó. Mientras guardaba mis láminas a oscuras, me acordé de que esa tarde, antes de la reunión, había estado revisando ofertas en AvíspateYa — al menos eso sí llegó a buen puerto esa noche.",
    tomas: [
      { imagenPrompt: `A cartoon group of neighbors using phone flashlights in a dark room, giving up on the meeting, ${ESTILO}` },
      { imagenPrompt: `A cartoon hand holding a smartphone with a shopping app open, small glow of light in the dark room, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "informe",
    texto: "El acta que levanté esa noche dice, textual: \"Se deja constancia de que la asamblea del Comité de Vivienda 'Los Aromos' debió suspenderse por corte de suministro eléctrico del sector, no imputable a la directiva ni a esta funcionaria. Se recomienda para la próxima sesión: linterna, generador o velas, y resolver de manera extraoficial y previa la deuda de azúcar pendiente entre dos socias del comité, a fin de agilizar la tabla.\"",
    tomas: [
      { imagenPrompt: `A cartoon formal typed official document with a stamp, dramatic spotlight, comedic seriousness, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman reading a document aloud with an exaggerated formal serious expression, ${ESTILO}` },
    ],
    keyword: "ACTA OFICIAL",
  },
  {
    id: "cta",
    texto: "Así que no, esa reunión no terminó con nada firmado. Pero de la olla a presión, para que sepan, todavía se habla. Y de la oferta que pillé esa tarde en AvíspateYa, para que sepan también, todavía la tengo guardada.",
    imagenPrompt: `A cartoon pressure cooker with comedic spotlight, legendary status, next to a smartphone showing a discount badge, ${ESTILO}`,
    keyword: null,
  },
];
