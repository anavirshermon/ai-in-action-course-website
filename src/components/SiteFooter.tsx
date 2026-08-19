import { getSyllabus } from "@/lib/content/syllabus";

export function SiteFooter() {
  const { instructor, courseCode } = getSyllabus();

  return (
    <footer className="mt-auto border-t border-line/70 px-6 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-1 text-sm text-ink-soft">
        <p>Built with Claude Code, like everything else in this course. Any errors are mine.</p>
        <p className="text-ink-soft/80">
          {instructor.name} · {courseCode.grad.number} and {courseCode.undergrad.number} · UT Dallas
        </p>
      </div>
    </footer>
  );
}
