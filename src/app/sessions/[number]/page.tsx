import Link from "next/link";
import { notFound } from "next/navigation";
import { getSyllabus } from "@/lib/content/syllabus";
import { getReadingLinks } from "@/lib/content/reading-links";
import { sessionArcIndex } from "@/lib/schedule-status";
import { splitSessionCover, matchAssignment } from "@/lib/content/session-detail";
import { resolveHandbookMentions, isHandbookMention } from "@/lib/content/handbook-links";
import { renderInlineMarkdown, stripMarkdownBold } from "@/lib/content/inline-markdown";

export const revalidate = 3600;

export function generateStaticParams() {
  const { sessions } = getSyllabus();
  return sessions
    .filter((s) => s.number !== null)
    .map((s) => ({ number: String(s.number) }));
}

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const sessionNumber = Number(number);

  const syllabus = getSyllabus();
  const session = syllabus.sessions.find((s) => s.number === sessionNumber);
  if (!session) notFound();

  const realSessions = syllabus.sessions.filter((s) => s.number !== null);
  const idx = realSessions.findIndex((s) => s.number === sessionNumber);
  const prev = idx > 0 ? realSessions[idx - 1] : null;
  const next = idx < realSessions.length - 1 ? realSessions[idx + 1] : null;

  const arcIdx = sessionArcIndex(syllabus.buildArcs, session.number);
  const arc = arcIdx !== null ? syllabus.buildArcs[arcIdx] : null;

  const { concept, buildTechnique, lab } = splitSessionCover(session.whatWeCover);
  const readings = getReadingLinks().get(sessionNumber);
  const assignment = session.due ? matchAssignment(session.due) : null;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <Link href="/sessions" className="text-sm text-ink-soft hover:text-ink">
        ← All sessions
      </Link>

      <p className="mt-4 text-sm uppercase tracking-[0.15em] text-orange-700">
        {session.moduleName} · {session.date}
        {arc && ` · ${arc.label.replace(/\.$/, "")}`}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold text-green-900">
        Session {session.number} — {renderInlineMarkdown(session.topic)}
      </h1>

      {session.due && (
        <p className="mt-4 rounded-[var(--radius-site)] border border-orange-500 bg-orange-200/30 px-4 py-2 text-sm font-medium text-orange-700">
          Due: {assignment ? (
            <Link href={`/resources/assignments#${assignment.slug}`} className="underline">
              {stripMarkdownBold(session.due)}
            </Link>
          ) : (
            stripMarkdownBold(session.due)
          )}
        </p>
      )}

      <section className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-ink">What we cover</h2>
        <p className="mt-2 text-ink-soft">{renderInlineMarkdown(concept)}</p>
      </section>

      {buildTechnique && (
        <section className="mt-6">
          <h2 className="font-heading text-lg font-semibold text-ink">Build technique</h2>
          <p className="mt-2 text-ink-soft">{renderInlineMarkdown(buildTechnique)}</p>
        </section>
      )}

      {lab && (
        <section className="mt-6">
          <h2 className="font-heading text-lg font-semibold text-ink">In class</h2>
          <p className="mt-2 text-ink-soft">{renderInlineMarkdown(lab)}</p>
        </section>
      )}

      {readings && readings.links.length > 0 && (
        <section className="mt-8 border-t border-line pt-6">
          <h2 className="font-heading text-lg font-semibold text-ink">Before class</h2>
          {readings.note && <p className="mt-1 text-sm italic text-ink-soft">{readings.note}</p>}
          <ul className="mt-2 space-y-1 text-sm text-ink-soft">
            {readings.links.map((link, i) => {
              if (isHandbookMention(link.label)) {
                const parts = resolveHandbookMentions(link.label);
                return (
                  <li key={i}>
                    {parts.map((p, pi) => (
                      <span key={p.slug}>
                        {pi > 0 && ", "}
                        <Link href={`/resources/handbook#${p.slug}`} className="underline hover:text-ink">
                          Part {p.number}: {p.title}
                        </Link>
                      </span>
                    ))}
                  </li>
                );
              }
              return (
                <li key={i}>
                  {link.url ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-ink"
                    >
                      {link.label}
                    </a>
                  ) : (
                    link.label
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <nav className="mt-12 flex justify-between border-t border-line pt-6 text-sm">
        {prev ? (
          <Link href={`/sessions/${prev.number}`} className="text-ink-soft hover:text-ink">
            ← Session {prev.number}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/sessions/${next.number}`} className="text-ink-soft hover:text-ink">
            Session {next.number} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
