import { getSyllabus } from "@/lib/content/syllabus";
import { TrackPicker } from "@/components/TrackPicker";

export default function LandingPage() {
  const syllabus = getSyllabus();
  const [thesisTitle, thesisRest] = syllabus.courseSubtitle.split(":").map((s) => s.trim());

  return (
    <main className="flex flex-1 flex-col justify-center px-6 py-24 sm:px-12 lg:px-24">
      <div className="max-w-2xl">
        <p className="text-sm uppercase tracking-[0.2em] text-ink-soft">
          UT Dallas · Fall 2026
        </p>
        <h1 className="mt-4 font-heading text-5xl font-semibold text-ink sm:text-6xl">
          {thesisTitle}
        </h1>
        <p className="mt-4 max-w-xl text-lg text-ink-soft">{thesisRest}</p>

        <div className="mt-12">
          <TrackPicker
            gradLabel={syllabus.courseCode.grad.label}
            undergradLabel={syllabus.courseCode.undergrad.label}
          />
        </div>

        <p className="mt-8 text-sm text-ink-soft">
          {syllabus.courseCode.grad.label} · {syllabus.classMeeting.grad?.dayTime}
          <br />
          {syllabus.courseCode.undergrad.label} · {syllabus.classMeeting.undergrad?.dayTime}
        </p>
      </div>
    </main>
  );
}
