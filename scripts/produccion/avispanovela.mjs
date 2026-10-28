// Guionista + editor de continuidad de "Avispanovela" (ver
// BIBLIA_AVISPANOVELA.md). Una temporada = 80 capítulos, una sola historia
// con continuidad real de principio a fin.
//
// Uso:
//   node avispanovela.mjs nueva "idea libre de la historia"
//   node avispanovela.mjs continuar "Título exacto de la serie"
//   node avispanovela.mjs listar

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { pedirJSON } from "./llm.mjs";

const AQUI = fileURLToPath(new URL(".", import.meta.url));
const ESTADO_PATH = `${AQUI}series_avispanovela.json`;
const TOTAL_CAPITULOS = 80;
const N_BEATS = 16; // ~1 cada 5 capítulos

// Descripción FIJA del elenco recurrente — se le pasa al modelo tal cual en
// cada prompt de biblia para que no reinvente género/rol de un personaje que
// ya existe en otra serie (bug real: la primera vez que se generó una
// biblia, el modelo convirtió a Avispón Fernández —masculino, establecido en
// avispanovela-ep1.mjs— en la protagonista femenina de una serie nueva,
// mientras el código le seguía asignando la voz masculina fija. Resultado:
// voz de hombre sobre diálogo/imágenes escritos en femenino).
// descripcionVisual: ANCLA fija de apariencia, no de rol — sin esto, cada
// imagen de un personaje se generaba de cero con solo su nombre, así que
// FLUX inventaba colores/forma distintos cada vez (bug real reportado por
// varios espectadores: "no sabemos cuál es cuál", cambia de capítulo a
// capítulo). Se inyecta por CÓDIGO en cada imagenPrompt (ver
// personajeDescripcionVisual + escribirGuionMjs), nunca dependiendo de que
// el LLM se acuerde de repetirla solo — mismo criterio que ya se usaba para
// blindar las voces (asignarVoz), aplicado ahora a lo visual.
const ELENCO_BASE = {
  "Avispón Fernández": { voz: "es-US-Chirp3-HD-Fenrir", genero: "masculino", descripcionFija: "un avispón, empresario/heredero", descripcionVisual: "tall anthropomorphic wasp man, sleek black and yellow striped exoskeleton, sharp business suit in dark navy, slicked-back dark hair, confident angular jaw" },
  "Avispa Dorada": { voz: "es-US-Chirp3-HD-Laomedeia", genero: "femenino", descripcionFija: "una avispa dorada", descripcionVisual: "anthropomorphic wasp woman, golden-yellow and black striped exoskeleton with a metallic golden sheen, sleek professional blazer in cream, short elegant antennae, warm amber eyes" },
  "Reina Abeja": { voz: "es-US-Chirp3-HD-Zephyr", genero: "femenino", descripcionFija: "una abeja reina, con presencia", descripcionVisual: "regal anthropomorphic queen bee woman, deep amber and black striped exoskeleton, ornate dark purple gown, golden crown-shaped antennae, imposing sharp posture" },
  "Libélula Montenegro": { voz: "es-US-Chirp3-HD-Leda", genero: "femenino", descripcionFija: "una libélula", descripcionVisual: "anthropomorphic dragonfly woman, iridescent teal-blue translucent wings, slender build, dark emerald green fitted outfit, large luminous eyes" },
};
// Las 6 voces Chirp 3 HD aprobadas por el usuario. Antes solo 2 (ambas
// masculinas: Puck, Sadachbia) quedaban "libres para nuevos", porque las
// otras 4 estaban reservadas al elenco base SIEMPRE, incluso en series que
// no usan a ese personaje — bug real: en "La Unión de las Avispas", Libélula
// Montenegro (voz Leda, femenina) no aparece, pero su voz seguía bloqueada,
// así que a Sofía (protagonista femenina nueva) le tocó una voz masculina
// por no haber ninguna libre de su género. Ahora el pool libre es dinámico:
// las 6 voces menos las que el elenco base de ESTA serie realmente usa.
// Voz fija del "Narrador" (voz en off, no es un personaje en pantalla) —
// usada SOLO en el último bloque de cada capítulo, para el gancho de cierre
// tipo trailer ("¿Logrará...?", "CONTINUARÁ..."). Se reserva en
// vocesAsignadas igual que un personaje del elenco base, para que el pool
// de voces libres no se la asigne por error a un personaje nuevo.
const VOZ_NARRADOR = "es-US-Chirp3-HD-Puck";

