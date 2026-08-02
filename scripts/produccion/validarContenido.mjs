// El "encargado de contenido": recibe los 3 borradores de guionistas.mjs,
// aplica el CHECKLIST_VALIDACION.md (parte por reglas automáticas, parte por
// criterio del modelo) y elige uno — o rechaza los 3 si ninguno pasa.
//
// Uso: node validarContenido.mjs "tema del brief"

import { readFileSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import { generarBorradores } from "./guionistas.mjs";
import { pedirJSON } from "./llm.mjs";

const AQUI = fileURLToPath(new URL(".", import.meta.url));

// Reglas automáticas, sin depender de que el modelo se acuerde de aplicarlas.
const FRASES_URGENCIA_FALSA = [
  /quedan? \d+ unidad/i,
  /solo por hoy/i,
  /última oportunidad/i,
  /se agota/i,
  /corre antes de que/i,
];

function chequeoAutomatico(borrador) {
  const problemas = [];
  const textoCompleto = borrador.bloques.map((b) => b.texto).join(" ");

  const mencionesMarca = (textoCompleto.match(/avispateya\.cl/gi) || []).length;
  if (mencionesMarca > 2) problemas.push(`menciona avispateya.cl ${mencionesMarca} veces (máx. 2)`);

  for (const patron of FRASES_URGENCIA_FALSA) {
    if (patron.test(textoCompleto)) problemas.push(`posible urgencia fabricada: coincide con /${patron.source}/`);
  }

  if (!borrador.bloques.length || borrador.bloques.length < 3) {
    problemas.push("muy pocos bloques (mínimo 3 para que sea un video real)");
  }

  return problemas;
}

async function elegirMejor(tema, candidatos) {
  const checklist = readFileSync(`${AQUI}CHECKLIST_VALIDACION.md`, "utf-8");
  const resumen = candidatos
    .map((c, i) => `${i}. [${c.guionista}] ángulo: ${c.angulo}\n   texto completo: ${c.bloques.map((b) => b.texto).join(" ")}`)
    .join("\n\n");

  const prompt = `Sos el encargado de contenido de AvíspateYa. Estas son las reglas de validación del sitio:

${checklist}

Tenés ${candidatos.length} borradores de guion sobre el tema "${tema}" (ya pasaron un chequeo automático básico). Elegí el que mejor combina: gancho fuerte en los primeros segundos, honestidad (sin urgencia falsa ni datos inventados), respeto a las reglas de arriba, y que no se sienta forzado en la mención de la marca.

${resumen}

Devolvé SOLO un JSON: {"indice_elegido": N, "razon": "1-2 frases"}`;

  return await pedirJSON(prompt);
}

const ESTILOS = {
  comic: "colorful comic book illustration style, bold outlines, flat vibrant colors, funny exaggerated cartoon expressions, vertical composition",
  hiperrealista: "hyperrealistic 3D animation style, dramatic cinematic lighting, telenovela drama aesthetic, vertical composition",
};

function escribirGuionMjs(id, borrador) {
  const sufijoEstilo = ESTILOS[borrador.estilo] || ESTILOS.comic;
  const bloquesTexto = borrador.bloques
    .map((b) => {
      const prompt = `${b.imagenPrompt}, ${sufijoEstilo}`.replace(/`/g, "'");
      const texto = String(b.texto).replace(/`/g, "'");
      const keyword = b.keyword ? `"${String(b.keyword).replace(/"/g, "'")}"` : "null";
      return `  {
    id: "${b.id}",
    texto: \`${texto}\`,
    imagenPrompt: \`${prompt}\`,
    keyword: ${keyword},
  }`;
    })
    .join(",\n");

  return `export const id = "${id}";

// Generado por el equipo de producción (guionistas.mjs + validarContenido.mjs)
// — ángulo elegido: "${borrador.angulo.replace(/"/g, "'")}" (${borrador.guionista}).
// Revisar contra CHECKLIST_VALIDACION.md antes de publicar; esto es un
// borrador listo para renderizar de prueba, no aprobado automáticamente para
// publicación final sin revisión humana.

export const bloques = [
${bloquesTexto},
];
`;
}

async function main() {
  const tema = process.argv.slice(2).join(" ");
  if (!tema) {
    console.error('Uso: node validarContenido.mjs "tema del brief"');
    process.exit(1);
  }

  console.log(`Guionistas trabajando sobre: "${tema}"`);
  const candidatos = await generarBorradores(tema);
  if (!candidatos.length) {
    console.error("Los 3 guionistas fallaron, nada para validar.");
    process.exit(1);
  }

  console.log(`\n${candidatos.length} borrador(es) recibido(s). Aplicando checklist automático...`);
  const conProblemas = candidatos.map((c) => ({ candidato: c, problemas: chequeoAutomatico(c) }));
  for (const { candidato, problemas } of conProblemas) {
    if (problemas.length) {
      console.log(`   ⚠ ${candidato.guionista}: ${problemas.join("; ")}`);
    } else {
      console.log(`   ✓ ${candidato.guionista}: sin problemas automáticos`);
    }
  }

  const aptos = conProblemas.filter((c) => c.problemas.length === 0).map((c) => c.candidato);
  if (!aptos.length) {
    console.error("\nNingún borrador pasó el checklist automático. No se genera guion.");
    process.exit(1);
  }

  console.log("\nEncargado de contenido eligiendo el mejor entre los aptos...");
  const { indice_elegido, razon } = await elegirMejor(tema, aptos);
  const elegido = aptos[indice_elegido] ?? aptos[0];
  console.log(`   ✓ Elegido: ${elegido.guionista} — ${razon}`);

  const idGuion = `auto-${tema.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40).replace(/^-|-$/g, "")}-${Date.now().toString().slice(-5)}`;
  const contenido = escribirGuionMjs(idGuion, elegido);
  const outPath = `${AQUI}../video-pipeline/guiones/${idGuion}.mjs`;
  const { writeFileSync } = await import("node:fs");
  writeFileSync(outPath, contenido);
  console.log(`\nGuion escrito en scripts/video-pipeline/guiones/${idGuion}.mjs`);
  console.log("Revisalo a mano antes de renderizar — esto reemplaza el trabajo de escribir desde cero, no el criterio final.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
