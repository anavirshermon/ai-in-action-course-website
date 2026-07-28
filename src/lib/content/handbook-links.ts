import { getHandbook, type HandbookPart } from "./handbook";

/** Resolves reading-link bullets like "Handbook Part 11" or "Handbook Parts 1–3"
 * into the actual Handbook parts they refer to, for linking. Non-Handbook
 * bullets (external readings) are left alone by the caller. */
export function resolveHandbookMentions(label: string): HandbookPart[] {
  const m = label.match(/Handbook Parts?\s+(\d+)(?:[–-](\d+))?/i);
  if (!m) return [];

  const start = Number(m[1]);
  const end = m[2] ? Number(m[2]) : start;
  const byNumber = new Map(getHandbook().partsFlat.map((p) => [p.number, p]));

  const parts: HandbookPart[] = [];
  for (let n = start; n <= end; n++) {
    const part = byNumber.get(n);
    if (part) parts.push(part);
  }
  return parts;
}

export function isHandbookMention(label: string): boolean {
  return /Handbook Parts?\s+\d/i.test(label);
}
