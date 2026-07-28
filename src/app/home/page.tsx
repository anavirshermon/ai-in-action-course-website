import Link from "next/link";
import { getSyllabus, type SessionRow, type BuildArc } from "@/lib/content/syllabus";
import { getReadingLinks } from "@/lib/content/reading-links";
import {
  getScheduleStatus,
  getNextDeadline,
  getTemporalStatus,
  sessionArcIndex,
  parseArcRange,
  type ScheduleStatus,
  type Deadline,
} from "@/lib/schedule-status";
import { renderInlineMarkdown } from "@/lib/content/inline-markdown";

// "Current session" only changes week to week — hourly revalidation keeps
// this page accurate without opting the whole site into per-request rendering.
export const revalidate = 3600;

export default function HomePage() {
  const syllabus = getSyllabus();
  const now = new Date();
  const status = getScheduleStatus(syllabus.sessions, now);
  const deadline = getNextDeadline(syllabus.sessions, now);
  const readingLinks = getReadingLinks();

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-12">
      <ThisWeekPanel status={status} readingLinks={readingLinks} />
      {deadline && <NextDeadlineCallout deadline={deadline} />}
      <BuildArcTimeline sessions={syllabus.sessions} arcs={syllabus.buildArcs} />
      <QuickLinks />
      <InstructorBlock syllabus={syllabus} />
    </main>
  );
}

// ---------------------------------------------------------------------------
// This week
// ---------------------------------------------------------------------------

