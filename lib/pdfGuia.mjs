// Generador de guías PDF con identidad AvíspateYa / Profe Emi: logo, QR,
// preguntas numeradas y hoja de respuestas estilo OMR. Lo usan tanto el
// script de generación en lote (scripts/guias/generar-guia.mjs) como la API
// de guías personalizadas (api/guia-personalizada.js).
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";

const INK = rgb(0.09, 0.08, 0.13);
const DIM = rgb(0.4, 0.4, 0.45);
const BRAND = rgb(0.078, 0.722, 0.651); // #14B8A6
const LINE = rgb(0.85, 0.85, 0.85);

function sanitize(text) {
  return text
    .replace(/√/g, "raíz ")
    .replace(/[−–—]/g, "-")
    .replace(/≥/g, ">=")
    .replace(/≤/g, "<=")
    .replace(/π/g, "pi")
    .replace(/∞/g, "infinito")
    .replace(/⁻¹/g, "^-1")
    .replace(/⁻³/g, "^-3")
    .replace(/¹⁰/g, "^10")
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (d) => "0123456789"["⁰¹²³⁴⁵⁶⁷⁸⁹".indexOf(d)])
    .replace(/[ⁿᵐ]/g, (c) => (c === "ⁿ" ? "n" : "m"))
    .replace(/⁻/g, "-")
    .replace(/₂/g, "2");
}