const TODAS_LAS_VOCES = [
  "es-US-Chirp3-HD-Fenrir",
  "es-US-Chirp3-HD-Laomedeia",
  "es-US-Chirp3-HD-Zephyr",
  "es-US-Chirp3-HD-Leda",
  "es-US-Chirp3-HD-Puck",
  "es-US-Chirp3-HD-Sadachbia",
];

const ESTILO = "hyperrealistic 3D animation style, dramatic cinematic lighting, telenovela drama aesthetic, vertical portrait composition";

function cargarEstado() {
  if (!existsSync(ESTADO_PATH)) return { series: [] };
  return JSON.parse(readFileSync(ESTADO_PATH, "utf-8"));
}
function guardarEstado(estado) {
  writeFileSync(ESTADO_PATH, JSON.stringify(estado, null, 2));
}

// Match flexible: el modelo a veces escribe el nombre corto ("Avispón" en
// vez de "Avispón Fernández") — sin esto, el personaje pierde su voz fija y
// cae al pool de "nuevo personaje", rompiendo la consistencia entre series.
function buscarEnElencoBase(personaje) {
  if (ELENCO_BASE[personaje]) return ELENCO_BASE[personaje];
  const p = personaje.trim().toLowerCase();
  for (const [nombre, datos] of Object.entries(ELENCO_BASE)) {
    const n = nombre.toLowerCase();
    if (n.startsWith(p) || p.startsWith(n)) return datos;
  }
  return null;
}

function asignarVoz(serie, personaje) {
  const base = buscarEnElencoBase(personaje);
  if (base) {
    // Registrar SIEMPRE la voz del elenco base en vocesAsignadas — si no,
    // el cálculo de "voces libres" de abajo no la ve como ocupada y se la
    // puede volver a repartir a un personaje nuevo (bug real: Sofía terminó
    // con la misma voz que Avispón Fernández porque su voz nunca quedaba
    // registrada al devolverse temprano acá).
    serie.vocesAsignadas[personaje] = base.voz;
    return base.voz;
  }
  if (serie.vocesAsignadas[personaje]) return serie.vocesAsignadas[personaje];
  const usadas = new Set(Object.values(serie.vocesAsignadas));
  const libre = TODAS_LAS_VOCES.find((v) => !usadas.has(v)) || TODAS_LAS_VOCES[TODAS_LAS_VOCES.length - 1];
  serie.vocesAsignadas[personaje] = libre;
  return libre;
}

const REGLAS_MARCA = `La historia transcurre en o alrededor de Avispateya (la empresa/marca real de AvíspateYa.cl) — se sugiere VISUALMENTE (logos, oficinas, packaging, uniformes) en los imagenPrompt, pero se menciona en diálogo como máximo 1 vez cada varios capítulos, nunca forzado. Nunca la repitas en cada capítulo.`;

// Efectos de sonido reales disponibles en scripts/video-pipeline/sonidos/ —
// solo estos, no inventar nombres de archivo que no existen.
const EFECTOS_DISPONIBLES = `
- risa_publico.wav, risa_mujer.wav, risa_nino.wav, aplausos_risas.wav — risas/aplausos (solo si hay un momento genuinamente cómico, NO en drama serio)
- criatura_espeluznante.wav, lobo_aullando.wav — tensión/suspenso
- zumbido_avispa.mp3 — zumbido de avispa, útil para transiciones o el instante de un giro/revelación
- zumbido_picada.mp3 — zumbido rápido con corte seco, tipo "picadura" — bueno para el instante exacto de un cliffhanger fuerte o un golpe de efecto
Usalos con moderación: como mucho 1 efecto por capítulo, y solo si el momento realmente lo pide (nunca en cada bloque).`;

