import { getAssignmentGuide } from "@/lib/content/assignments";
import { getSyllabus, type EvaluationRow } from "@/lib/content/syllabus";
import { getTrack } from "@/lib/track";
import { Markdown } from "@/components/Markdown";

function findRow(rows: EvaluationRow[], title: string): EvaluationRow | null {
  return rows.find((r) => r.assessment === title) ?? null;
}

export default async function AssignmentsPage() {
  const { assignments, intro } = getAssignmentGuide();
  const syllabus = getSyllabus();
  const track = await getTrack();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-green-900">Assignments</h1>
      {intro["Read this first"] && <Markdown source={intro["Read this first"]} />}

      {!track && (
        <p className="mt-4 rounded-[var(--radius-site)] border border-orange-500 bg-orange-200/30 px-4 py-2 text-sm text-orange-700">
          Pick your track on the home page to see weights for your section. Showing both below.
        </p>
      )}

      <div className="mt-8 space-y-12">
        {assignments.map((a) => {
          const gradRow = findRow(syllabus.evaluation.grad, a.title);
          const ugRow = findRow(syllabus.evaluation.undergrad, a.title);
          const relevantRow = track === "grad" ? gradRow : track === "undergrad" ? ugRow : null;

          return (
            <section key={a.slug} id={a.slug} className="scroll-mt-24 border-t border-line pt-8">
              <h2 className="font-heading text-2xl font-semibold text-ink">{a.title}</h2>

              {track ? (
                relevantRow ? (
                  <p className="mt-1 text-sm text-orange-700">
                    {relevantRow.weight} · {relevantRow.ownership} · Due {relevantRow.due}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-ink-soft">
                    Not part of the {track === "grad" ? "graduate" : "undergraduate"} section.
                  </p>
                )
              ) : (
                <div className="mt-1 flex gap-4 text-sm text-orange-700">
                  {gradRow && <span>Grad: {gradRow.weight}, due {gradRow.due}</span>}
                  {ugRow && <span>UG: {ugRow.weight}, due {ugRow.due}</span>}
                </div>
              )}

              <div className="mt-4">
                <h3 className="font-heading text-base font-semibold text-ink">What this is</h3>
                <Markdown source={a.whatThisIs} />
              </div>
              <div className="mt-4">
                <h3 className="font-heading text-base font-semibold text-ink">
                  Why you are doing it
                </h3>
                <Markdown source={a.whyYouAreDoingIt} />
              </div>
              <div className="mt-4">
                <h3 className="font-heading text-base font-semibold text-ink">
                  What to submit and when
                </h3>
                <Markdown source={a.whatToSubmitAndWhen} />
              </div>
              <div className="mt-4">
                <h3 className="font-heading text-base font-semibold text-ink">
                  What a strong version looks like
                </h3>
                <Markdown source={a.whatAStrongVersionLooksLike} />
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
