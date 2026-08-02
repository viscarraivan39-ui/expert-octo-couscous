export const id = "avispanovela-ep1";

// "Avispanovela" — formato adaptado de la tendencia viral "Frutinovelas":
// insectos con cuerpo humano y rostro hiperrealista, drama de telenovela,
// termina en suspenso. Estilo confirmado que pasa el filtro de FLUX (no es
// un rostro humano real, es un insecto antropomorfizado).
const ESTILO = "hyperrealistic 3D animation style, dramatic cinematic lighting, telenovela drama aesthetic, vertical portrait composition";

function personaje(desc) {
  return `${desc}, anthropomorphic insect with human-like body and expressive eyes, ${ESTILO}`;
}

// Voces fijas por personaje (Google Cloud TTS Chirp 3 HD) — antes Reina Abeja
// tenía una voz distinta en cada bloque (bug de cuando solo había 2 voces
// Edge TTS disponibles); ahora cada personaje tiene una voz consistente.
const VOZ_AVISPON_FERNANDEZ = "es-US-Chirp3-HD-Fenrir";
const VOZ_AVISPA_DORADA = "es-US-Chirp3-HD-Laomedeia";
const VOZ_REINA_ABEJA = "es-US-Chirp3-HD-Zephyr";

export const bloques = [
  {
    id: "cap1",
    dialogo: [
      { texto: "Hoy es el día. Avispón Fernández y yo, por fin, comprometidos.", voz: VOZ_AVISPA_DORADA },
      { texto: "Avispa Dorada, esta noche cambia todo para nosotros.", voz: VOZ_AVISPON_FERNANDEZ },
    ],
    tomas: [
      { imagenPrompt: personaje("A golden wasp woman in an elegant white dress, radiant happy expression, engagement party") },
      { imagenPrompt: personaje("A hornet man in a black tuxedo, confident charming smile, holding a golden ring") },
    ],
    keyword: null,
  },
  {
    id: "cap2",
    dialogo: [
      { texto: "Qué fiesta tan hermosa. Lástima que no dure lo que ustedes creen.", voz: VOZ_REINA_ABEJA },
      { texto: "Reina Abeja... ¿qué haces aquí? Nadie te invitó.", voz: VOZ_AVISPON_FERNANDEZ },
    ],
    tomas: [
      { imagenPrompt: personaje("A queen bee woman in a dramatic dark red gown, sinister confident smile, crashing a party uninvited") },
      { imagenPrompt: personaje("A hornet man with a shocked worried expression, stepping back defensively") },
    ],
    keyword: "SIN INVITACIÓN",
  },
  {
    id: "cap3",
    dialogo: [
      { texto: "Avispón, ¿qué está pasando? ¿Quién es ella?", voz: VOZ_AVISPA_DORADA },
      { texto: "Antes de que digas que sí... alguien tiene que ver esto.", voz: VOZ_REINA_ABEJA },
    ],
    tomas: [
      { imagenPrompt: personaje("A golden wasp woman with a confused worried expression, looking between two people") },
      { imagenPrompt: personaje("A queen bee woman holding out a sealed envelope dramatically, close-up on the envelope") },
    ],
    keyword: null,
  },
  {
    id: "cierre",
    texto: "¿Qué habrá en el sobre? Descubrilo en el próximo capítulo de Avispanovela.",
    imagenPrompt: personaje("A dramatic close-up of a sealed envelope on a table with dramatic shadow lighting, suspenseful mood"),
    keyword: "CONTINUARÁ...",
  },
];