function descripcionElencoBase() {
  return Object.entries(ELENCO_BASE)
    .map(([nombre, d]) => `${nombre} (${d.genero}, ${d.descripcionFija}; descripcionVisual: "${d.descripcionVisual}")`)
    .join("; ");
}

function promptBiblia(idea) {
  return `Sos el guionista jefe de "Avispanovela", un micro-drama vertical de personajes insecto (avispas, abejas, avispones, libélulas — cuerpo humano, hiperrealistas) para AvíspateYa. Seguís las reglas reales del formato de micro-dramas verticales (ReelShort/DramaBox): capítulos cortos con cliffhanger obligatorio, temporada de 80 capítulos con arco planteamiento (cap. 1-10) -> escalada (11-38) -> "todo empeora" (39-66) -> resolución (67-80).

${REGLAS_MARCA}

Idea/premisa inicial del usuario: "${idea}"

A partir de esa idea, desarrollá la BIBLIA completa de la temporada:
- Elegí 2-3 tropos del formato (matrimonio por conveniencia, identidad oculta, herencia/hijo secreto, enemigos a amantes, segunda oportunidad) que encajen con la idea.
- Elenco recurrente disponible, con género y rol YA FIJOS (no los cambies ni les inventes otro género — son personajes que ya existen en otras series de este mismo universo): ${descripcionElencoBase()}. Usalos si encajan con la idea; si no encajan, dejalos fuera y creá personajes 100% nuevos para los roles que la idea necesita (ej. si la idea pide una protagonista mujer humilde y ningún personaje del elenco recurrente encaja con ese perfil, creá una nueva).
- Un outline de **16 beats** (uno cada ~5 capítulos), cubriendo toda la historia de principio a fin (incluido el giro final), respetando el arco de 4 tramos.

Devolvé SOLO un JSON válido (sin markdown), con esta forma exacta:
{
  "titulo": "título de la serie, tipo 'La Heredera Secreta de Avispateya' o similar, sin copiar títulos reales de ReelShort/DramaBox",
  "sinopsis": "la historia completa de principio a fin en 5-8 frases, incluyendo el giro final",
  "personajes": [{"nombre": "...", "rol": "...", "personalidad": "1 frase", "descripcionVisual": "en inglés, apariencia FÍSICA concreta y reusable: color/patrón del exoesqueleto, tipo de cuerpo, un accesorio o rasgo distintivo — NO repitas rol/personalidad acá, esto es solo lo visual, va a inyectarse literal en cada imagen de este personaje durante toda la temporada"}],
  "beats": [{"capitulos": "1-5", "resumen": "qué avanza en ese tramo"}]
}
- "beats" tiene que tener EXACTAMENTE 16 elementos, cubriendo capítulos 1-5, 6-10, 11-15, ..., 76-80.
- Para personajes del elenco recurrente que uses (Avispón Fernández, etc.), copiá su descripcionVisual EXACTA de la lista de arriba, no inventes una nueva.`;
}

function beatDeCapitulo(serie, numero) {
  return serie.beats.find((b) => {
    const [desde, hasta] = b.capitulos.split("-").map(Number);
    return numero >= desde && numero <= hasta;
  }) || serie.beats[serie.beats.length - 1];
}

