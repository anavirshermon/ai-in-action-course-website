import { readContentFile, splitSections, slugify } from "./markdown-utils";

const FILE = "03-Student-Guide-Building-with-AI.md";

export type PromptBlock = {
  id: string;
  partNumber: number;
  partTitle: string;
  text: string;
};

export type HandbookPart = {
  number: number;
  title: string;
  slug: string;
  sectionTitle: string;
  bodyMarkdown: string;
};

export type HandbookSection = {
  title: string;
  parts: HandbookPart[];
};

export type Handbook = {
  sections: HandbookSection[];
  partsFlat: HandbookPart[];
  prompts: PromptBlock[];
};

const PART_RE = /^Part (\d+)\.\s*(.+)$/;
const PROMPT_FENCE_RE = /```prompt\n([\s\S]*?)```/g;

let cached: Handbook | null = null;

export function getHandbook(): Handbook {
  if (cached) return cached;

  const raw = readContentFile(FILE);
  const topSections = splitSections(raw, 1).filter((s) => s.title.startsWith("SECTION"));

  const sections: HandbookSection[] = [];
  const partsFlat: HandbookPart[] = [];
  const prompts: PromptBlock[] = [];

  for (const section of topSections) {
    const sectionTitle = section.title.replace(/^SECTION \d+:\s*/, "");
    const partSections = splitSections(section.body, 2).filter((s) => PART_RE.test(s.title));

    const parts: HandbookPart[] = partSections.map((p) => {
      const match = p.title.match(PART_RE)!;
      const number = Number(match[1]);
      const title = match[2];
      const part: HandbookPart = {
        number,
        title,
        slug: `part-${number}-${slugify(title)}`,
        sectionTitle,
        bodyMarkdown: p.body,
      };

      let m: RegExpExecArray | null;
      const re = new RegExp(PROMPT_FENCE_RE);
      let promptIdx = 0;
      while ((m = re.exec(p.body)) !== null) {
        promptIdx += 1;
        prompts.push({
          id: `${part.slug}-prompt-${promptIdx}`,
          partNumber: number,
          partTitle: title,
          text: m[1].trim(),
        });
      }

      return part;
    });

    sections.push({ title: sectionTitle, parts });
    partsFlat.push(...parts);
  }

  cached = { sections, partsFlat, prompts };
  return cached;
}
