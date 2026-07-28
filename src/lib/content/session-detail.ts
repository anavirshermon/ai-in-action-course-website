import { getAssignmentGuide, type Assignment } from "./assignments";

export type SessionSplit = {
  concept: string;
  lab: string | null;
};

/** Splits a session's "what we cover" prose at the "**Lab:**" marker, when
 * present, so the sub-page can show an "In class" callout separately. */
export function splitLab(whatWeCover: string): SessionSplit {
  const idx = whatWeCover.indexOf("**Lab:**");
  if (idx === -1) return { concept: whatWeCover, lab: null };
  return {
    concept: whatWeCover.slice(0, idx).trim(),
    lab: whatWeCover.slice(idx + "**Lab:**".length).trim(),
  };
}

/** Matches a session's "due" text against known assignment titles, for linking
 * "Due: **First App and Build Memo**" to /resources/assignments#slug. */
export function matchAssignment(dueText: string): Assignment | null {
  const clean = dueText.replace(/\*\*/g, "");
  const { assignments } = getAssignmentGuide();
  return assignments.find((a) => clean.includes(a.title)) ?? null;
}
