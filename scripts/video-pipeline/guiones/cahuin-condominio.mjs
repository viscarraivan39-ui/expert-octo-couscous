export const id = "cahuin-condominio";

// "El cahuín del condominio social" (guiones-asistente-social/
// libretos_asistente_social_cahuinera.md, GUION 2) — texto COMPLETO, sin
// resumir. Marca mencionada 2 veces (mid-historia + cta), mismo criterio
// que los anteriores. Risa en el remate del informe (mismo patrón que
// funcionó bien en cahuin-visita-domiciliaria).
const ESTILO = "colorful comic book illustration style, bold outlines, flat vibrant colors, funny exaggerated cartoon expressions, vertical composition";

export const bloques = [
  {
    id: "gancho",
    texto: "Pues mire, yo lo de mantenerme al margen de los cahuines de un condominio lo considero una misión imposible. De hecho, la considero más difícil que bajarle el colesterol a un paciente que ama las sopaipillas. Y esta historia se lo demuestra.",
    tomas: [
      { imagenPrompt: `A cartoon woman with a clipboard standing outside a small apartment building, suspicious side-eye expression, ${ESTILO}` },
      { imagenPrompt: `A cartoon apartment building with multiple windows, each with a curious face peeking out, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "contexto",
    texto: "El contexto: me tocó hacer una serie de visitas en un condominio de vivienda social, para verificar la situación de varias familias postulantes a un mismo beneficio. O sea, en una tarde tenía que visitar como cinco departamentos distintos, todos en el mismo edificio. Un condominio chico, de esos donde todos se conocen, y donde, para qué decir, todos saben todo de todos.",
    tomas: [
      { imagenPrompt: `A cartoon small apartment building exterior with numbered doors, cozy neighborhood, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman checking a list on a clipboard with five apartment numbers, determined expression, ${ESTILO}` },
    ],
    keyword: "5 VISITAS, 1 EDIFICIO",
  },
  {
    id: "visita_101",
    texto: "Primera visita, departamento ciento uno: la señora Marisol, que apenas me ve, antes de hablar de su postulación, me dice bajito, ¿ya se enteró de lo del trescientos cuatro? Yo, inocente, le digo que no. Y ahí me cuenta que en el departamento trescientos cuatro vive un señor que supuestamente trabaja de guardia de seguridad en las noches, pero que la Marisol jura haberlo visto trabajando los martes y jueves en el negocio de la esquina, vendiendo completos, cosa que según ella no cuadra con el sueldo que dice tener para el subsidio de agua.",
    tomas: [
      { imagenPrompt: `A cartoon woman whispering secretively into another woman's ear at a doorway, dramatic gossip pose, ${ESTILO}` },
      { imagenPrompt: `A cartoon man in a security guard uniform secretly selling hot dogs at a street food cart, sneaky expression, ${ESTILO}` },
    ],
    keyword: "\"¿YA SE ENTERÓ?\"",
  },
  {
    id: "visita_304",
    texto: "Termino la visita del ciento uno, anoto lo mío, y subo al trescientos cuatro, obviamente con la curiosidad ya instalada, profesionalmente contenida, pero instalada. Me recibe el señor en cuestión, todo amable, y en la mitad de la entrevista suena su teléfono, y contesta diciendo, aló, sí, dos completos italianos, ya salgo, y cuelga como si nada, mirándome con una sonrisa que no supe bien cómo interpretar.",
    tomas: [
      { imagenPrompt: `A cartoon man answering a phone call with a nervous but polite smile during an interview, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman with clipboard raising one eyebrow suspiciously, comedic side-eye, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "visita_205",
    texto: "Bajo al departamento doscientos cinco, tercera visita, y ahí la vecina de ese piso, la señora Teresa, que resulta ser cuñada de la señora Marisol del ciento uno, me recibe con, ¿le contaron ya lo del completero del trescientos cuatro? Sí poh, si aquí todos sabemos, si su señora hasta reclama que llega oliendo a cebolla frita a las tres de la mañana. Y mientras anotaba todo esto, mentalmente, alguien me había comentado esa semana que había encontrado una oferta buenísima en AvíspateYa — dato que guardé para después, entre tanto cahuín.",
    tomas: [
      { imagenPrompt: `A cartoon woman at a doorway gossiping animatedly with wide expressive hand gestures, ${ESTILO}` },
      { imagenPrompt: `A cartoon nose wrinkling at a fried onion smell, comedic smell lines in the air, ${ESTILO}` },
      { imagenPrompt: `A cartoon hand holding a smartphone with a shopping app open, casual relaxed moment, ${ESTILO}` },
    ],
    keyword: "TODOS SABEN TODO",
  },
  {
    id: "cierre_visitas",
    texto: "Para cuando llegué a la quinta y última visita, ya tenía armado en mi cabeza un mapa completo del condominio: quién trabajaba en qué, quién sospechaba de quién, quién le debía plata a quién, y quién, según la última vecina, en realidad no vive ahí, vive donde la suegra, y solo viene los fines de semana para las visitas de ustedes.",
    tomas: [
      { imagenPrompt: `A cartoon woman with a thought bubble showing a complex web of connections between neighbors, detective style, ${ESTILO}` },
      { imagenPrompt: `A cartoon elderly woman at a doorway revealing a secret with a knowing smile, ${ESTILO}` },
    ],
    keyword: "EL MAPA COMPLETO",
  },
  {
    id: "el_informe",
    texto: "El informe consolidado de esa tarde decía, textual: Se deja constancia de haberse realizado visita a cinco unidades habitacionales del condominio, verificándose en cada caso la información socioeconómica pertinente. Se deja constancia de que, en el transcurso de las visitas, esta funcionaria recibió de manera espontánea múltiples antecedentes de carácter vecinal cruzado entre los distintos grupos familiares, los cuales exceden el objeto del presente informe y no serán consignados, sin perjuicio de que esta funcionaria egresó del condominio con un nivel de conocimiento del entorno social notablemente superior al que tenía al ingresar.",
    tomas: [
      { imagenPrompt: `A cartoon formal typed document with an official stamp, dramatic spotlight, comedic seriousness, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman reading a document out loud with an exaggerated serious formal expression, ${ESTILO}` },
    ],
    keyword: "INFORME OFICIAL",
  },
  {
    id: "cta",
    texto: "Así que no, el cahuín del completero tampoco quedó en el informe oficial. Pero en la sala de reuniones del consultorio, ese cahuín rindió como para dos cafés y una hora entera de conversación. Y esa oferta que se comentó de pasada, también rindió — la aproveché esa misma semana en AvíspateYa.",
    imagenPrompt: `A cartoon hand holding a smartphone showing a cheerful shopping website with a big discount badge, sparkles, ${ESTILO}`,
    keyword: null,
    efecto: { archivo: "risa_publico.wav", enSegundo: 0.2 },
  },
];
