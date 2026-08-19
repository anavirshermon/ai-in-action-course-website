import { getHandbook } from "@/lib/content/handbook";
import { PromptBlock } from "@/components/Markdown";

export default function PromptsPage() {
  const handbook = getHandbook();

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-ink">Prompt library</h1>
      <p className="mt-2 text-ink-soft">
        Every copy-paste prompt from the Handbook, grouped by part. {handbook.prompts.length} total.
      </p>

      <div className="mt-8 space-y-10">
        {handbook.sections.map((section) => {
          const partsWithPrompts = section.parts.filter((p) =>
            handbook.prompts.some((pr) => pr.partNumber === p.number)
          );
          if (partsWithPrompts.length === 0) return null;

          return (
            <div key={section.title}>
              <p className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                {section.title}
              </p>
              {partsWithPrompts.map((part) => {
                const prompts = handbook.prompts.filter((pr) => pr.partNumber === part.number);
                return (
                  <div key={part.slug} className="mt-4">
                    <h2 className="font-heading text-lg text-ink">
                      Part {part.number}. {part.title}
                    </h2>
                    {prompts.map((p) => (
                      <PromptBlock key={p.id} text={p.text} />
                    ))}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </main>
  );
}
