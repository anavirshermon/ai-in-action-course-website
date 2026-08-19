import Link from "next/link";
import { getSyllabus, forTrack, DEFAULT_TRACK } from "@/lib/content/syllabus";
import { getTrack } from "@/lib/track";
import { getReadingLinks } from "@/lib/content/reading-links";
import { getTemporalStatus } from "@/lib/schedule-status";
import { splitSessionCover, matchAssignment } from "@/lib/content/session-detail";
import { resolveHandbookMentions, isHandbookMention } from "@/lib/content/handbook-links";
import { renderInlineMarkdown, stripMarkdownBold } from "@/lib/content/inline-markdown";
import { SessionAccordionRow, type ReadingView } from "@/components/SessionAccordionRow";

/** Four steps of the neutral ramp, light to dark, matching the home timeline. */
const MODULE_BORDERS: Record<number, string> = {
  1: "border-l-line",
  2: "border-l-line-strong",
  3: "border-l-ink-faint",
  4: "border-l-ink",
};

export default async function SessionsIndexPage() {
  const syllabus = getSyllabus();
  const readingLinks = getReadingLinks();
  const track = await getTrack();
  const sessions = forTrack(syllabus.sessions, track);
  const numbered = sessions.filter((s) => s.number !== null).length;
  const noClass = sessions.length - numbered;
  const now = new Date();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-ink">Sessions</h1>
      <p className="mt-2 text-ink-soft">
        All {numbered} sessions plus the {noClass} no-class dates, in order, for the{" "}
        {(track ?? DEFAULT_TRACK) === "grad" ? "graduate" : "undergraduate"} section. Click a row to
        expand it.
      </p>

      {!track && (
        <Link
          href="/?pick=1"
          className="mt-4 block rounded-[var(--radius-site)] border border-line bg-surface px-4 py-2 text-sm text-ink-soft underline transition-colors hover:border-line-strong"
        >
          Showing the graduate schedule. Pick your track to see your own dates →
        </Link>
      )}

      <ol className="mt-8 divide-y divide-line">
        {sessions.map((s) => {
          const temporal = getTemporalStatus(s.dateObj, now);
          const border = MODULE_BORDERS[s.moduleNumber] ?? "border-l-line";
          const dim = temporal === "past";

          if (s.number === null) {
            return (
              <li key={`${s.moduleNumber}-${s.date}`}>
                <div className={`flex items-center gap-4 border-l-4 px-4 py-4 ${border} ${dim ? "opacity-50" : ""}`}>
                  <span className="w-14 shrink-0 text-sm text-ink-soft">{s.date}</span>
                  <span className="w-16 shrink-0 font-heading text-lg text-ink">—</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-base text-ink">{renderInlineMarkdown(s.topic)}</p>
                    {s.due && (
                      <p className="mt-1 inline-block rounded-full bg-ink px-2.5 py-0.5 text-xs font-medium text-bg">
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
