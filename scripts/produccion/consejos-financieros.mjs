// Guionista del segmento "Consejos Financieros" de AvíspateYa — reemplaza el
// slot de los cahuines en la misma cuenta de TikTok/Instagram, mismo sitio
// (avispateya.cl), pero tono serio en vez de humor/chisme (ver investigación
// 2026-08-03: los creadores de finanzas que funcionan en TikTok chileno no
// usan voces graciosas, hablan con tono calmado y directo).
//
// 20 videos con continuidad real: no es una novela con personajes, pero
// tampoco son 20 temas sueltos — arrancan de lo más básico (cómo ahorrar si
// ganas poco) y van sumando temas más específicos (Fonasa/Isapre, seguro de
// cesantía, bonos del Estado, ingreso extra, cobrar tu trabajo...), sin
// repetir terreno ya cubierto, y pudiendo referenciar un video anterior
// cuando corresponda ("como vimos en el video de ahorro...").
//
// Uso:
//   node consejos-financieros.mjs plan          — genera el plan de 20 temas (una sola vez)
//   node consejos-financieros.mjs siguiente      — genera el guion del próximo episodio pendiente
//   node consejos-financieros.mjs listar         — muestra el estado del plan

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { pedirJSON } from "./llm.mjs";

const AQUI = fileURLToPath(new URL(".", import.meta.url));
const ESTADO_PATH = `${AQUI}plan_consejos_financieros.json`;
const GUION_DIR = `${AQUI}../video-pipeline/guiones`;
const TOTAL_EPISODIOS = 20;
const VOZ = "es-CL-LorenzoNeural"; // tono serio/calmado — ver README del pipeline
const ESTILO = "colorful comic book illustration style, bold clean outlines, flat vibrant colors, simple didactic explainer-style illustration, no text in image, vertical composition";

// Semillas de tema que dio el usuario (2026-08-03) — el plan las respeta como
// punto de partida y completa el resto hasta 20 en un orden que va de lo más
// urgente/básico a lo más específico.
const TEMAS_SEMILLA = [
  "Cómo ahorrar si ganas poco y apenas te alcanza a fin de mes",
  "Fonasa vs. Isapre: diferencias básicas y cómo saber cuál te conviene",
  "Seguro de cesantía: cómo funciona y qué hacer si te quedas sin pega",
  "Bonos del Estado: cuáles existen y cómo saber si te corresponde alguno",
  "Cómo generar un ingreso extra",
  "Cómo cobrar o calcular el valor de tu propio trabajo",
];

function cargarEstado() {
  if (!existsSync(ESTADO_PATH)) return null;
  return JSON.parse(readFileSync(ESTADO_PATH, "utf-8"));
}
function guardarEstado(estado) {
  writeFileSync(ESTADO_PATH, JSON.stringify(estado, null, 2), "utf-8");
}

// Guardas de precisión: este segmento habla de plata y de instituciones
// reales (Fonasa, Isapres, AFC, ChileAtiende) — un dato inventado acá no es
// un chiste que sale mal, es desinformación real sobre la plata de alguien.
// Se repite en AMBOS prompts (plan y guion) a propósito, no alcanza con
// decirlo una sola vez arriba de todo.
const GUARDAS_PRECISION = `REGLAS DE PRECISIÓN (no negociables, este contenido es sobre plata real de gente real):
- NUNCA inventes cifras exactas (montos en pesos, porcentajes, fechas límite, requisitos de elegibilidad) que no sepas con certeza que son correctas y vigentes.
- Si el tema requiere un dato concreto (ej. "el bono X es de $Y"), hablá en términos GENÉRICOS ("existe un monto que varía según tu situación") y cerrá invitando a confirmar el dato exacto en ChileAtiende.gob.cl o el sitio oficial correspondiente — nunca lo presentes como un hecho verificado si no lo es.
- Nunca prometas resultados (“vas a ahorrar $100.000 seguro”) ni dés instrucciones que puedan meter a alguien en un problema legal o financiero si están mal.`;

