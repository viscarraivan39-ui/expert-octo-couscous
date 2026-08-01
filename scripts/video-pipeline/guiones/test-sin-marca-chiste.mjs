export const id = "test-sin-marca-chiste";

// Prueba de diagnóstico: mismo pipeline, mismo estilo, pero CERO mención de
// AvíspateYa (ni hablada ni en overlay) y CERO logo/marca de agua — para
// aislar si el problema de alcance es por "contenido promocional" o si es
// simplemente cold start de cuenta nueva (lo más probable según lo que ya
// investigamos). Chiste original, sin marca, ~40-50s.
export const sinMarca = true;

const ESTILO = "colorful comic book illustration style, bold outlines, flat vibrant colors, funny exaggerated cartoon expressions, vertical composition";

export const bloques = [
  {
    id: "gancho",
    texto: "Un hombre entra a una tienda de mascotas y le dice al vendedor: quiero el perro más inteligente que tenga.",
    tomas: [
      { imagenPrompt: `A cartoon man walking into a pet shop, curious expression, colorful shop interior, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "cuerpo1",
    texto: "El vendedor lo lleva hasta el fondo y le muestra un perro comiendo tranquilo en su plato. Le dice: mire, perro, andá y traeme el diario. El perro se para, toma una moneda del mostrador, sale por la puerta, y vuelve a los cinco minutos con el diario bajo el brazo y el vuelto exacto en la boca.",
    tomas: [
      { imagenPrompt: `A cartoon dog calmly eating from a bowl in a pet shop, ${ESTILO}` },
      { imagenPrompt: `A cartoon dog confidently walking out of a shop door holding a coin in its mouth, ${ESTILO}` },
      { imagenPrompt: `A cartoon dog proudly returning with a newspaper under its arm and coins in its mouth, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "cuerpo2",
    texto: "El hombre, sin pensarlo dos veces, compra el perro. Llega a la casa esa misma tarde, y para probarlo le dice: andá y traeme el diario, como hiciste en la tienda. El perro lo mira, y no se mueve ni un poco. El hombre insiste, un poco enojado: dale, si allá lo hiciste altiro.",
    tomas: [
      { imagenPrompt: `A cartoon man proudly walking home with a dog on a leash, happy expression, ${ESTILO}` },
      { imagenPrompt: `A cartoon dog sitting completely still with a deadpan unimpressed expression, ${ESTILO}` },
      { imagenPrompt: `A cartoon man pointing insistently with a slightly annoyed expression at a dog, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "remate",
    texto: "Y el perro finalmente le contesta: obvio que allá lo hice altiro, si esa tienda quedaba a media cuadra. Acá el diario más cercano me queda a cuarenta minutos caminando. ¿Usted cree que yo soy leso?",
    tomas: [
      { imagenPrompt: `A cartoon dog talking back with a sassy confident expression, speech bubble style, ${ESTILO}` },
      { imagenPrompt: `A cartoon man with a shocked jaw-dropped surprised face, ${ESTILO}` },
    ],
    keyword: null,
    efecto: { archivo: "risa_publico.wav", enSegundo: 3 },
  },
];
