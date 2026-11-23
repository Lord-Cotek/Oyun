/**
 * The name to greet somebody by: their first name, skipping a title.
 *
 * "Dr Kemi Ade" is how a doctor names her clinician account, and the same
 * account can hold her own journey — where "Hello, Dr." is what taking the
 * first word produced. A title is not a name; the word after it is.
 */
const TITLES = new Set(["dr", "doctor", "prof", "professor", "mr", "mrs", "ms", "miss", "mx", "sr", "sister", "nurse", "midwife", "rev", "pastor"]);

export function firstName(full: string | null | undefined): string | null {
  const words = String(full ?? "").trim().split(/\s+/).filter(Boolean);
  if (!words.length) return null;
  const rest = words.filter((w, i) => !(i < words.length - 1 && TITLES.has(w.replace(/\.$/, "").toLowerCase())));
  return rest[0] ?? words[0];
}
