// Los "3 guionistas": mismo tema, 3 ángulos distintos, para que el
// encargado de contenido (validarContenido.mjs) elija el que mejor sirve —
// en vez de que un solo borrador defina todo el contenido de una tendencia.
//
// Uso: node guionistas.mjs "tema del brief"

import { pedirJSON } from "./llm.mjs";

// Ventana de "solo promocionar la web" mientras se espera respuesta de Soicos
// (afiliados) — durante esta ventana el objetivo es que la gente CONOZCA
// avispateya.cl y entre al sitio, no empujar un producto/afiliado puntual.
// Pasada la fecha, esto deja de inyectarse en los prompts.
const MODO_SOLO_WEB_HASTA = new Date("2026-08-15");
function modoActual() {
  const hoy = new Date();
  if (hoy <= MODO_SOLO_WEB_HASTA) {
    return `MODO ACTUAL (vence ${MODO_SOLO_WEB_HASTA.toISOString().slice(0, 10)}): estamos esperando aprobación de una red de afiliados, así que por ahora el objetivo NO es vender un producto puntual — es que la gente conozca y visite avispateya.cl. Evitá guiones tipo "compra este producto ya"; priorizá contenido de valor (tendencias, tips, recomendaciones, actualidad) que termine invitando a conocer el sitio en general.`;
  }
  return "";
}

const ESQUEMA = `Devolvé SOLO un JSON válido (sin markdown, sin \`\`\`), con esta forma exacta:
{
  "angulo": "una frase describiendo el enfoque elegido",
  "bloques": [
    { "id": "gancho", "texto": "...", "imagenPrompt": "...", "keyword": null },
    { "id": "...", "texto": "...", "imagenPrompt": "...", "keyword": "TEXTO O null" }
  ]
}
- 4 a 7 bloques. Cada "texto" es lo que se narra en voz (español de Chile, natural, hablado).
- "imagenPrompt" en inglés, describe la escena de ese bloque (para generación de imagen con IA).
- "keyword" es un texto corto en mayúsculas para overlay en pantalla, o null si no aplica.
- El primer bloque (id "gancho") tiene que enganchar en la primera frase, sin rodeos.
- Mencionar "avispateya.cl" como máximo 2 veces en todo el guion (no en cada bloque).
- NUNCA inventar urgencia falsa (stock falso, countdown falso) ni testimonios inventados.
- NUNCA inventar datos de producto/precio que no te di.`;

const GUIONISTAS = [
  {
    nombre: "Guionista Cahuín",
    estilo: "comic",
    prompt: (tema) => `Actuás como guionista de contenido para AvíspateYa (sitio chileno), estilo "cahuín"/anécdota conversacional en primera persona, tono chileno cercano y con humor, como el que cuenta un chisme entretenido a un amigo. NO inventes hechos falsos sobre personas reales — si el tema involucra gente real, mantenete en lo genérico/opinión, no dramatices como si fuera un hecho verificado.

${modoActual()}

Tema/tendencia de hoy: "${tema}"

Escribí un guion corto de video (30-50 segundos hablados) que conecte este tema con una anécdota o comentario tipo cahuín, y que en algún punto (no forzado) mencione avispateya.cl como algo que vale la pena conocer.

${ESQUEMA}`,
  },
  {
    nombre: "Guionista Tips/Actualidad",
    estilo: "comic",
    prompt: (tema) => `Actuás como guionista de contenido de valor para AvíspateYa (sitio chileno): tips prácticos, recomendaciones o comentario de actualidad relacionado al tema del día. Tono entusiasta pero honesto, sin superlativos vacíos, sin inventar datos.

${modoActual()}

Tema/tendencia de hoy: "${tema}"

Escribí un guion corto de video (25-40 segundos hablados) que use este tema como gancho de entrada, entregue 1-2 tips o recomendaciones genuinamente útiles relacionados, y cierre invitando a conocer avispateya.cl — sin urgencia fabricada, sin forzar la venta de un producto específico.

${ESQUEMA}`,
  },
  {
    nombre: "Guionista Avispanovela",
    estilo: "hiperrealista",
    prompt: (tema) => `Actuás como guionista de "Avispanovela", una telenovela corta de personajes insecto (avispas, abejas, avispones) con cuerpo humano, hiperrealistas, dramas cortos con cliffhanger — formato adaptado de la tendencia viral "Frutinovelas". Elenco recurrente: Avispón Fernández, Avispa Dorada, Reina Abeja, Libélula Montenegro (podés sumar personajes insecto nuevos si la trama lo pide).

${modoActual()}

Tema/tendencia de hoy (usalo solo como INSPIRACIÓN libre para la trama, no lo menciones literal): "${tema}"

Escribí un episodio corto (20-35 segundos, diálogo entre 2-3 personajes) que termine en suspenso ("continuará"). Mencioná avispateya.cl como máximo 1 vez, de forma sutil (ej. un personaje comenta una oferta de pasada), no forzado.

${ESQUEMA}`,
  },
];

export async function generarBorradores(tema) {
  const resultados = [];
  for (const g of GUIONISTAS) {
    console.log(`   -> ${g.nombre} escribiendo...`);
    try {
      const borrador = await pedirJSON(g.prompt(tema));
      resultados.push({ guionista: g.nombre, estilo: g.estilo, ...borrador });
    } catch (err) {
      console.log(`      ⚠ ${g.nombre} falló: ${err.message}`);
    }
  }
  return resultados;
}

import { pathToFileURL } from "node:url";
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const tema = process.argv.slice(2).join(" ");
  if (!tema) {
    console.error("Uso: node guionistas.mjs \"tema del brief\"");
    process.exit(1);
  }
  const borradores = await generarBorradores(tema);
  console.log(JSON.stringify(borradores, null, 2));
}
