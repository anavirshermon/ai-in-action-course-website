import fs from "fs";
import path from "path";

export const CONTENT_DIR = path.join(process.cwd(), "content");

export function readContentFile(file: string): string {
  return fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
}

export type MarkdownSection = {
  level: number;
  title: string;
  body: string;
};

/**
 * Splits markdown into sections at a given heading level (e.g. 2 for "## ").
 * Each section's body runs until the next heading of the SAME level, so
 * nested subheadings (### under ##) stay inside the parent's body.
 */
export function splitSections(markdown: string, level: number): MarkdownSection[] {
  const marker = "#".repeat(level) + " ";
  const lines = markdown.split("\n");
  const headingLines: { title: string; lineIndex: number }[] = [];

  let insideFence = false;
  lines.forEach((line, i) => {
    if (line.trimStart().startsWith("```")) {
      insideFence = !insideFence;
      return;
    }
    if (!insideFence && line.startsWith(marker)) {
      headingLines.push({ title: line.slice(marker.length).trim(), lineIndex: i });
    }
  });

  if (insideFence) {
    throw new Error(
      "splitSections: unbalanced ``` fence (odd number of fence markers) — " +
        "a heading after the unclosed fence may have been silently dropped. Check the source markdown."
    );
  }

  return headingLines.map((h, idx) => {
    const nextIndex =
      idx + 1 < headingLines.length ? headingLines[idx + 1].lineIndex : lines.length;
    const body = lines
      .slice(h.lineIndex + 1, nextIndex)
      .join("\n")
      .trim();
    return { level, title: h.title, body };
  });
}

export type ParsedTable = {
  headers: string[];
  rows: string[][];
};

/** Parses the first GFM pipe table found in a markdown chunk. */
export function parseFirstTable(markdown: string): ParsedTable | null {
  const lines = markdown.split("\n").map((l) => l.trim());
  const tableLines: string[] = [];
  let started = false;
  let insideFence = false;

  for (const line of lines) {
    if (line.startsWith("```")) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;
    if (/^\|.*\|$/.test(line)) {
      started = true;
      tableLines.push(line);
    } else if (started) {
      break;
    }
  }

  if (tableLines.length < 2) return null;

  const parseRow = (line: string) =>
    line
      .slice(1, -1)
      .split("|")
      .map((cell) => cell.trim());

  const headers = parseRow(tableLines[0]);
  const rows = tableLines.slice(2).map(parseRow); // row 1 is the --- separator

  return { headers, rows };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