function wrapText(text, font, size, maxWidth) {
  text = sanitize(text);
  const words = text.split(" ");
  const lines = [];
  let current = "";
  for (const word of words) {
    const test = current ? current + " " + word : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// guia: { folio, titulo (ej. "Guía 1 · Números" o "Guía personalizada · Ecuaciones cuadráticas"),
//         subtitulo (opcional), preguntas: [{ n, enun, alt: [4 strings] }] }
export async function generarGuiaPDF(guia, logoBytes) {
  const pdf = await PDFDocument.create();
  const fontRegular = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const logo = await pdf.embedPng(logoBytes);

  const qrDataUrl = await QRCode.toDataURL(
    `https://avispateya.cl/?utm_source=guia_impresa&utm_medium=print&utm_campaign=${guia.folio}`,
    { margin: 1, width: 240 }
  );
  const qrBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImg = await pdf.embedPng(qrBytes);

  const PAGE_W = 595.28; // A4
  const PAGE_H = 841.89;
  const MARGIN = 48;
  const CONTENT_W = PAGE_W - MARGIN * 2;

  let page = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H - MARGIN;

  function drawHeader() {
    const logoDims = logo.scale(34 / logo.height);
    page.drawImage(logo, { x: MARGIN, y: y - 34, width: logoDims.width, height: 34 });
    page.drawText("Avíspate", { x: MARGIN + logoDims.width + 8, y: y - 14, size: 15, font: fontBold, color: INK });
    page.drawText("Ya", { x: MARGIN + logoDims.width + 8 + fontBold.widthOfTextAtSize("Avíspate", 15), y: y - 14, size: 15, font: fontBold, color: rgb(0.85, 0.15, 0.15) });
    page.drawText("Profe Emi · Guía de práctica PAES M1", { x: MARGIN + logoDims.width + 8, y: y - 30, size: 9, font: fontRegular, color: DIM });

    const qrSize = 48;
    page.drawImage(qrImg, { x: PAGE_W - MARGIN - qrSize, y: y - qrSize, width: qrSize, height: qrSize });
    page.drawText("Escanea y entra a", { x: PAGE_W - MARGIN - qrSize - 62, y: y - 18, size: 7.5, font: fontRegular, color: DIM });
    page.drawText("AvíspateYa.cl", { x: PAGE_W - MARGIN - qrSize - 62, y: y - 28, size: 8.5, font: fontBold, color: BRAND });
    page.drawText(`Guía ${guia.folio}`, { x: PAGE_W - MARGIN - qrSize, y: y - qrSize - 12, size: 8, font: fontBold, color: DIM });

    y -= 50;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 1.2, color: BRAND });
    y -= 24;

    page.drawText(guia.titulo, { x: MARGIN, y, size: 17, font: fontBold, color: INK });
    y -= 16;
    page.drawText("Marca la alternativa correcta. Trabaja el desarrollo en tu cuaderno antes de responder.", { x: MARGIN, y, size: 9.5, font: fontRegular, color: DIM });
    y -= 22;
  }

  function newPage() {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
    drawHeader();
  }

  function drawCornerMarks(x, yPos, w, h, len = 14, thickness = 2, color = BRAND) {
    const corners = [
      [x, yPos, 1, 1],
      [x + w, yPos, -1, 1],
      [x, yPos + h, 1, -1],
      [x + w, yPos + h, -1, -1],
    ];
    for (const [cx, cy, dx, dy] of corners) {
      page.drawLine({ start: { x: cx, y: cy }, end: { x: cx + dx * len, y: cy }, thickness, color });
      page.drawLine({ start: { x: cx, y: cy }, end: { x: cx, y: cy + dy * len }, thickness, color });
    }
  }

  function drawHojaRespuestas() {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;

    const logoDims = logo.scale(28 / logo.height);
    page.drawImage(logo, { x: MARGIN, y: y - 28, width: logoDims.width, height: 28 });
    page.drawText("HOJA DE RESPUESTAS", { x: MARGIN + logoDims.width + 8, y: y - 12, size: 13, font: fontBold, color: INK });
    page.drawText(guia.titulo, { x: MARGIN + logoDims.width + 8, y: y - 25, size: 9, font: fontRegular, color: DIM });
    y -= 42;
    page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 1.2, color: BRAND });
    y -= 26;

    const n = guia.preguntas.length;
    const cols = 2;
    const rows = Math.ceil(n / cols);
    const frameX = MARGIN;
    const frameTop = y;
    const rowH = 24;
    const headerH = 36;
    const frameH = headerH + rows * rowH + 16;
    const frameW = CONTENT_W;
    const frameY = frameTop - frameH;

    page.drawRectangle({ x: frameX, y: frameY, width: frameW, height: frameH, borderColor: LINE, borderWidth: 1 });
    drawCornerMarks(frameX, frameY, frameW, frameH);

    page.drawText(`Código de guía: ${guia.folio}`, { x: frameX + 14, y: frameTop - 20, size: 12, font: fontBold, color: BRAND });
    page.drawText("Rellena el círculo de tu respuesta.", { x: frameX + 14, y: frameTop - 32, size: 8.5, font: fontRegular, color: DIM });

    const colW = frameW / cols;
    const gridTop = frameTop - headerH;
    const letters = ["A", "B", "C", "D"];

    for (let i = 0; i < n; i++) {
      const col = Math.floor(i / rows);
      const rowIdx = i % rows;
      const rowY = gridTop - rowIdx * rowH;
      const colX = frameX + 16 + col * colW;
      const qn = guia.preguntas[i].n;
      page.drawText(String(qn), { x: colX, y: rowY - 8, size: 9, font: fontBold, color: INK });
      const numW = fontBold.widthOfTextAtSize(String(qn), 9);
      letters.forEach((letter, li) => {
        const cx = colX + numW + 16 + li * 22;
        const cy = rowY - 6;
        page.drawCircle({ x: cx, y: cy, size: 5, borderColor: INK, borderWidth: 1 });
        page.drawText(letter, { x: cx - 2.5, y: cy - 3, size: 6.5, font: fontRegular, color: DIM });
      });
    }

    y = frameY - 22;
    const tipLines = wrapText(
      "Consejo: encuadra las 4 esquinas del recuadro completo al sacar la foto, que se vea el código de guía y todas tus respuestas. Sube la foto en la clase de Profe Emi para revisarla juntos — no hace falta escribir el código, ya viene en la imagen.",
      fontRegular, 9.5, CONTENT_W
    );
    for (const line of tipLines) {
      page.drawText(line, { x: MARGIN, y, size: 9.5, font: fontRegular, color: INK });
      y -= 13;
    }
    y -= 4;
    page.drawText("avispateya.cl/profe-emi.html", { x: MARGIN, y, size: 9.5, font: fontBold, color: BRAND });
  }

  drawHeader();

  const QSIZE = 10.5;
  const ALTSIZE = 10;
  const LEADING = 13;

  for (const q of guia.preguntas) {
    const enunLines = wrapText(`${q.n}. ${q.enun}`, fontBold, QSIZE, CONTENT_W);
    const altBlocks = q.alt.map((a, i) => wrapText(`${"ABCD"[i]}) ${a}`, fontRegular, ALTSIZE, CONTENT_W - 16));
    const blockHeight = enunLines.length * LEADING + altBlocks.reduce((s, l) => s + l.length * LEADING, 0) + 16;

    if (y - blockHeight < MARGIN + 30) newPage();

    for (const line of enunLines) {
      page.drawText(line, { x: MARGIN, y, size: QSIZE, font: fontBold, color: INK });
      y -= LEADING;
    }
    y -= 3;
    for (const block of altBlocks) {
      for (const line of block) {
        page.drawText(line, { x: MARGIN + 16, y, size: ALTSIZE, font: fontRegular, color: INK });
        y -= LEADING;
      }
    }
    y -= 12;
  }

  const avisoLines = wrapText("Tu hoja de respuestas está en la última página.", fontBold, 9.5, CONTENT_W);
  if (y - avisoLines.length * 13 - 8 < MARGIN + 30) newPage();
  for (const line of avisoLines) {
    page.drawText(line, { x: MARGIN, y, size: 9.5, font: fontBold, color: BRAND });
    y -= 13;
  }

  drawHojaRespuestas();

  const footer = guia.footer || "AvispateYa.cl — Profe Emi · Contenido de práctica generado con IA, declarado abiertamente";
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    p.drawText(
      `${footer} · pág. ${i + 1}/${pages.length}`,
      { x: MARGIN, y: 24, size: 7, font: fontRegular, color: DIM }
    );
  });

  return pdf.save();
}