function ThisWeekPanel({
  status,
  readingLinks,
}: {
  status: ScheduleStatus;
  readingLinks: ReturnType<typeof getReadingLinks>;
}) {
  if (status.phase === "before") {
    return (
      <section className="rounded-[var(--radius-site)] border-2 border-green-900 bg-paper-dim/60 p-8">
        <p className="text-sm uppercase tracking-[0.15em] text-orange-700">
          {status.daysUntil} day{status.daysUntil === 1 ? "" : "s"} until Session 1
        </p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-green-900">
          Before the semester starts
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          Get your toolchain working before {status.firstSession.date}: Claude Code, VS Code, and
          your GitHub, Vercel, and Supabase accounts.
        </p>
        <Link
          href="/resources/handbook#part-1-setup"
          className="mt-4 inline-block rounded-[var(--radius-site)] border border-green-900 bg-green-900 px-4 py-2 text-sm text-paper transition-colors hover:bg-green-700"
        >
          Read the setup checklist (Handbook Part 1) →
        </Link>
      </section>
    );
  }

  if (status.phase === "after") {
    return (
      <section className="rounded-[var(--radius-site)] border-2 border-green-900 bg-paper-dim/60 p-8">
        <h2 className="font-heading text-2xl font-semibold text-green-900">
          That&rsquo;s the semester
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          Final Venture Packages, build logs, and peer evaluations were due 12/11. Thank you for
          building something real this semester.
        </p>
      </section>
    );
  }

  const session = status.currentSession;
  const readings = session.number !== null ? readingLinks.get(session.number) : undefined;

  return (
    <section className="rounded-[var(--radius-site)] border-2 border-green-900 bg-paper-dim/60 p-8">
      <p className="text-sm uppercase tracking-[0.15em] text-orange-700">
        {session.moduleName} · {session.date}
      </p>
      <h2 className="mt-2 font-heading text-2xl font-semibold text-green-900">
        {session.number !== null ? `Session ${session.number} — ` : ""}
        {renderInlineMarkdown(session.topic)}
      </h2>

      {session.due && (
        <p className="mt-3 text-sm font-medium text-orange-700">
          Due: {renderInlineMarkdown(session.due)}
        </p>
      )}

      <p className="mt-4 max-w-2xl text-ink-soft">{renderInlineMarkdown(session.whatWeCover)}</p>

      {readings && readings.links.length > 0 && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-ink">Before class</p>
          {readings.note && <p className="text-sm italic text-ink-soft">{readings.note}</p>}
          <ul className="mt-1 list-inside list-disc text-sm text-ink-soft">
            {readings.links.map((link, i) => (
              <li key={i}>
                {link.url ? (
                  <a href={link.url} className="underline hover:text-ink">
                    {link.label}
                  </a>
                ) : (
                  link.label
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {status.nextSession && (
        <p className="mt-5 text-sm text-ink-soft">
          Next: {status.nextSession.date} —{" "}
          {status.nextSession.number !== null ? `Session ${status.nextSession.number}, ` : ""}
          {renderInlineMarkdown(status.nextSession.topic)}
        </p>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Next deadline
// ---------------------------------------------------------------------------

function NextDeadlineCallout({ deadline }: { deadline: Deadline }) {
  return (
    <section className="flex items-center justify-between rounded-[var(--radius-site)] border border-line bg-transparent px-6 py-4">
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-ink-soft">Next deadline</p>
        <p className="font-heading text-lg text-green-900">{deadline.label}</p>
      </div>
      <p className="whitespace-nowrap text-sm text-orange-700">
        {deadline.daysUntil <= 0
          ? "today"
          : `${deadline.daysUntil} day${deadline.daysUntil === 1 ? "" : "s"}`}
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Build arc timeline
// ---------------------------------------------------------------------------

const ARC_STYLES = [
  "border-orange-700 bg-orange-200/50 text-orange-700",
  "border-green-700 bg-green-500/15 text-green-700",
];

function BuildArcTimeline({ sessions, arcs }: { sessions: SessionRow[]; arcs: BuildArc[] }) {
  const now = new Date();

  return (
    <section>
      <h3 className="font-heading text-lg font-semibold text-green-900">The two build arcs</h3>
      <div className="mt-2 flex gap-4 text-xs text-ink-soft">
        {arcs.map((arc, i) => {
          const range = parseArcRange(arc.label);
          return (
            <span key={arc.label} className="flex items-center gap-1.5">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-full border ${ARC_STYLES[i]?.split(" ").slice(0, 2).join(" ")}`}
              />
              {range ? `Weeks ${range[0]}–${range[1]}` : arc.label}: {arc.label.replace(/^Weeks?\s+\S+\s+(?:and|through)\s+\S+\s+are\s+/i, "").replace(/\.$/, "")}
            </span>
          );
        })}
      </div>

      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-2">
        {sessions.map((s) => {
          const arcIdx = sessionArcIndex(arcs, s.number);
          const temporal = getTemporalStatus(s.dateObj, now);
          const style = arcIdx !== null ? ARC_STYLES[arcIdx] : "border-line bg-paper-dim text-ink-soft";

          return (
            <div
              key={`${s.moduleNumber}-${s.date}`}
              title={`${s.date} — ${s.topic.replace(/\*\*/g, "")}`}
              className={`flex min-w-[2.75rem] flex-col items-center rounded-md border px-1.5 py-2 text-center text-[10px] ${style} ${
                temporal === "past" ? "opacity-40" : ""
              } ${temporal === "current" ? "ring-2 ring-green-900" : ""}`}
            >
              <span className="font-semibold">{s.number ?? "—"}</span>
              <span className="mt-0.5 whitespace-nowrap">{s.date}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Quick links
// ---------------------------------------------------------------------------

function QuickLinks() {
  const links = [
    { href: "/resources/reference#syllabus", label: "Syllabus" },
    { href: "/resources/handbook", label: "Handbook" },
    { href: "/resources/assignments", label: "Assignments" },
  ];
  return (
    <section className="flex gap-4">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="flex-1 rounded-[var(--radius-site)] border border-line px-4 py-3 text-center font-heading text-green-900 transition-colors hover:bg-paper-dim/60"
        >
          {l.label}
        </Link>
      ))}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Instructor
// ---------------------------------------------------------------------------

const NAME_TITLES = /^(Professor|Prof\.?|Dr\.?|Mr\.?|Mrs\.?|Ms\.?)$/i;

function InstructorBlock({ syllabus }: { syllabus: ReturnType<typeof getSyllabus> }) {
  const nameWords = syllabus.instructor.name.split(" ").filter((w) => !NAME_TITLES.test(w));
  const initials = [nameWords[0], nameWords[nameWords.length - 1]]
    .filter(Boolean)
    .map((w) => w[0])
    .join("");

  return (
    <section className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-900 font-heading text-xl text-paper">
        {initials}
      </div>
      <div className="text-sm text-ink-soft">
        <p className="font-heading text-base text-ink">{syllabus.instructor.name}</p>
        <p>{syllabus.instructor.email}</p>
        <p>
          Office: {syllabus.instructor.office} · Office hours: {syllabus.officeHoursSlot}
        </p>
        {syllabus.classMeeting && (
          <p>
            Class: {syllabus.classMeeting.dayTime}, {syllabus.classMeeting.room}
          </p>
        )}
        <p>TA: {syllabus.ta}</p>
      </div>
    </section>
  );
}