function promptCapitulo(serie, numero) {
  const beat = beatDeCapitulo(serie, numero);
  const ultimo = serie.capitulos[serie.capitulos.length - 1];
  const cliffhangerPendiente = ultimo ? ultimo.cliffhangerCierre : "(es el capítulo 1, no hay cliffhanger previo)";
  const personajesConocidos = Object.keys(serie.vocesAsignadas)
    .map((nombre) => (ELENCO_BASE[nombre] ? `${nombre} (${ELENCO_BASE[nombre].genero})` : nombre))
    .join(", ");

  return `Sos guionista de "Avispanovela", serie "${serie.titulo}". Sinopsis completa de la historia: ${serie.sinopsis}

${REGLAS_MARCA}

Personajes ya establecidos: ${personajesConocidos}. Usá SIEMPRE el nombre completo exacto de cada uno en el campo "personaje" (no apodos ni nombres cortos) — cada personaje tiene una voz fija asignada a su nombre completo.
Resumen acumulado de la historia hasta el capítulo ${numero - 1}: ${serie.resumenAcumulado}
Cliffhanger pendiente de resolver: "${cliffhangerPendiente}"
Beat de la trama que corresponde a este tramo de capítulos (${beat.capitulos}): ${beat.resumen}

Escribí el CAPÍTULO ${numero} de ${TOTAL_CAPITULOS}. Duración objetivo: **1 a 2 minutos hablados** (8 a 14 bloques de diálogo, entre 220 y 380 palabras totales — más largo que un capítulo corto típico, no lo acortes).
- El/los primer(os) bloque(s) tienen que resolver o continuar DIRECTAMENTE el cliffhanger pendiente — no lo ignores ni lo cambies de tema.
- El resto avanza la trama según el beat de este tramo.
- Termina en un cliffhanger nuevo, coherente con hacia dónde va la historia según la sinopsis.
- EL ÚLTIMO BLOQUE es obligatorio y distinto de los demás: no es diálogo de personaje, es una narración corta en off (1 frase, tipo voz en off de trailer) que plantea la pregunta o el gancho hacia el próximo capítulo — ej. "¿Logrará Sofía descubrir la verdad a tiempo?" o "Lo que Avispón no sabía es que ya era demasiado tarde...". Va en el campo "personaje": "Narrador" (usa la voz ${VOZ_NARRADOR}), y el "keyword" de ese bloque tiene que ser "CONTINUARÁ...".

Efectos de sonido reales disponibles (opcional, con moderación):${EFECTOS_DISPONIBLES}

Devolvé SOLO un JSON válido (sin markdown):
{
  "resumenCapitulo": "2-3 frases de qué pasó en este capítulo",
  "resumenAcumuladoActualizado": "el resumen acumulado de TODA la historia hasta este capítulo incluido, actualizado, en no más de 8 frases (reemplaza al anterior, no lo repitas completo)",
  "cliffhangerCierre": "qué queda sin resolver al final de este capítulo",
  "personajesNuevos": [{"nombre": "...", "descripcionVisual": "en inglés, apariencia física concreta (ver formato de personajes en la biblia) — solo si este capítulo introduce a alguien que no estaba en la lista de 'Personajes ya establecidos'"}],
  "bloques": [{"id": "bloque1", "dialogo": [{"texto": "...", "personaje": "Nombre"}], "imagenPrompt": "en inglés", "keyword": "texto corto o null", "efecto": null}]
}
- "efecto" en el bloque donde tenga sentido: {"archivo": "zumbido_picada.mp3", "enSegundo": 0.3} (segundo dentro de ESE bloque), o null en el resto.`;
}

function promptVerificacion(serie, numero, capitulo, cliffhangerPendiente) {
  return `Sos el editor de continuidad de "Avispanovela", serie "${serie.titulo}". Tu trabajo es detectar contradicciones, no reescribir nada.

Sinopsis completa: ${serie.sinopsis}
Resumen acumulado ANTES de este capítulo: ${serie.resumenAcumulado}
Cliffhanger que este capítulo debía resolver/continuar: "${cliffhangerPendiente}"

Capítulo ${numero} completo (texto de todos los diálogos): ${capitulo.bloques.map((b) => b.dialogo.map((d) => `[${d.personaje}] ${d.texto}`).join(" ")).join(" / ")}

Resumen que el guionista dice que quedó: ${capitulo.resumenCapitulo}

Verificá: ¿el capítulo resuelve o continúa el cliffhanger pendiente (no lo ignora)? ¿algún personaje actúa de forma contradictoria a su rol/personalidad establecida? ¿algún hecho contradice la sinopsis o el resumen acumulado?

Devolvé SOLO un JSON: {"ok": true/false, "problemas": ["lista de problemas concretos, vacía si ok"]}`;
}

