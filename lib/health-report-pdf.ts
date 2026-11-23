import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import type { Report } from "@/lib/health-report";

/**
 * The doctor's report as a PDF, made on the server — for attaching to an
 * email, where the phone's own "save as PDF" cannot reach.
 *
 * The same content and order as the printed report (ReportDocument), in
 * plain black and white with a little warm colour: the details a doctor
 * needs first, the summary, the daily tables with anything out of range
 * marked by a symbol as well as colour, medicines, tests, notes, and the
 * same note about what this record is and is not.
 *
 * Built with the PDF standard fonts, which only carry Western European
 * characters: anything else (a Yorùbá tone mark, an arrow) is folded to its
 * nearest plain letter rather than dropped or allowed to break the file.
 */

const A4: [number, number] = [595.28, 841.89];
const M = 40;
const INK = rgb(0.07, 0.07, 0.07);
const MUTED = rgb(0.38, 0.38, 0.38);
const RULE = rgb(0.72, 0.72, 0.72);
const SHADE = rgb(0.95, 0.95, 0.95);
const OUT = rgb(0.7, 0.14, 0.09);
const ACCENT = rgb(0.6, 0.29, 0.19);

const fmtDay = (ymd: string) => new Date(`${ymd}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export async function renderReportPdf(r: Report, opts: { siteHost: string }): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`Home health record — ${r.header.name}`);
  doc.setCreator("Oyun");
  doc.setProducer("Oyun");
  const sans = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const serif = await doc.embedFont(StandardFonts.TimesRomanBold);

  const charset = new Set(sans.getCharacterSet());
  const safe = (s: string | null | undefined) => {
    const pre = String(s ?? "")
      .replace(/[−–]/g, "-")
      .replace(/‼/g, "!!")
      .replace(/▲/g, "^")
      .replace(/▼/g, "v")
      .replace(/≥/g, ">=")
      .replace(/≤/g, "<=")
      .replace(/→/g, "->")
      .replace(/\s+/g, " ")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
    let out = "";
    for (const ch of pre) out += charset.has(ch.codePointAt(0)!) ? ch : "?";
    return out;
  };

  let page: PDFPage = doc.addPage(A4);
  let y = A4[1] - M;
  const W = A4[0] - 2 * M;

  const newPage = () => {
    page = doc.addPage(A4);
    y = A4[1] - M;
  };
  const need = (h: number) => {
    if (y - h < M + 30) newPage();
  };

  const wrap = (text: string, font: PDFFont, size: number, width: number): string[] => {
    const words = safe(text).split(" ");
    const lines: string[] = [];
    let line = "";
    for (const w of words) {
      const t = line ? `${line} ${w}` : w;
      if (font.widthOfTextAtSize(t, size) > width && line) {
        lines.push(line);
        line = w;
      } else line = t;
    }
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  };

  const text = (s: string, x: number, size: number, font: PDFFont = sans, color = INK) => {
    page.drawText(safe(s), { x, y, size, font, color });
  };

  const para = (s: string, size = 9.5, color = INK, font: PDFFont = sans, gap = 2) => {
    for (const l of wrap(s, font, size, W)) {
      need(size + gap);
      page.drawText(l, { x: M, y: y - size, size, font, color });
      y -= size + gap;
    }
  };

  const section = (title: string) => {
    need(40);
    y -= 14;
    page.drawText(safe(title), { x: M, y: y - 12, size: 12, font: bold, color: INK });
    y -= 16;
    page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 0.6, color: RULE });
    y -= 6;
  };

  type Cell = { t: string; out?: boolean };
  const table = (heads: string[], widths: number[], rows: Cell[][]) => {
    const total = widths.reduce((a, b) => a + b, 0);
    const ws = widths.map((w) => (w / total) * W);
    const size = 8.5, pad = 3.5, lh = size + 2;
    const drawHead = () => {
      const h = lh + pad * 2;
      need(h + lh + pad * 2);
      page.drawRectangle({ x: M, y: y - h, width: W, height: h, color: SHADE });
      let x = M;
      heads.forEach((hd, i) => {
        page.drawText(safe(hd), { x: x + pad, y: y - pad - size, size, font: bold, color: INK });
        x += ws[i];
      });
      y -= h;
    };
    drawHead();
    for (const row of rows) {
      const lines = row.map((c, i) => wrap(c.t || "-", sans, size, ws[i] - pad * 2));
      const h = Math.max(...lines.map((l) => l.length)) * lh + pad * 2;
      if (y - h < M + 30) {
        newPage();
        drawHead();
      }
      let x = M;
      row.forEach((c, i) => {
        lines[i].forEach((l, k) => page.drawText(l, { x: x + pad, y: y - pad - size - k * lh, size, font: c.out ? bold : sans, color: c.out ? OUT : INK }));
        x += ws[i];
      });
      y -= h;
      page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 0.4, color: RULE });
    }
    y -= 4;
  };

  const h = r.header;

  /* ── Header ── */
  // The Oyun mark: the outline and the seed, in fixed print colours.
  page.drawEllipse({ x: M + 9, y: y - 9, xScale: 9, yScale: 8.4, borderColor: INK, borderWidth: 1.1, opacity: 0 });
  page.drawEllipse({ x: M + 9.5, y: y - 10, xScale: 3.4, yScale: 4.4, color: ACCENT });
  page.drawText("Oyun", { x: M + 24, y: y - 13, size: 14, font: bold, color: INK });
  page.drawText(safe(opts.siteHost), { x: M + W - sans.widthOfTextAtSize(safe(opts.siteHost), 8), y: y - 12, size: 8, font: sans, color: MUTED });
  y -= 30;
  text("HOME HEALTH RECORD - FOR THE DOCTOR", M, 8, sans, MUTED);
  y -= 24;
  page.drawText(safe(h.name), { x: M, y, size: 22, font: serif, color: INK });
  y -= 10;

  const facts: [string, string][] = [];
  if (h.dob) facts.push(["Date of birth", fmtDay(h.dob)]);
  facts.push(["Due date", fmtDay(h.due)]);
  if (h.gaFrom && h.gaTo) facts.push(["Gestation", h.gaFrom === h.gaTo ? `${h.gaFrom} weeks` : `${h.gaFrom} to ${h.gaTo} weeks`]);
  facts.push(["Period", `${fmtDay(h.period.from)} - ${fmtDay(h.period.to)}`]);
  if (h.clinic) facts.push(["Clinic", h.clinic]);
  if (h.bloodGroup) facts.push(["Blood group", h.bloodGroup]);
  if (h.allergies) facts.push(["Allergies", h.allergies]);
  facts.push(["Generated", new Date(h.generated).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: h.tz })]);
  const colW = W / 3;
  for (let i = 0; i < facts.length; i += 3) {
    need(28);
    y -= 12;
    facts.slice(i, i + 3).forEach(([k, v], j) => {
      page.drawText(safe(k).toUpperCase(), { x: M + j * colW, y, size: 6.5, font: sans, color: MUTED });
      const vl = wrap(v, sans, 9.5, colW - 10)[0];
      page.drawText(vl, { x: M + j * colW, y: y - 11, size: 9.5, font: sans, color: INK });
    });
    y -= 16;
  }
  y -= 4;
  para(`Times in ${h.tz.replace(/_/g, " ")}. Values marked * and in bold are outside the target; !! marks a reading that needed urgent attention.`, 8, MUTED);
  y -= 2;
  page.drawLine({ start: { x: M, y }, end: { x: M + W, y }, thickness: 1.2, color: INK });
  y -= 4;

  if (r.empty) {
    section("Nothing recorded");
    para("Nothing was recorded in this period.");
  }

  /* ── Summary ── */
  if (r.stats.length) {
    section("Summary");
    table(
      ["Reading", "Count", "Average", "Lowest", "Highest", "Out of range", "Target"],
      [3, 1.1, 1.4, 1.4, 1.4, 1.4, 2.4],
      r.stats.map((s) => [{ t: s.label }, { t: String(s.count) }, { t: s.avg ?? "-" }, { t: s.min ?? "-" }, { t: s.max ?? "-" }, { t: String(s.out), out: s.out > 0 }, { t: s.target }]),
    );
  }

  const cellText = (cs: { text: string; level: string }[]): Cell => {
    if (!cs.length) return { t: "-" };
    const out = cs.some((c) => c.level !== "ok" && c.level !== "none");
    return { t: cs.map((c) => `${c.level === "urgent" ? "!! " : c.level !== "ok" && c.level !== "none" ? "*" : ""}${c.text}`).join(", "), out };
  };

  if (r.glucoseGrid.length) {
    section(`Blood glucose (${h.units.glucose === "MMOL" ? "mmol/L" : "mg/dL"})`);
    table(
      ["Date", "Weeks", "Fasting", "After breakfast", "After lunch", "After dinner", "Other"],
      [1.5, 0.9, 1.4, 1.5, 1.4, 1.4, 1.3],
      r.glucoseGrid.map((g) => [{ t: fmtDay(g.day) }, { t: g.ga ? `${g.ga.week}+${g.ga.day}` : "-" }, cellText(g.fasting), cellText(g.breakfast), cellText(g.lunch), cellText(g.dinner), cellText(g.other)]),
    );
  }

  if (r.bpGrid.length) {
    section("Blood pressure (mmHg, pulse in brackets)");
    table(
      ["Date", "Weeks", "Morning", "Later in the day"],
      [1.5, 0.9, 2.5, 2.5],
      r.bpGrid.map((b) => [{ t: fmtDay(b.day) }, { t: b.ga ? `${b.ga.week}+${b.ga.day}` : "-" }, cellText(b.morning), cellText(b.evening)]),
    );
  }

  if (r.medicines.length) {
    section("Medicines");
    table(
      ["Medicine", "Dose", "When", "In this period"],
      [2, 2, 2, 2.4],
      r.medicines.map((m) => {
        const t = m.tally;
        const tally = m.asNeeded
          ? `${m.log.filter((l) => l.status.startsWith("taken")).length} taken as needed`
          : t.due === 0
            ? "None due yet"
            : `${t.taken} of ${t.due} taken${t.late ? ` - ${t.late} late` : ""}${t.skipped ? ` - ${t.skipped} skipped` : ""}${t.missing ? ` - ${t.missing} not recorded` : ""}`;
        return [{ t: `${m.name}${m.stopped ? " (stopped)" : ""}` }, { t: m.dose || "-" }, { t: m.schedule || "-" }, { t: tally, out: !m.asNeeded && (t.missing > 0 || t.skipped > 0) }];
      }),
    );
  }

  if (r.testsDone.length) {
    section("Tests done in this period");
    table(["Test", "Date", "Result"], [3, 1.4, 3], r.testsDone.map((tst) => [{ t: tst.title }, { t: fmtDay(tst.doneOn) }, { t: tst.result ?? "-" }]));
  }

  if (r.notes.length) {
    section("Symptoms and notes");
    const when = (w: string) => {
      const [d, t] = w.split(" ");
      return /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${new Date(`${d}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" })}${t ? `, ${t}` : ""}` : w;
    };
    table(["When", "What", "Note"], [1.6, 2.6, 3.2], r.notes.map((n) => [{ t: when(n.when) }, { t: `${n.urgent ? "!! " : ""}${n.what}`, out: n.urgent }, { t: n.note ?? "-" }]));
  }

  /* ── About this record ── */
  section("About this record");
  para("Every reading, dose, result and note in this report was entered by the patient - or, where she shares her log, her partner - in the Oyun app, as they recorded it at home. Oyun does not measure, check or verify any value, and cannot confirm the devices used or how readings were taken.", 8.5, MUTED);
  y -= 3;
  para("This is a home record to support a conversation with a clinician. It is not a diagnosis, a clinical record or medical advice. Targets shown are those the household entered from their doctor's advice, or common defaults where none were entered. Please confirm anything important with the patient and your own tests.", 8.5, MUTED);

  // Page numbers and the mark on every page.
  const pages = doc.getPages();
  pages.forEach((p, i) => {
    const foot = `Made with Oyun - ${safe(opts.siteHost)}`;
    p.drawText(foot, { x: M, y: 22, size: 7, font: sans, color: MUTED });
    const n = `Page ${i + 1} of ${pages.length}`;
    p.drawText(n, { x: A4[0] - M - sans.widthOfTextAtSize(n, 7), y: 22, size: 7, font: sans, color: MUTED });
  });

  return doc.save();
}