function contextoAcumulado(estado) {
  const previos = estado.episodios.filter((e) => e.guion);
  if (previos.length === 0) return "Este es el primer episodio del segmento — no hay contenido previo que evitar repetir.";
  const resumen = previos.map((e) => `- Ep${e.numero}: ${e.titulo}`).join("\n");
  return `Episodios YA publicados en este segmento (evitá repetir el mismo consejo central, aunque el tema roce el de otro episodio; si es útil, podés referenciar de pasada uno anterior, ej. "como vimos en el video de ahorro..."):\n${resumen}`;
}

function promptPlan() {
  return `Actuás como guionista jefe del segmento "Consejos Financieros" de AvíspateYa (sitio chileno avispateya.cl), un segmento de educación financiera básica para gente que NO sabe nada de finanzas — el público es alguien que gana poco, apenas llega a fin de mes, y nunca tuvo a nadie que le explicara esto de forma simple. Tono: serio, calmado, cercano, nunca condescendiente ni con humor forzado.

Ya tenemos 6 temas semilla confirmados por el cliente, en este orden:
${TEMAS_SEMILLA.map((t, i) => `${i + 1}. ${t}`).join("\n")}

Tu trabajo: completar el plan hasta ${TOTAL_EPISODIOS} episodios en TOTAL, respetando esos 6 primeros tal cual (mismo orden, mismo enunciado), y agregando ${TOTAL_EPISODIOS - TEMAS_SEMILLA.length} temas más que sigan una progresión lógica de lo básico a lo más específico — presupuesto, deudas y tarjetas de crédito, AFP y pensiones, cómo leer tu liquidación de sueldo, crédito/historial financiero, inversión básica para principiantes, emprendimiento informal, etc. Sin repetir terreno entre episodios.

${GUARDAS_PRECISION}

Devolvé SOLO un JSON válido (sin markdown), con esta forma exacta:
{
  "episodios": [{"numero": 1, "titulo": "...", "resumen": "1-2 frases de qué va a cubrir este episodio en concreto"}]
}
- "episodios" tiene que tener EXACTAMENTE ${TOTAL_EPISODIOS} elementos, numerados 1 a ${TOTAL_EPISODIOS}.`;
}

function promptGuion(estado, numero) {
  const ep = estado.episodios.find((e) => e.numero === numero);
  return `Actuás como guionista del segmento "Consejos Financieros" de AvíspateYa (avispateya.cl, sitio chileno). Tono: serio, calmado, directo, en español de Chile hablado y natural — como alguien que de verdad sabe del tema y te lo explica sin apuro ni condescendencia. NO es un guion gracioso ni con chistes forzados.

Episodio ${numero} de ${TOTAL_EPISODIOS} — Tema: "${ep.titulo}"
Qué tiene que cubrir: ${ep.resumen}

${contextoAcumulado(estado)}

${GUARDAS_PRECISION}

Devolvé SOLO un JSON válido (sin markdown), con esta forma exacta:
{
  "bloques": [
    { "id": "gancho", "texto": "...", "imagenPrompt": "WRITTEN ENTIRELY IN ENGLISH (never Spanish) — simple didactic comic-style illustration of what's being explained in THAT specific block (not generic), no text in image", "keyword": "TEXTO CORTO O null" }
  ]
}
- IMPORTANTE: "imagenPrompt" tiene que estar 100% en inglés, sin ninguna palabra en español — es para un generador de imágenes que rinde mejor en inglés.
- 8 a 12 bloques (video de 2 a 3 minutos hablado).
- El primer bloque ("gancho") tiene que enganchar con el problema real en la primera frase (ej. "si sos de los que llega el 20 del mes sin plata...").
- El último bloque cierra con un resumen accionable de 1 frase + invitación a conocer avispateya.cl (máximo 1 mención en todo el guion, sutil, no venta forzada).
- Cada "imagenPrompt" describe una ilustración didáctica DISTINTA que ayuda a visualizar lo que se dice en ese bloque específico (ej. un gráfico simple, una escena cotidiana relevante, un ícono conceptual) — no repitas la misma escena genérica en todos los bloques.
- "keyword": palabra o frase corta en mayúsculas para overlay en pantalla en los bloques donde haya un dato/concepto clave que valga la pena destacar visualmente, o null si no aplica.`;
}