// Busca la descripción visual fija de un personaje: elenco base primero
// (siempre gana, nunca la pisa una nueva), después lo que quedó guardado en
// serie.personajes (nuevos de esta serie). null si de verdad no se encuentra
// (personaje mal escrito por el LLM) — en ese caso no se inyecta nada extra,
// mejor que reventar el capítulo.
function personajeDescripcionVisual(serie, nombre) {
  const base = buscarEnElencoBase(nombre);
  if (base) return base.descripcionVisual;
  const p = (serie.personajes || []).find((x) => x.nombre === nombre);
  return p?.descripcionVisual || null;
}

// Seed determinístico por UN SOLO personaje (el principal del bloque) — antes
// se hasheaba la combinación completa de personajes presentes, así que el
// mismo personaje caía en un seed distinto según apareciera solo o
// acompañado (bug real: "pequeñas percepciones de cambio de personaje"
// reportado 2026-08-03 en ep7-9, con la descripcionVisual ya funcionando
// pero el seed todavía inconsistente entre tomas solo/grupo del mismo
// personaje). Ancla al personaje principal del bloque (primero que habla) y
// deja que descripcionVisual, no el seed, cargue con la apariencia de los
// personajes secundarios presentes.
function seedDePersonaje(nombre) {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = (hash * 31 + nombre.charCodeAt(i)) >>> 0;
  }
  return hash % 1e9;
}

function escribirGuionMjs(serie, numeroCapitulo, capitulo) {
  const bloquesTexto = capitulo.bloques
    .map((b) => {
      const nombresEnBloque = [...new Set(b.dialogo.map((l) => l.personaje))];
      const dialogo = b.dialogo
        .map((l) => {
          const voz = asignarVoz(serie, l.personaje);
          return `      { texto: \`${String(l.texto).replace(/`/g, "'")}\`, voz: "${voz}" } /* ${l.personaje} */`;
        })
        .join(",\n");
      // Descripciones visuales fijas de cada personaje presente en el
      // bloque, inyectadas por CÓDIGO (no depende de que el LLM se acuerde
      // de repetirlas) — es el fix real al bug de "no sabemos cuál es cuál"
      // entre capítulos, ver investigación 2026-08-03. Van AL PRINCIPIO del
      // prompt, antes de la acción de la escena — los tokens más tempranos
      // pesan más en la adherencia de FLUX al prompt (feedback 2026-08-03:
      // con la descripción al final todavía se notaban cambios chicos de
      // identidad).
      const descripciones = nombresEnBloque
        .map((n) => personajeDescripcionVisual(serie, n))
        .filter(Boolean)
        .join(", ");
      const prompt = `${descripciones ? `${descripciones}, ` : ""}${b.imagenPrompt}, anthropomorphic insect with human-like body and expressive eyes, ${ESTILO}`.replace(/`/g, "'");
      const keyword = b.keyword && b.keyword !== "null" ? `"${String(b.keyword).replace(/"/g, "'")}"` : "null";
      const efectoLinea = b.efecto && b.efecto.archivo
        ? `\n    efecto: { archivo: "${b.efecto.archivo}", enSegundo: ${Number(b.efecto.enSegundo) || 0} },`
        : "";
      const seed = seedDePersonaje(nombresEnBloque[0] || "");
      return `  {
    id: "${b.id}",
    dialogo: [
${dialogo}
    ],
    imagenPrompt: \`${prompt}\`,
    keyword: ${keyword},${efectoLinea}
    seedPersonajes: ${seed},
  }`;
    })
    .join(",\n");

  const idGuion = `avispanovela-${serie.slug}-ep${numeroCapitulo}`;
  const contenido = `export const id = "${idGuion}";

// Avispanovela — serie "${serie.titulo}", capítulo ${numeroCapitulo}/${TOTAL_CAPITULOS}.
// Generado con continuidad real (ver scripts/produccion/series_avispanovela.json).

export const bloques = [
${bloquesTexto},
];
`;
  const outPath = `${AQUI}../video-pipeline/guiones/${idGuion}.mjs`;
  writeFileSync(outPath, contenido);
  return { idGuion, outPath };
}

