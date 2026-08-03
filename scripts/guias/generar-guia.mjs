// Genera en lote las guías PDF oficiales de práctica PAES M1.
// Uso: node scripts/guias/generar-guia.mjs
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { generarGuiaPDF } from "../../lib/pdfGuia.mjs";
import { NUMEROS, ALGEBRA, GEOMETRIA, PROBABILIDAD } from "./preguntas-m1.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, "output");

const FOOTER = "AvispateYa.cl — Profe Emi · Contenido de práctica en base a preguntas oficiales estilo PAES · declarado como apoyo generado con IA";

const GUIAS = [
  { folio: "AY-M1-01", numero: 1, tema: "Números", preguntas: NUMEROS },
  { folio: "AY-M1-02", numero: 2, tema: "Álgebra y funciones", preguntas: ALGEBRA },
  { folio: "AY-M1-03", numero: 3, tema: "Geometría", preguntas: GEOMETRIA },
  { folio: "AY-M1-04", numero: 4, tema: "Probabilidad y estadística", preguntas: PROBABILIDAD },
].map((g) => ({ ...g, titulo: `Guía ${g.numero} · ${g.tema}`, footer: FOOTER }));

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const logoBytes = await readFile(path.join(__dirname, "..", "branding", "logo_icono_transp.png"));
  for (const guia of GUIAS) {
    const bytes = await generarGuiaPDF(guia, logoBytes);
    const file = path.join(OUT_DIR, `guia-${String(guia.numero).padStart(2, "0")}-${guia.tema.toLowerCase().replace(/[^\w]+/g, "-")}.pdf`);
    await writeFile(file, bytes);
    console.log("Generada:", file);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
