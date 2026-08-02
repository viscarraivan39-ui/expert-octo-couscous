export const id = "reflexion-cantinflas";

// Contenido original (no adaptación, no imita el nombre/imagen real de nadie)
// — parodia del "reflexivo enredado": un personaje que habla con seriedad de
// vocabulario grande, se traba en su propia lógica, se corrige a sí mismo a
// mitad de frase y termina sin decir nada concreto ("cantinflear": hablar
// mucho, con aire de sabio, sin llegar a ninguna parte) — hasta que el
// cierre se autodesarma con un remate consciente de que no dijo nada. Sin
// marca hasta el remate final (misma regla que chamullo-reflexion.mjs: el
// chiste ES que no se note hasta el final).
const ESTILO = "colorful comic book illustration style, bold outlines, flat vibrant colors, exaggerated animated expressions, hand gestures mid-sentence, vertical composition";

export const bloques = [
  {
    id: "gancho",
    texto: "A ver, a ver, un momento, porque aquí hay que aclarar algo antes de aclarar lo otro: ¿usted sabe lo que es el tiempo? Porque yo tampoco, y ahí está el detalle.",
    tomas: [
      { imagenPrompt: `A cartoon man mid-gesture with one finger raised as if making an important point, mouth open mid-sentence, comedic confused-but-confident expression, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "enredo_1",
    texto: "Porque fíjese, el tiempo pasa, pero pasa para todos igual, y sin embargo no es igual para nadie, lo cual quiere decir que es igual, pero distinto, que es exactamente lo que le estaba explicando antes de explicarle lo que le estoy explicando ahora.",
    tomas: [
      { imagenPrompt: `A cartoon man tangled in his own gestures, hands crossing over each other, exaggerated thinking pose, question marks and clock symbols floating around, ${ESTILO}` },
    ],
    keyword: "¿SE ENTIENDE? NI YO",
  },
  {
    id: "enredo_2",
    texto: "Y no es que uno no sepa, es que uno sabe demasiado, y cuando uno sabe demasiado, sabe tan poco que ya no sabe si sabía, y ahí es cuando uno tiene que sentarse, y pensarlo, o no pensarlo, que a veces es lo mismo, o no.",
    tomas: [
      { imagenPrompt: `A cartoon man sitting on an invisible chair pose, exaggerated deep-thinker expression, sweat drop, spiral eyes, ${ESTILO}` },
      { imagenPrompt: `A cartoon man standing up abruptly with a sudden 'eureka' finger point, but confused face, ${ESTILO}` },
    ],
    keyword: null,
  },
  {
    id: "enredo_3",
    texto: "Y por eso yo siempre digo, bueno, no siempre, a veces, bueno, ahora sí, que lo importante no es lo que uno tiene, sino lo que uno necesita, que tampoco es, porque lo que uno necesita, a veces, resulta que era lo que uno ya tenía.",
    tomas: [
      { imagenPrompt: `A cartoon man holding empty hands up dramatically, exaggerated philosophical realization face, sparkles for emphasis, ${ESTILO}` },
    ],
    keyword: "LO QUE TENÍA ERA LO QUE NECESITABA (O AL REVÉS)",
  },
  {
    id: "giro",
    texto: "Y hablando de necesitar lo que uno ya tenía sin saber que lo tenía, resulta que había una oferta, ahí, en avispateya.cl, que ya estaba, desde antes, esperando a que uno la necesitara sin saber que la necesitaba. Ahí está el detalle.",
    tomas: [
      { imagenPrompt: `A cartoon man with a sudden shocked realization, pulling out a smartphone showing a discount badge, comedic tonal shift from confused rambling to salesy, wide eyes, ${ESTILO}` },
    ],
    keyword: "AVISPATEYA.CL",
    efecto: { archivo: "risa_publico.wav", enSegundo: 0.3 },
  },
];
