export const id = "profe-emi-promo";

// Video promocional de Profe Emi (herramienta gratuita de AvíspateYa para
// practicar PAES M1). Tono: coach exigente pero cariñoso/cómico, mismo humor
// irreverente de los cahuines de AvíspateYa — no un hook serio de producto.
// Estructura Biblia: Gancho -> Contexto -> Problema -> Giro/Solución -> CTA.
// Narrador único (Catalina, voz por defecto del pipeline), con efecto
// "ardilla" (pitch agudo tipo Chipmunks, ver aplicarEfectoArdilla en
// build.mjs) en todos los bloques para un tono más cómico/exagerado.
// Declarar como contenido con IA en la descripción al publicar.
export const bloques = [
  {
    id: "gancho",
    texto: "¡Estudia, cabro flojo, estudia! ¿Cuántas veces te lo han dicho ya? Pucha, la lata.",
    tomas: [
      { imagenPrompt: "Cartoon-style illustration of a messy desk with a closed textbook gathering dust, comedic exaggerated style, warm colors, no visible faces, vertical composition" },
      { imagenPrompt: "Close-up of a phone screen with social media scrolling, blurred background, comedic dramatic lighting, no visible face, photorealistic vertical photo" },
    ],
    keyword: null,
    efectoVoz: "ardilla",
  },
  {
    id: "contexto",
    texto: "Tranqui, no te vengo a retar por gusto. Te vengo a presentar a alguien que sí te va a hacer estudiar, sin sermón de tía: Profe Emi, la avispa profesora de AvíspateYa.",
    tomas: [
      { imagenPrompt: "Friendly cartoon wasp character wearing glasses like a strict but caring teacher, arms crossed, flat vector illustration style, warm teal and orange colors, vertical composition" },
      { imagenPrompt: "Close-up of hands holding a smartphone showing a math chat app, cozy bedroom desk background, photorealistic vertical photo" },
    ],
    keyword: "GRATIS",
    efectoVoz: "ardilla",
  },
  {
    id: "problema",
    texto: "Porque copiarle la respuesta a cualquier IA se siente bacán ahora... pero el día de la PAES de verdad, ahí no vas a tener a quién copiarle, cabro.",
    tomas: [
      { imagenPrompt: "Cartoon-style illustration of a student sweating nervously in front of an exam paper, comedic exaggerated expression style, no visible detailed face, warm colors, vertical composition" },
      { imagenPrompt: "Close-up of a pencil hovering over a multiple choice answer sheet, dim lighting, no visible face, photorealistic vertical photo" },
    ],
    keyword: null,
    efectoVoz: "ardilla",
  },
  {
    id: "giro",
    texto: "Por eso la Profe Emi no te regala nada: te hace preguntas hasta que la ecuación te salga a ti. Y si quieres más caña, te arma una guía en PDF gratis, con su propia hoja de respuestas, pa' que le saques una foto y la corrija contigo.",
    tomas: [
      { imagenPrompt: "Close-up of a notebook page with a highlighted math word problem, colorful annotations, photorealistic vertical photo" },
      { imagenPrompt: "Close-up of a printed worksheet with multiple choice bubble answers on a desk, warm lighting, photorealistic vertical photo" },
      { imagenPrompt: "Close-up of a smartphone camera framing a worksheet to take a photo, warm desk lighting, no visible face, photorealistic vertical photo" },
    ],
    keyword: "NUNCA TE DA LA RESPUESTA",
    efectoVoz: "ardilla",
  },
  {
    id: "cta",
    texto: "¡Así que deja la talla y estudia con la Profe Emi! Gratis, sin registrarte, ahora mismo en avispateya punto cl.",
    imagenPrompt: "Friendly cartoon wasp character wearing glasses like a teacher, flat vector illustration style, warm teal and orange colors, giving a thumbs up with a big grin, vertical composition",
    keyword: null,
    efectoVoz: "ardilla",
  },
];
