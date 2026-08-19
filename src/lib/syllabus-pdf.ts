import type { Track } from "./track";
import { DEFAULT_TRACK } from "./content/syllabus";

/** The official syllabus PDFs, copied into public/ by scripts/sync-content.sh.
 * Everything else on this site is derived from these two documents, so they are
 * linked wherever a student might be looking for the authoritative version. */
const PDFS: Record<Track, { href: string; label: string }> = {
  grad: {
    href: "/syllabus/ENTP6314-Fall2026-Syllabus-Graduate.pdf",
    label: "graduate",
  },
  undergrad: {
    href: "/syllabus/ENTP4332-Fall2026-Syllabus-Undergraduate.pdf",
    label: "undergraduate",
  },
};

export function syllabusPdf(track: Track | null) {
  return PDFS[track ?? DEFAULT_TRACK];
}

export function allSyllabusPdfs() {
  return [PDFS.grad, PDFS.undergrad];
}
