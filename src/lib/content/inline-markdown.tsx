import { Fragment } from "react";

/**
 * Renders short inline markdown (only **bold** is used in table cells
 * throughout the source docs) without pulling in a full markdown parser.
 */
export function renderInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

/** Strips source **bold** markers entirely. Used where a field's emphasis
 * should come from consistent CSS (e.g. every "Due" line styled the same
 * way) rather than from whichever cells the source markdown happened to
 * bold — the syllabus table bolds some due-dates and not others. */
export function stripMarkdownBold(text: string): string {
  return text.replace(/\*\*/g, "");
}
