import { readContentFile } from "./markdown-utils";

export type ExerciseDownload = {
  label: string;
  // The name the file is saved under on the student's machine.
  filename: string;
  href: string;
};

export type Exercise = {
  number: number;
  slug: string;
  title: string;
  session: string;
  sessionNumber: number;
  intro: string;
  body: string;
  downloads: ExerciseDownload[];
};

// Each exercise's handout and prompt are synced into content/exercises/<slug>/
// and its downloadable files into public/exercises/<slug>/ by sync-content.sh.
const EXERCISES = [
  {
    number: 1,
    slug: "pricing-simulator",
    title: "Pricing Simulator",
    session: "Session 6 lab",
    sessionNumber: 6,
    downloads: [
      { label: "PRD", filename: "prd.md", source: "prd.md" },
      // Stored under another name so it is never picked up as this repo's own CLAUDE.md.
      { label: "Project rules", filename: "CLAUDE.md", source: "student-CLAUDE.md" },
      { label: "Build prompt", filename: "prompt.md", source: "prompt.md" },
    ],
  },
];

const PROMPT_MARKER = "<!-- prompt -->";

export function getExercises(): Exercise[] {
  return EXERCISES.map((e) => {
    const handout = readContentFile(`exercises/${e.slug}/handout.md`);
    const prompt = readContentFile(`exercises/${e.slug}/prompt.md`).trim();

    // The intro is everything before the first heading; the downloads sit between it and the body.
    const splitAt = handout.search(/^## /m);
    const intro = splitAt === -1 ? handout : handout.slice(0, splitAt);
    const body = (splitAt === -1 ? "" : handout.slice(splitAt)).replace(
      PROMPT_MARKER,
      "```prompt\n" + prompt + "\n```"
    );

    return {
      number: e.number,
      slug: e.slug,
      title: e.title,
      session: e.session,
      sessionNumber: e.sessionNumber,
      intro: intro.trim(),
      body: body.trim(),
      downloads: e.downloads.map((d) => ({
        label: d.label,
        filename: d.filename,
        href: `/exercises/${e.slug}/${d.source}`,
      })),
    };
  });
}