async function generarPlan() {
  if (cargarEstado()) {
    console.log("Ya existe un plan (plan_consejos_financieros.json). Borralo a mano si querés regenerarlo desde cero.");
    return;
  }
  console.log(`Armando el plan de ${TOTAL_EPISODIOS} episodios...`);
  const plan = await pedirJSON(promptPlan());
  if (!plan.episodios || plan.episodios.length !== TOTAL_EPISODIOS) {
    console.log(`   ⚠ el modelo devolvió ${plan.episodios?.length ?? 0} episodios en vez de ${TOTAL_EPISODIOS} — se usa igual, puede quedar desparejo.`);
  }
  const estado = {
    voz: VOZ,
    creadoEn: new Date().toISOString(),
    episodios: plan.episodios.map((e) => ({ numero: e.numero, titulo: e.titulo, resumen: e.resumen, guion: null })),
  };
  guardarEstado(estado);
  console.log(`Plan guardado en ${ESTADO_PATH}:`);
  for (const e of estado.episodios) console.log(`   ${e.numero}. ${e.titulo}`);
}

function slug(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

function escribirGuionMjs(numero, titulo, bloquesLLM) {
  const idGuion = `consejos-financieros-ep${String(numero).padStart(2, "0")}-${slug(titulo)}`;
  const outPath = `${GUION_DIR}/${idGuion}.mjs`;
  const bloquesTexto = bloquesLLM
    .map((b) => {
      const texto = String(b.texto).replace(/`/g, "'");
      const imagen = `${b.imagenPrompt}, ${ESTILO}`.replace(/`/g, "'");
      const keyword = b.keyword && b.keyword !== "null" ? `"${String(b.keyword).replace(/"/g, "'")}"` : "null";
      return `  {
    id: "${b.id}",
    texto: \`${texto}\`,
    voz: "${VOZ}",
    tomas: [
      { imagenPrompt: \`${imagen}\` },
    ],
    keyword: ${keyword},
  }`;
    })
    .join(",\n");

  const contenido = `export const id = "${idGuion}";

// Consejos Financieros ep${numero}/${TOTAL_EPISODIOS} — "${titulo}"
// Generado automáticamente por consejos-financieros.mjs, ver plan completo en
// plan_consejos_financieros.json. Voz: ${VOZ} (tono serio, distinto de la
// Catalina que usa el resto de AvíspateYa) — ver investigación de voz
// 2026-08-03 en el chat de producción.

export const bloques = [
${bloquesTexto},
];
`;
  writeFileSync(outPath, contenido, "utf-8");
  return { idGuion, outPath };
}

async function generarSiguiente() {
  const estado = cargarEstado();
  if (!estado) {
    console.log('No hay plan todavía. Corré primero: node consejos-financieros.mjs plan');
    return;
  }
  const siguiente = estado.episodios.find((e) => !e.guion);
  if (!siguiente) {
    console.log(`Ya están los ${TOTAL_EPISODIOS} episodios generados.`);
    return;
  }
  console.log(`Escribiendo guion del episodio ${siguiente.numero}: "${siguiente.titulo}"...`);
  const resultado = await pedirJSON(promptGuion(estado, siguiente.numero));
  if (!resultado.bloques || resultado.bloques.length < 6) {
    console.log(`   ⚠ el modelo devolvió ${resultado.bloques?.length ?? 0} bloques, revisar a mano.`);
  }
  const { idGuion, outPath } = escribirGuionMjs(siguiente.numero, siguiente.titulo, resultado.bloques);
  siguiente.guion = idGuion;
  siguiente.generadoEn = new Date().toISOString();
  guardarEstado(estado);
  console.log(`   ✓ guion escrito en ${outPath}`);
}

function listar() {
  const estado = cargarEstado();
  if (!estado) {
    console.log("No hay plan todavía.");
    return;
  }
  for (const e of estado.episodios) {
    console.log(`${e.numero}. [${e.guion ? "✓ generado" : "pendiente"}] ${e.titulo}`);
  }
}

const comando = process.argv[2];
if (comando === "plan") await generarPlan();
else if (comando === "siguiente") await generarSiguiente();
else if (comando === "listar") listar();
else {
  console.error("Uso: node consejos-financieros.mjs plan|siguiente|listar");
  process.exit(1);
}