// Garantiza que todo personaje quede con descripcionVisual — para el elenco
// base, SIEMPRE la fija de ELENCO_BASE (nunca la que haya escrito el LLM, por
// si la alteró); para personajes nuevos, la que devolvió el LLM, o una de
// respaldo genérica pero al menos consistente si vino vacía.
function normalizarPersonajes(personajes) {
  return (personajes || []).map((p) => {
    const base = buscarEnElencoBase(p.nombre);
    if (base) return { ...p, descripcionVisual: base.descripcionVisual };
    return {
      ...p,
      descripcionVisual: p.descripcionVisual || `anthropomorphic insect character named ${p.nombre}, consistent distinct silhouette and color palette`,
    };
  });
}

async function crearSerie(idea) {
  console.log(`Armando la biblia de la temporada a partir de: "${idea}"...`);
  const biblia = await pedirJSON(promptBiblia(idea));
  if (!biblia.beats || biblia.beats.length !== N_BEATS) {
    console.log(`   ⚠ el modelo devolvió ${biblia.beats?.length ?? 0} beats en vez de ${N_BEATS} — se usa igual, puede quedar desparejo.`);
  }
  biblia.personajes = normalizarPersonajes(biblia.personajes);

  const serie = {
    titulo: biblia.titulo,
    slug: biblia.titulo.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40),
    idea,
    sinopsis: biblia.sinopsis,
    personajes: biblia.personajes,
    beats: biblia.beats,
    totalCapitulosPlan: TOTAL_CAPITULOS,
    resumenAcumulado: biblia.sinopsis,
    // Vacío a propósito: se llena abajo solo con los personajes que la
    // biblia realmente usó en ESTA serie (base o nuevos) — no con todo el
    // elenco recurrente completo, para no listar como "conocidos" en el
    // prompt de cada capítulo a personajes que esta historia ni siquiera usa.
    vocesAsignadas: {},
    capitulos: [],
  };
  // Registrar primero a los personajes del elenco base (Avispón Fernández,
  // etc.) y RECIÉN DESPUÉS a los nuevos — si no, un personaje nuevo que
  // aparece primero en la lista de la biblia puede robarle su voz fija a un
  // personaje base que todavía no habló (bug real: Sofía se quedó con la
  // voz de Avispa Dorada porque la biblia la listaba primero a ella).
  const personajesOrdenados = [...(biblia.personajes || [])].sort((a, b) => {
    const aEsBase = buscarEnElencoBase(a.nombre) ? 0 : 1;
    const bEsBase = buscarEnElencoBase(b.nombre) ? 0 : 1;
    return aEsBase - bEsBase;
  });
  personajesOrdenados.forEach((p) => asignarVoz(serie, p.nombre));
  serie.vocesAsignadas["Narrador"] = VOZ_NARRADOR; // reservada, no compite con el pool de personajes nuevos

  console.log(`   ✓ Título: "${serie.titulo}"`);
  console.log(`   ✓ ${serie.beats.length} beats definidos, elenco: ${(biblia.personajes || []).map((p) => p.nombre).join(", ")}`);

  const estado = cargarEstado();
  estado.series.push(serie);
  guardarEstado(estado);

  await generarCapitulo(serie, estado);
}

