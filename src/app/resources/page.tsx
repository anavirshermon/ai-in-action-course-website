import Link from "next/link";
import { ChevronIcon } from "@/components/ChevronIcon";

const DESTINATIONS = [
  {
    href: "/resources/handbook",
    label: "Handbook",
    detail: "All 18 parts of Building with AI, browsable and searchable.",
    border: "border-l-green-500",
  },
  {
    href: "/resources/assignments",
    label: "Assignments",
    detail: "What each assessment is, why it exists, and what a strong version looks like.",
    border: "border-l-orange-500",
  },
  {
    href: "/resources/prompts",
    label: "Prompt library",
    detail: "Every copy-paste prompt from the Handbook, in one place.",
    border: "border-l-green-700",
  },
  {
    href: "/resources/reference",
    label: "Reference",
    detail: "Syllabus, full reading list, setup checklist, glossary.",
    border: "border-l-orange-700",
  },
];

export default function ResourcesPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-green-900">Resources</h1>

      <ol className="mt-8 divide-y divide-line">
        {DESTINATIONS.map((d) => (
          <li key={d.href}>
            <Link
              href={d.href}
              className={`group flex items-center gap-4 border-l-4 ${d.border} px-4 py-5 transition-colors hover:bg-paper-dim/50`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-heading text-lg text-green-900">{d.label}</p>
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
