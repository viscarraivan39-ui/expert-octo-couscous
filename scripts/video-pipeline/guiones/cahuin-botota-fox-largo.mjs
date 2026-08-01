export const id = "cahuin-botota-fox-largo";

// Versión extendida (~5 min) del cahuín real de Botota Fox. Prueba de
// formato: la narradora menciona AvíspateYa como muletilla recurrente entre
// cada tramo del chisme ("copucha"), no solo una vez al final. Todo lo que
// se narra como hecho está sacado de la cobertura real (Publimetro, La
// Hora, Meganoticias, Tecache, etc. — julio 2026); las partes que son
// opinión/especulación de la narradora quedan explícitamente marcadas como
// tal en el texto ("uno se pregunta", "dicen por ahí"), no como hecho.
const ESTILO = "colorful comic book illustration style, bold outlines, flat vibrant colors, funny exaggerated cartoon expressions, vertical composition";

export const bloques = [
  {
    id: "gancho",
    texto: "Esto no me lo contó ninguna vecina — esto lo vio Chile entero en vivo, en pleno escenario, sin filtro. Y antes de que me digan nada: sí, esto lo supe scrolleando el celular, como todo, mientras andaba en AvíspateYa mirando ofertas.",
    tomas: [
      { imagenPrompt: `A cartoon female comedian on a stage with a spotlight, holding a microphone, dramatic pose, ${ESTILO}` },
      { imagenPrompt: `A cartoon crowd in a theater looking surprised and whispering to each other, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "el_show",
    texto: "Partamos por el principio. La comadre estaba lanzando su nuevo show, uno que se llama Ni Santa, Ni Señora, en un casino allá por el sur, en Punta Arenas. Era el estreno, la gente había pagado entrada, todos con ganas de reírse un rato.",
    tomas: [
      { imagenPrompt: `A cartoon theater marquee with bright lights announcing a comedy show, festive atmosphere, ${ESTILO}` },
      { imagenPrompt: `A cartoon crowd of excited people lining up outside a casino theater entrance, ${ESTILO}` },
      { imagenPrompt: `A cartoon comedian backstage looking at herself in a mirror before a show, ${ESTILO}` },
    ],
    keyword: "PUNTA ARENAS",
  },
  {
    id: "aviso1",
    texto: "Y mire, hablando de encontrar cosas buenas donde uno menos espera — eso es literal lo que es AvíspateYa: vas a buscar una cosa y terminas encontrando el descuento que necesitabas. Pero bueno, sigamos con el cahuín, que se pone bueno.",
    tomas: [
      { imagenPrompt: `A cartoon hand holding a smartphone showing a shopping app with a discount badge, cheerful sparkles, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "los_videos",
    texto: "Resulta que a poco andar del show, la gente empezó a grabar. Y lo que se ve en esos videos es a la comadre perdiendo el hilo de lo que estaba contando, como si se le escapara la idea a mitad de camino. No una vez, varias veces.",
    tomas: [
      { imagenPrompt: `Multiple cartoon smartphones held up filming a stage, glowing screens, dramatic spotlight, ${ESTILO}` },
      { imagenPrompt: `A cartoon comedian on stage with a confused thinking expression, question marks floating above her head, ${ESTILO}` },
    ],
    keyword: "SE GRABÓ TODO",
  },
  {
    id: "la_reaccion",
    texto: "Y ahí uno se pregunta, ¿qué se hace en ese momento si uno pagó entrada? Bueno, la gente no se quedó callada — empezaron a pedir que les devolvieran la plata. Ahí mismo, en pleno show.",
    tomas: [
      { imagenPrompt: `A cartoon crowd with worried and annoyed expressions, some with arms crossed, comedic style, ${ESTILO}` },
      { imagenPrompt: `A cartoon hand holding up a ticket stub with a frustrated expression nearby, ${ESTILO}` },
    ],
    keyword: "PIDEN DEVOLUCIÓN",
  },
  {
    id: "aviso2",
    texto: "Y así como esa gente quería que le devolvieran su plata, a mí lo que me gusta es no tener que pedir devolución de nada — por eso reviso AvíspateYa antes de comprar cualquier cosa, para no arrepentirme después. Pero sigamos, que falta lo mejor.",
    tomas: [
      { imagenPrompt: `A cartoon person happily comparing prices on a smartphone, thumbs up, cheerful colors, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "se_viraliza",
    texto: "Los videos se subieron a redes, y de ahí para adelante fue una bola de nieve — todo Chile comentando, compartiendo, opinando. De un show en Punta Arenas pasó a ser tema nacional en cuestión de horas.",
    tomas: [
      { imagenPrompt: `A cartoon phone screen showing a viral video with thousands of comment and share bubbles flying out, ${ESTILO}` },
      { imagenPrompt: `A cartoon map of Chile with glowing dots spreading from south to north like a viral spread, ${ESTILO}` },
    ],
    keyword: "SE HIZO VIRAL",
  },
  {
    id: "las_criticas",
    texto: "Y como es de esperarse, las críticas no se hicieron esperar. Que si era una falta de respeto al público, que si no era primera vez que se comentaba algo así de ella. Dicen por ahí — y esto ojo, es lo que se comentaba en redes, no algo que yo pueda confirmar — que el ambiente en el casino se puso pesado esa noche.",
    tomas: [
      { imagenPrompt: `A cartoon speech bubble collage with different exaggerated angry and shocked faces inside, ${ESTILO}` },
      { imagenPrompt: `A cartoon tense stage with dim lighting and empty seats slowly emptying out, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "aviso3",
    texto: "Mire, y hablando de ambientes pesados, lo único pesado que a mí me gusta encontrar es el porcentaje de descuento — mientras más pesado, mejor. Eso sí lo encuentro seguido en AvíspateYa. Ya, ahora sí, viene la parte donde ella da la cara.",
    tomas: [
      { imagenPrompt: `A cartoon giant discount percentage sign glowing, playful oversized design, ${ESTILO}` },
    ],
    keyword: "-45% OFF",
  },
  {
    id: "la_disculpa",
    texto: "Y acá viene lo que a mí me pareció lo más rescatable de todo esto: la comediante no se escondió. Salió ella misma, en primera persona, a dar la cara. Dijo, textual, me pasé siete mil pueblos, tengo tanta vergüenza. Reconoció que había tomado antes del show, que no había comido nada, y confesó que su ánimo había estado raro últimamente, y que refugiarse en el alcohol no está bien.",
    tomas: [
      { imagenPrompt: `A cartoon woman recording a heartfelt sincere apology video on her phone, warm lighting, teary eyes, ${ESTILO}` },
      { imagenPrompt: `A cartoon speech bubble with the words sorry written in a handwritten style, surrounded by small hearts, ${ESTILO}` },
      { imagenPrompt: `A cartoon woman sitting alone reflecting quietly, soft lighting, thoughtful expression, ${ESTILO}` },
    ],
    keyword: "\"ME PASÉ 7 MIL PUEBLOS\"",
  },
  {
    id: "aviso4",
    texto: "Y yo ahí, sinceramente, sentí harto respeto — cuesta salir a dar la cara así, en público. Es como cuando uno encuentra una oferta tan buena en AvíspateYa que igual hay que compartirla, aunque dé un poco de vergüenza lo emocionado que uno se pone.",
    tomas: [
      { imagenPrompt: `A cartoon person excitedly showing their phone screen to a friend, big genuine smiles, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "el_cierre",
    texto: "Así que ahí lo tienen: el show que se salió de control, el público que no se quedó callado, y una disculpa que, para bien o para mal, dio la cara. Ese es el cahuín completo, sin vueltas.",
    tomas: [
      { imagenPrompt: `A cartoon theater curtain closing slowly with a spotlight fading, dramatic ending, ${ESTILO}` },
      { imagenPrompt: `A cartoon newspaper front page with a comedy show headline, playful illustration style, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "cta",
    texto: "Y ya que llegamos hasta acá juntos, aprovecho de contarles: entre el escándalo y las ofertas que encontré esa misma tarde en AvíspateYa, la noche me salió redonda igual — el chisme gratis, y el descuento, pagando la mitad. Entra a AvíspateYa ahora y contame si a vos también te tocó ver el show.",
    imagenPrompt: `A cartoon hand holding a smartphone showing a cheerful shopping website with a big discount badge, sparkles, ${ESTILO}`,
    keyword: null,
  },
];