async function generarCapitulo(serie, estado) {
  const numero = serie.capitulos.length + 1;
  if (numero > TOTAL_CAPITULOS) {
    console.log(`"${serie.titulo}" ya tiene los ${TOTAL_CAPITULOS} capítulos planeados.`);
    return;
  }
  console.log(`Escribiendo capítulo ${numero}/${TOTAL_CAPITULOS}...`);
  const cliffhangerPendiente = serie.capitulos.length ? serie.capitulos[serie.capitulos.length - 1].cliffhangerCierre : null;

  const capitulo = await pedirJSON(promptCapitulo(serie, numero));

  // Guardia contra respuestas truncadas por max_tokens (bug real 2026-08-04:
  // la respuesta se cortaba a mitad de un bloque y el parser de respaldo de
  // pedirJSON armaba igual un JSON "válido" pero con bloques finales vacíos o
  // duplicados — el guion se escribía corrupto y recién reventaba ffmpeg en
  // el render, mucho después y lejos del error real). Mejor fallar acá,
  // fuerte y temprano, que generar un .mjs corrupto.
  if (!Array.isArray(capitulo.bloques) || capitulo.bloques.length === 0) {
    throw new Error(`Respuesta del modelo sin bloques (probable truncamiento) — no se escribe el guion del capítulo ${numero}.`);
  }
  const bloqueVacio = capitulo.bloques.find((b) => !Array.isArray(b.dialogo) || b.dialogo.length === 0);
  if (bloqueVacio) {
    throw new Error(`Bloque "${bloqueVacio.id}" del capítulo ${numero} vino sin diálogo (probable truncamiento de la respuesta) — no se escribe el guion.`);
  }

  // Registrar la descripción visual de personajes nuevos introducidos en
  // ESTE capítulo, ANTES de escribir el guion — si no, la primera aparición
  // del personaje (justo este capítulo) queda sin ancla visual, que es
  // cuando más importa tenerla.
  if (Array.isArray(capitulo.personajesNuevos)) {
    for (const nuevo of capitulo.personajesNuevos) {
      if (!nuevo?.nombre || serie.personajes.some((p) => p.nombre === nuevo.nombre)) continue;
      serie.personajes.push(...normalizarPersonajes([{ nombre: nuevo.nombre, rol: "", personalidad: "", descripcionVisual: nuevo.descripcionVisual }]));
      console.log(`   + personaje nuevo registrado con descripción visual fija: ${nuevo.nombre}`);
    }
  }

  let chequeo = { ok: true, problemas: [] };
  if (numero === 1) {
    console.log(`   (capítulo 1 — sin cliffhanger previo que verificar, se omite el chequeo)`);
  } else {
    console.log(`   -> chequeo de continuidad...`);
    try {
      chequeo = await pedirJSON(promptVerificacion(serie, numero, capitulo, cliffhangerPendiente));
    } catch (err) {
      console.log(`      ⚠ el chequeo de continuidad falló (${err.message}) — se guarda igual, revisar a mano.`);
    }
    if (!chequeo.ok) {
      console.log(`   ⚠ posibles problemas de continuidad: ${chequeo.problemas.join("; ")}`);
    } else {
      console.log(`   ✓ sin problemas de continuidad detectados`);
    }
  }

  const { idGuion } = escribirGuionMjs(serie, numero, capitulo);

  serie.resumenAcumulado = capitulo.resumenAcumuladoActualizado || serie.resumenAcumulado;
  serie.capitulos.push({
    numero,
    resumenCapitulo: capitulo.resumenCapitulo,
    cliffhangerCierre: capitulo.cliffhangerCierre,
    guion: idGuion,
    generadoEn: new Date().toISOString(),
    chequeoContinuidad: chequeo,
  });
  guardarEstado(estado);

  console.log(`   ✓ Capítulo ${numero} escrito en scripts/video-pipeline/guiones/${idGuion}.mjs`);
  console.log(`   Cliffhanger de cierre: "${capitulo.cliffhangerCierre}"`);
}

async function main() {
  const [comando, ...resto] = process.argv.slice(2);
  const estado = cargarEstado();

  if (comando === "listar") {
    if (!estado.series.length) console.log("No hay series creadas todavía.");
    for (const s of estado.series) {
      console.log(`- "${s.titulo}" — ${s.capitulos.length}/${s.totalCapitulosPlan} capítulos`);
    }
    return;
  }

  if (comando === "nueva") {
    const idea = resto.join(" ");
    if (!idea) {
      console.error('Uso: node avispanovela.mjs nueva "idea libre de la historia"');
      process.exit(1);
    }
    await crearSerie(idea);
    return;
  }

  if (comando === "continuar") {
    const titulo = resto.join(" ");
    const serie = estado.series.find((s) => s.titulo.toLowerCase() === titulo.toLowerCase());
    if (!serie) {
      console.error(`No se encontró la serie "${titulo}". Usá "node avispanovela.mjs listar" para ver las series existentes.`);
      process.exit(1);
    }
    await generarCapitulo(serie, estado);
    return;
  }

  console.error('Uso:\n  node avispanovela.mjs nueva "idea libre de la historia"\n  node avispanovela.mjs continuar "Título exacto"\n  node avispanovela.mjs listar');
  process.exit(1);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
