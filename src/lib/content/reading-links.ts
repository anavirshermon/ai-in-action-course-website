import { readContentFile } from "./markdown-utils";

const FILE = "05-Reading-Links-for-Students.md";

export type ReadingLink = {
  label: string;
  url: string | null;
};

export type SessionReadings = {
  sessionNumber: number;
  title: string;
  date: string;
  note: string | null;
  links: ReadingLink[];
};

function parseBullet(line: string): ReadingLink {
  const text = line.replace(/^-\s*/, "").trim();
  const dashIndex = text.indexOf(" — http");
  if (dashIndex === -1) {
    return { label: text, url: null };
  }
  return {
    label: text.slice(0, dashIndex).trim(),
    url: text.slice(dashIndex + 3).trim(),
  };
}

let cached: Map<number, SessionReadings> | null = null;

export function getReadingLinks(): Map<number, SessionReadings> {
  if (cached) return cached;

  const raw = readContentFile(FILE);
  const lines = raw.split("\n");
  // The date is optional: the two sections meet on different days, so headings
  // now carry only the session number and title.
  const headingRegex = /^## Session (\d+) — (.+?)(?: \(([^)]+)\))?$/;

  const headingLines: { number: number; title: string; date: string; lineIndex: number }[] = [];
  lines.forEach((line, i) => {
    const m = line.match(headingRegex);
    if (m) {
      headingLines.push({
        number: Number(m[1]),
        title: m[2],
        date: m[3] ?? "",
        lineIndex: i,
      });
    }
  });

  const map = new Map<number, SessionReadings>();

  headingLines.forEach((h, idx) => {
    const nextIndex =
      idx + 1 < headingLines.length ? headingLines[idx + 1].lineIndex : lines.length;
    const bodyLines = lines.slice(h.lineIndex + 1, nextIndex);

    let note: string | null = null;
    const links: ReadingLink[] = [];

    for (const line of bodyLines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("-")) {
        links.push(parseBullet(trimmed));
      } else if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
        note = trimmed.slice(1, -1);
      } else if (trimmed === "No assigned readings.") {
        note = null;
      }
    }

    map.set(h.number, { sessionNumber: h.number, title: h.title, date: h.date, note, links });
  });

  cached = map;
  return cached;
}
