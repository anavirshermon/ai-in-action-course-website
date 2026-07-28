import { getSyllabus } from "@/lib/content/syllabus";
import { getReadingLinks } from "@/lib/content/reading-links";
import { getTemporalStatus } from "@/lib/schedule-status";
import { splitSessionCover, matchAssignment } from "@/lib/content/session-detail";
import { resolveHandbookMentions, isHandbookMention } from "@/lib/content/handbook-links";
import { renderInlineMarkdown, stripMarkdownBold } from "@/lib/content/inline-markdown";
import { SessionAccordionRow, type ReadingView } from "@/components/SessionAccordionRow";

export const revalidate = 3600;

const MODULE_BORDERS: Record<number, string> = {
  1: "border-l-green-500",
  2: "border-l-orange-500",
  3: "border-l-green-700",
  4: "border-l-orange-700",
};

export default function SessionsIndexPage() {
  const syllabus = getSyllabus();
  const readingLinks = getReadingLinks();
  const now = new Date();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-green-900">Sessions</h1>
      <p className="mt-2 text-ink-soft">
        All 14 sessions plus the two no-class dates, in order. Click a row to expand it.
      </p>

      <ol className="mt-8 divide-y divide-line">
        {syllabus.sessions.map((s) => {
          const temporal = getTemporalStatus(s.dateObj, now);
          const border = MODULE_BORDERS[s.moduleNumber] ?? "border-l-line";
          const dim = temporal === "past";

          if (s.number === null) {
            return (
              <li key={`${s.moduleNumber}-${s.date}`}>
                <div className={`flex items-center gap-4 border-l-4 px-4 py-4 ${border} ${dim ? "opacity-50" : ""}`}>
                  <span className="w-14 shrink-0 text-sm text-ink-soft">{s.date}</span>
                  <span className="w-16 shrink-0 font-heading text-lg text-green-900">—</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-base text-ink">{renderInlineMarkdown(s.topic)}</p>
                    {s.due && (
                      <p className="mt-0.5 text-sm font-medium text-orange-700">
                        Due: {stripMarkdownBold(s.due)}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          }

          const { concept, buildTechnique, lab } = splitSessionCover(s.whatWeCover);
          const readings = readingLinks.get(s.number);
          const readingsView: ReadingView[] = (readings?.links ?? []).map((link) => {
            if (isHandbookMention(link.label)) {
              return {
                kind: "handbook",
                parts: resolveHandbookMentions(link.label).map((p) => ({
                  number: p.number,
                  title: p.title,
                  slug: p.slug,
                })),
              };
            }
            if (link.url) return { kind: "external", label: link.label, url: link.url };
            return { kind: "text", label: link.label };
          });
          const assignmentSlug = s.due ? (matchAssignment(s.due)?.slug ?? null) : null;

          return (
            <li key={`${s.moduleNumber}-${s.date}`}>
              <SessionAccordionRow
                number={s.number}
                date={s.date}
                topic={s.topic}
                due={s.due}
                border={border}
                dim={dim}
                isCurrent={temporal === "current"}
                concept={concept}
                buildTechnique={buildTechnique}
                lab={lab}
                readingsNote={readings?.note ?? null}
                readings={readingsView}
                assignmentSlug={assignmentSlug}
              />
            </li>
          );
        })}
      </ol>
    </main>
  );
}
