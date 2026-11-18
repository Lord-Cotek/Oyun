/**
 * CSV the safe way. Every cell is quoted when it needs to be, and any text
 * that a spreadsheet would run as a formula (=, +, -, @, tab, return at the
 * start) is defused with a leading apostrophe — a note typed into the app
 * must never become a command in somebody's spreadsheet. Plain numbers,
 * negatives included, are left alone.
 */
export function csvCell(v: string | number | null | undefined): string {
  if (v === null || v === undefined) return "";
  let s = typeof v === "number" ? (Number.isFinite(v) ? String(v) : "") : String(v);
  if (/^[=+\-@\t\r]/.test(s) && !/^[+-]?\d+(\.\d+)?$/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCsv(rows: (string | number | null | undefined)[][]): string {
  return rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
}
