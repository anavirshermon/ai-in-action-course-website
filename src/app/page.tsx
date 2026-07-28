import { getSyllabus } from "@/lib/content/syllabus";
import { TrackPicker } from "@/components/TrackPicker";

export default function LandingPage() {
  const syllabus = getSyllabus();
  const [thesisTitle, thesisRest] = syllabus.courseSubtitle.split(":").map((s) => s.trim());

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.2em] text-orange-700">
        UT Dallas · Fall 2026
      </p>
      <h1 className="max-w-2xl font-heading text-5xl font-semibold text-green-900 sm:text-6xl">
        {thesisTitle}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-ink-soft">{thesisRest}</p>

      <div className="mt-12">
        <TrackPicker />
      </div>

      <p className="mt-8 text-sm text-ink-soft">
        {syllabus.courseCode} · Wednesdays, 7–9:45 PM
      </p>
    </main>
  );
}
