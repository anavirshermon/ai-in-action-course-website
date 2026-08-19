import { getAssignmentGuide, type Assignment } from "./assignments";

export type SessionSplit = {
  concept: string;
  buildTechnique: string | null;
  lab: string | null;
};

const BUILD_TECHNIQUE_MARKER = "**Build technique:**";
const LAB_MARKER = "**Lab:**";

/** Splits a session's "what we cover" prose at the "**Build technique:**" and
 * "**Lab:**" markers, when present, so the sub-page can show each as its own
 * callout instead of one run-on paragraph. Build technique always precedes
 * Lab in the source when both appear. */
export function splitSessionCover(whatWeCover: string): SessionSplit {
  const btIdx = whatWeCover.indexOf(BUILD_TECHNIQUE_MARKER);
  const labIdx = whatWeCover.indexOf(LAB_MARKER);

  if (btIdx === -1 && labIdx === -1) {
    return { concept: whatWeCover, buildTechnique: null, lab: null };
  }

  if (btIdx !== -1 && labIdx !== -1) {
    return {
      concept: whatWeCover.slice(0, btIdx).trim(),
      buildTechnique: whatWeCover.slice(btIdx + BUILD_TECHNIQUE_MARKER.length, labIdx).trim(),
      lab: whatWeCover.slice(labIdx + LAB_MARKER.length).trim(),
    };
  }

  if (labIdx !== -1) {
    return {
      concept: whatWeCover.slice(0, labIdx).trim(),
      buildTechnique: null,
      lab: whatWeCover.slice(labIdx + LAB_MARKER.length).trim(),
    };
  }

  return {
    concept: whatWeCover.slice(0, btIdx).trim(),
    buildTechnique: whatWeCover.slice(btIdx + BUILD_TECHNIQUE_MARKER.length).trim(),
    lab: null,
  };
}

/** Matches a session's "due" text against known assignment titles, for linking
 * "Due: **First App and Build Memo**" to /resources/assignments#slug.
 *
 * A due cell can name two assignments (the last session lists the venture
 * package and the build log). We link the one mentioned FIRST in the cell,
 * which is the one the cell leads with, rather than whichever happens to come
 * first in the Assignment Guide. */
export function matchAssignment(dueText: string): Assignment | null {
  const clean = dueText.replace(/\*\*/g, "");
  const { assignments } = getAssignmentGuide();

  let best: Assignment | null = null;
  let bestIndex = Infinity;
  for (const a of assignments) {
    const i = clean.indexOf(a.title);
    if (i !== -1 && i < bestIndex) {
      best = a;
      bestIndex = i;
    }
  }
  return best;
}
