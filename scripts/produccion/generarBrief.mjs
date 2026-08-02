// Rol "encargado de contenido": trae las tendencias del día y arma un brief
// en markdown para que los guionistas (yo, en la próxima sesión) decidan qué
// vale la pena convertir en cahuín/producto/Avispanovela, en vez de arrancar
// cada guion desde cero sin ver qué se está hablando hoy.
//
// No decide solo — solo junta y ordena la materia prima. La decisión de qué
// se convierte en guion y con qué ángulo la toma un humano, leyendo el brief
// contra CHECKLIST_VALIDACION.md.
//
// Uso: node generarBrief.mjs

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { obtenerTendencias } from "./obtenerTendencias.mjs";

const hoy = new Date().toISOString().slice(0, 10);

function lineaTendencia(t, i) {
  const noticias = t.noticias
    .slice(0, 3)
    .map((n) => `  - [${n.titulo}](${n.url}) — ${n.fuente}`)
    .join("\n");
  return `### ${i + 1}. ${t.tema} (${t.trafico || "tráfico no informado"})\n${noticias || "  - (sin noticias asociadas)"}\n\n**Ángulo posible:** _(completar: ¿cahuín? ¿tie-in de producto? ¿Avispanovela? ¿descartar?)_\n**Decisión:** _(pendiente)_\n`;
}

async function main() {
  const tendencias = await obtenerTendencias("CL", 10);
  const cuerpo = tendencias.map(lineaTendencia).join("\n");
  const md = `# Brief de tendencias — ${hoy}\n\nFuente: Google Trends RSS (CL). Antes de convertir cualquiera de estos en guion, revisar contra [CHECKLIST_VALIDACION.md](./CHECKLIST_VALIDACION.md).\n\n${cuerpo}\n`;
  const outPath = fileURLToPath(new URL(`./briefs/${hoy}.md`, import.meta.url));
  writeFileSync(outPath, md);
  console.log(`Brief guardado en ${outPath}`);
}

main();
