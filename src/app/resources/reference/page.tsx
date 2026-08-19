import { getSyllabus, forTrack } from "@/lib/content/syllabus";
import { getTrack } from "@/lib/track";
import { getReadingLinks } from "@/lib/content/reading-links";
import { getHandbook } from "@/lib/content/handbook";
import { Markdown } from "@/components/Markdown";
import { renderInlineMarkdown } from "@/lib/content/inline-markdown";

function EvaluationTable({ title, rows }: { title: string; rows: { assessment: string; ownership: string; weight: string; due: string }[] }) {
  return (
    <div className="mt-4">
      <p className="font-heading text-base text-ink">{title}</p>
      <table className="mt-2 w-full text-sm">
        <thead>
          <tr className="text-left text-ink-soft">
            <th className="border-b border-line pb-1 pr-2">Assessment</th>
            <th className="border-b border-line pb-1 pr-2">Weight</th>
            <th className="border-b border-line pb-1">Due</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.assessment}>
              <td className="border-b border-line py-1.5 pr-2">{r.assessment}</td>
              <td className="border-b border-line py-1.5 pr-2 text-orange-700">{r.weight}</td>
              <td className="border-b border-line py-1.5 text-ink-soft">{r.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ReferencePage() {
  const syllabus = getSyllabus();
  const track = await getTrack();
  const readingLinks = Array.from(getReadingLinks().values()).sort(
    (a, b) => a.sessionNumber - b.sessionNumber
  );
  const handbook = getHandbook();
  const setupPart = handbook.partsFlat.find((p) => p.number === 1);
  const troubleshootingPart = handbook.partsFlat.find((p) => p.number === 17);
  const glossaryPart = handbook.partsFlat.find((p) => p.number === 18);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-green-900">Reference</h1>

      <nav className="mt-4 flex flex-wrap gap-4 text-sm text-ink-soft">
        <a href="#syllabus" className="underline hover:text-ink">Syllabus</a>
        <a href="#reading-list" className="underline hover:text-ink">Reading list</a>
        <a href="#setup-checklist" className="underline hover:text-ink">Setup checklist</a>
        <a href="#troubleshooting" className="underline hover:text-ink">Troubleshooting</a>
        <a href="#glossary" className="underline hover:text-ink">Glossary</a>
      </nav>

      <section id="syllabus" className="mt-10 scroll-mt-24 border-t border-line pt-8">
        <h2 className="font-heading text-2xl font-semibold text-ink">Syllabus</h2>
        {(track ? [track] : (["grad", "undergrad"] as const)).map((t) => (
          <p key={t} className="mt-1 text-sm text-ink-soft">
            {syllabus.courseCode[t].label} · {syllabus.classMeeting[t]?.dayTime},{" "}
            {syllabus.classMeeting[t]?.room}
          </p>
        ))}
        <p className="mt-1 text-sm text-ink-soft">
          {syllabus.instructor.name} · {syllabus.instructor.email} · Office{" "}
          {syllabus.instructor.office}
        </p>
        {track ? (
          <EvaluationTable
            title={track === "grad" ? "Graduate section" : "Undergraduate section"}
            rows={forTrack(syllabus.evaluation, track)}
          />
        ) : (
          <>
            <EvaluationTable title="Graduate section" rows={syllabus.evaluation.grad} />
            <EvaluationTable title="Undergraduate section" rows={syllabus.evaluation.undergrad} />
          </>
        )}
      </section>

      <section id="reading-list" className="mt-10 scroll-mt-24 border-t border-line pt-8">
        <h2 className="font-heading text-2xl font-semibold text-ink">Full reading list</h2>
        <div className="mt-4 space-y-4">
          {readingLinks.map((s) => (
            <div key={s.sessionNumber}>
              <p className="font-heading text-base text-ink">
                Session {s.sessionNumber} — {s.title}
                {s.date && ` (${s.date})`}
              </p>
              {s.links.length === 0 ? (
                <p className="text-sm text-ink-soft">No assigned readings.</p>
              ) : (
                <ul className="mt-1 list-inside list-disc text-sm text-ink-soft">
                  {s.links.map((link, i) => (
                    <li key={i}>
                      {link.url ? (
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline hover:text-ink"
                        >
                          {renderInlineMarkdown(link.label)}
                        </a>
                      ) : (
                        renderInlineMarkdown(link.label)
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {setupPart && (
        <section id="setup-checklist" className="mt-10 scroll-mt-24 border-t border-line pt-8">
          <h2 className="font-heading text-2xl font-semibold text-ink">Setup checklist</h2>
          <Markdown source={setupPart.bodyMarkdown} />
        </section>
      )}

      {troubleshootingPart && (
        <section id="troubleshooting" className="mt-10 scroll-mt-24 border-t border-line pt-8">
          <h2 className="font-heading text-2xl font-semibold text-ink">Troubleshooting</h2>
          <Markdown source={troubleshootingPart.bodyMarkdown} />
        </section>
      )}

      {glossaryPart && (
        <section id="glossary" className="mt-10 scroll-mt-24 border-t border-line pt-8">
          <h2 className="font-heading text-2xl font-semibold text-ink">Glossary</h2>
          <Markdown source={glossaryPart.bodyMarkdown} />
        </section>
      )}
    </main>
  );
}
