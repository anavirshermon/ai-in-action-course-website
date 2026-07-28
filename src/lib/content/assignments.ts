import { readContentFile, splitSections, slugify } from "./markdown-utils";

const FILE = "04-Assignment-Guide-for-Students.md";

export type Assignment = {
  title: string;
  slug: string;
  whatThisIs: string;
  whyYouAreDoingIt: string;
  whatToSubmitAndWhen: string;
  whatAStrongVersionLooksLike: string;
};

export type AssignmentGuide = {
  intro: Record<string, string>;
  assignments: Assignment[];
  rulesAboutAI: string;
};

let cached: AssignmentGuide | null = null;

export function getAssignmentGuide(): AssignmentGuide {
  if (cached) return cached;

  const raw = readContentFile(FILE);
  const top = splitSections(raw, 1);

  const introSection = top[0];
  const assignmentsSection = top.find((s) => s.title === "The assignments");

  const introChunks = splitSections(introSection?.body ?? "", 2);
  const intro: Record<string, string> = {};
  for (const chunk of introChunks) {
    intro[chunk.title] = chunk.body;
  }

  const assignmentBody = assignmentsSection?.body ?? "";
  const secondLevel = splitSections(assignmentBody, 2);

  const rulesAboutAI =
    secondLevel.find((s) => s.title === "The rules about AI")?.body ?? "";

  const assignments: Assignment[] = secondLevel
    .filter((s) => s.title !== "The rules about AI")
    .map((s) => {
      const subs = splitSections(s.body, 3);
      const find = (title: string) => subs.find((sub) => sub.title === title)?.body ?? "";
      return {
        title: s.title,
        slug: slugify(s.title),
        whatThisIs: find("What this is"),
        whyYouAreDoingIt: find("Why you are doing it"),
        whatToSubmitAndWhen: find("What to submit and when"),
        whatAStrongVersionLooksLike: find("What a strong version looks like"),
      };
    });

  cached = { intro, assignments, rulesAboutAI };
  return cached;
}
