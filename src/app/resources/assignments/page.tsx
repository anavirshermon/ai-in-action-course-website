import Link from "next/link";
import { getAssignmentGuide } from "@/lib/content/assignments";
import { getSyllabus, type EvaluationRow } from "@/lib/content/syllabus";
import { getTrack } from "@/lib/track";
import { filterTrackProse } from "@/lib/content/track-prose";
import { Markdown } from "@/components/Markdown";

function findRow(rows: EvaluationRow[], title: string): EvaluationRow | null {
  return rows.find((r) => r.assessment === title) ?? null;
}

export default async function AssignmentsPage() {
  const { assignments: allAssignments, intro } = getAssignmentGuide();
  const syllabus = getSyllabus();
  const track = await getTrack();

  // An assignment belongs to a section when that section's evaluation table
  // carries a row for it. Progress Week Meeting is undergraduate-only, so a
  // graduate reader should not see it at all rather than see it crossed out.
  const assignments = track
    ? allAssignments.filter((a) => findRow(syllabus.evaluation[track], a.title))
    : allAssignments;

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-ink">Assignments</h1>
      {intro["Read this first"] && (
        <Markdown source={filterTrackProse(intro["Read this first"], track)} />
      )}

      {!track && (
        <Link
          href="/?pick=1"
          className="mt-4 block rounded-[var(--radius-site)] border border-line bg-surface px-4 py-2 text-sm text-ink-soft underline transition-colors hover:border-line-strong"
        >
          Pick your track to see weights for your section →
        </Link>
      )}

      <div className="mt-8 space-y-12">
        {assignments.map((a) => {
          const gradRow = findRow(syllabus.evaluation.grad, a.title);
          const ugRow = findRow(syllabus.evaluation.undergrad, a.title);
          const relevantRow = track ? findRow(syllabus.evaluation[track], a.title) : null;
          const body = (source: string) => (
            <Markdown source={filterTrackProse(source, track)} />
          );

          return (
            <section key={a.slug} id={a.slug} className="scroll-mt-24 border-t border-line pt-8">
              <h2 className="font-heading text-2xl font-semibold text-ink">{a.title}</h2>

              {relevantRow ? (
                <p className="mt-1 text-sm text-ink-soft">
                  {relevantRow.weight} · {relevantRow.ownership} · Due {relevantRow.due}
                </p>
              ) : (
                <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-ink-soft">
                  {gradRow && <span>Grad: {gradRow.weight}, due {gradRow.due}</span>}
                  {ugRow && <span>UG: {ugRow.weight}, due {ugRow.due}</span>}
                </div>
              )}

              <div className="mt-4">
                <h3 className="font-heading text-base font-semibold text-ink">What this is</h3>
                {body(a.whatThisIs)}
              </div>
              <div className="mt-4">
                <h3 className="font-heading text-base font-semibold text-ink">
                  Why you are doing it
                </h3>
                {body(a.whyYouAreDoingIt)}
              </div>
              <div className="mt-4">
                <h3 className="font-heading text-base font-semibold text-ink">
                  What to submit and when
                </h3>
                {body(a.whatToSubmitAndWhen)}
              </div>
              <div className="mt-4">
                <h3 className="font-heading text-base font-semibold text-ink">
                  What a strong version looks like
                </h3>
                {body(a.whatAStrongVersionLooksLike)}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
