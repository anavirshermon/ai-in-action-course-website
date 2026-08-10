import { Fragment } from "react";

/**
 * Renders short inline markdown without pulling in a full markdown parser.
 * Handles **bold**, used in syllabus table cells, and *italic*, used for
 * work titles in the reading list ("Torres, *Customer Interviews* (2022)").
 */
export function renderInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={i}>{part.slice(1, -1)}</em>;
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
