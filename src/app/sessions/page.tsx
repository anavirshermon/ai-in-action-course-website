import Link from "next/link";
import { getSyllabus } from "@/lib/content/syllabus";
import { getTemporalStatus } from "@/lib/schedule-status";
import { renderInlineMarkdown } from "@/lib/content/inline-markdown";

export const revalidate = 3600;

const MODULE_BORDERS: Record<number, string> = {
  1: "border-l-green-500",
  2: "border-l-orange-500",
  3: "border-l-green-700",
  4: "border-l-orange-700",
};

export default function SessionsIndexPage() {
  const syllabus = getSyllabus();
  const now = new Date();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-green-900">Sessions</h1>
      <p className="mt-2 text-ink-soft">All 14 sessions, in order. Grayed-out rows are past.</p>

      <ol className="mt-8 divide-y divide-line">
        {syllabus.sessions.map((s) => {
          const temporal = getTemporalStatus(s.dateObj, now);
          const border = MODULE_BORDERS[s.moduleNumber] ?? "border-l-line";

          const row = (
            <div
              className={`flex items-baseline gap-4 border-l-4 py-4 pl-4 ${border} ${
                temporal === "past" ? "opacity-50" : ""
              }`}
            >
              <span className="w-14 shrink-0 text-sm text-ink-soft">{s.date}</span>
              <span className="w-16 shrink-0 font-heading text-lg text-green-900">
                {s.number !== null ? `S${s.number}` : "—"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-heading text-base text-ink">
                  {renderInlineMarkdown(s.topic)}
                  {temporal === "current" && (
                    <span className="ml-2 text-xs font-normal uppercase tracking-wide text-orange-700">
                      this week
                    </span>
                  )}
                </p>
                {s.due && (
                  <p className="mt-0.5 text-sm text-orange-700">
                    Due: {renderInlineMarkdown(s.due)}
                  </p>
                )}
              </div>
            </div>
          );

          return (
            <li key={`${s.moduleNumber}-${s.date}`}>
              {s.number !== null ? (
                <Link href={`/sessions/${s.number}`} className="block transition-colors hover:bg-paper-dim/50">
                  {row}
                </Link>
              ) : (
                row
              )}
            </li>
          );
        })}
      </ol>
    </main>
  );
}
