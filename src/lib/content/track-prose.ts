import type { Track } from "../track";

/**
 * Prose in the content files marks a paragraph or list item as belonging to one
 * section by opening it with a bold label:
 *
 *   **Graduate.** Due 9/16, before Session 4.
 *   **Undergraduate.** Due 9/15.
 *
 * A reader who has picked a track sees only their own blocks, with the now
 * redundant label stripped. A reader who has not picked one sees both, labels
 * intact, so the markdown still reads correctly as a standalone document.
 */
const LABELS: Record<Track, string> = {
  grad: "Graduate",
  undergrad: "Undergraduate",
};

/** Leading label on a block or list item, e.g. "- **Graduate.** ..." */
const LABEL_RE = /^(\s*(?:[-*+]|\d+\.)\s+)?\*\*(Graduate|Undergraduate)\.\*\*\s*/;

function labelOf(line: string): Track | null {
  const m = line.match(LABEL_RE);
  if (!m) return null;
  return m[2] === "Graduate" ? "grad" : "undergrad";
}

function strip(line: string): string {
  return line.replace(LABEL_RE, (_, bullet: string | undefined) => bullet ?? "");
}

/**
 * Drops the other section's labelled blocks and list items. Passing null (no
 * track picked) returns the source unchanged.
 */
export function filterTrackProse(markdown: string, track: Track | null): string {
  if (!track) return markdown;

  const kept: string[] = [];

  for (const block of markdown.split(/\n{2,}/)) {
    const lines = block.split("\n");

    // A whole paragraph labelled for the other section goes away entirely.
    const blockLabel = labelOf(lines[0]);
    if (blockLabel && !/^\s*(?:[-*+]|\d+\.)\s/.test(lines[0])) {
      if (blockLabel !== track) continue;
      kept.push([strip(lines[0]), ...lines.slice(1)].join("\n"));
      continue;
    }

    // Inside a list, each item is labelled on its own.
    const keptLines = lines.filter((l) => {
      const label = labelOf(l);
      return label === null || label === track;
    });
    if (keptLines.length === 0) continue;
    kept.push(keptLines.map(strip).join("\n"));
  }

  return kept.join("\n\n");
}

export function trackLabel(track: Track): string {
  return LABELS[track];
}
