import Link from "next/link";
import { ChevronIcon } from "@/components/ChevronIcon";
import { getTrack } from "@/lib/track";
import { syllabusPdf } from "@/lib/syllabus-pdf";

const DESTINATIONS = [
  {
    href: "/resources/handbook",
    label: "Handbook",
    detail: "All 18 parts of Building with AI, browsable and searchable.",
    border: "border-l-line",
  },
  {
    href: "/resources/assignments",
    label: "Assignments",
    detail: "What each assessment is, why it exists, and what a strong version looks like.",
    border: "border-l-line-strong",
  },
  {
    href: "/resources/prompts",
    label: "Prompt library",
    detail: "Every copy-paste prompt from the Handbook, in one place.",
    border: "border-l-ink-faint",
  },
  {
    href: "/resources/reference",
    label: "Reference",
    detail: "Syllabus, full reading list, setup checklist, glossary.",
    border: "border-l-ink",
  },
];

export default async function ResourcesPage() {
  const track = await getTrack();
  const pdf = syllabusPdf(track);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-ink">Resources</h1>

      <a
        href={pdf.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 flex items-center justify-between gap-4 rounded-[var(--radius-site)] border border-ink bg-ink px-6 py-5 text-bg transition-colors hover:bg-ink-soft"
      >
        <div>
          <p className="font-heading text-lg font-semibold">
            Syllabus, {pdf.label} section
          </p>
          <p className="mt-0.5 text-sm text-bg/70">
            The official PDF, and the authoritative version of everything here.
          </p>
        </div>
        <span className="shrink-0 text-sm underline underline-offset-4">Open PDF →</span>
      </a>

      <ol className="mt-8 divide-y divide-line">
        {DESTINATIONS.map((d) => (
          <li key={d.href}>
            <Link
              href={d.href}
              className={`group flex items-center gap-4 border-l-4 ${d.border} px-4 py-5 transition-colors hover:bg-surface`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-heading text-lg text-ink">{d.label}</p>
                <p className="mt-1 text-sm text-ink-soft">{d.detail}</p>
              </div>
              <ChevronIcon className="shrink-0 text-ink-soft" />
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
