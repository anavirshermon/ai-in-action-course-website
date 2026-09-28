import { getExercises } from "@/lib/content/exercises";
import { Markdown } from "@/components/Markdown";

export default function ExercisesPage() {
  const exercises = getExercises();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-ink">Exercises</h1>
      <p className="mt-2 text-ink-soft">
        Small tools you build with Claude Code to test an idea. Each one comes with the files you
        need to start.
      </p>

      {exercises.map((e) => (
        <section
          key={e.slug}
          id={e.slug}
          className="mt-10 scroll-mt-24 border-t border-line pt-8"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
            Exercise {e.number} · {e.session}
          </p>
          <h2 className="mt-1 font-heading text-2xl font-semibold text-ink">{e.title}</h2>

          <Markdown source={e.intro} />

          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {e.downloads.map((d) => (
              <a
                key={d.href}
                href={d.href}
                download={d.filename}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-site)] border border-line-strong bg-bg px-4 py-3 transition-colors hover:border-ink hover:bg-surface"
              >
                <div className="min-w-0">
                  <p className="text-sm text-ink-soft">{d.label}</p>
                  <p className="font-mono text-sm text-ink">{d.filename}</p>
                </div>
                <span className="shrink-0 text-sm text-ink" aria-hidden="true">
                  ↓
                </span>
              </a>
            ))}
          </div>

          <Markdown source={e.body} />
        </section>
      ))}
    </main>
  );
}
