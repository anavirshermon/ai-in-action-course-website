import { getHandbook } from "@/lib/content/handbook";
import { HandbookSidebar } from "@/components/HandbookSidebar";
import { Markdown } from "@/components/Markdown";

export default function HandbookPage() {
  const handbook = getHandbook();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12 lg:flex-row lg:gap-10">
      <HandbookSidebar
        sections={handbook.sections.map((s) => ({
          title: s.title,
          parts: s.parts.map((p) => ({ number: p.number, title: p.title, slug: p.slug })),
        }))}
      />

      <div className="min-w-0 flex-1">
        <h1 className="font-heading text-3xl font-semibold text-ink">
          Building with AI
        </h1>
        <p className="mt-2 text-ink-soft">The course handbook, all 18 parts.</p>

        {handbook.sections.map((section) => (
          <div key={section.title} className="mt-10">
            <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              {section.title}
            </p>
            {section.parts.map((part) => (
              <article key={part.slug} id={part.slug} className="mt-6 scroll-mt-24 border-t border-line pt-6">
                <h2 className="font-heading text-xl font-semibold text-ink">
                  Part {part.number}. {part.title}
                </h2>
                <Markdown source={part.bodyMarkdown} />
              </article>
            ))}
          </div>
        ))}
      </div>
    </main>
  );
}
