import Link from "next/link";
import { getSyllabus, forTrack, DEFAULT_TRACK, type SessionRow } from "@/lib/content/syllabus";
import { getTrack, type Track } from "@/lib/track";
import { getReadingLinks } from "@/lib/content/reading-links";
import {
  getScheduleStatus,
  getNextDeadline,
  getTemporalStatus,
  getCurrentRow,
  type ScheduleStatus,
  type Deadline,
} from "@/lib/schedule-status";
import { syllabusPdf } from "@/lib/syllabus-pdf";
import { renderInlineMarkdown, stripMarkdownBold } from "@/lib/content/inline-markdown";

export default async function HomePage() {
  const syllabus = getSyllabus();
  const track = await getTrack();
  const sessions = forTrack(syllabus.sessions, track);
  const now = new Date();
  const status = getScheduleStatus(sessions, now);
  const deadline = getNextDeadline(sessions, now);
  const readingLinks = getReadingLinks();
  const pdf = syllabusPdf(track);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-10 px-6 py-12">
      <ThisWeekPanel
        status={status}
        readingLinks={readingLinks}
        lastDate={sessions[sessions.length - 1]?.date ?? ""}
        pdf={pdf}
        track={track}
      />
      {deadline && <NextDeadlineCallout deadline={deadline} />}
      <SyllabusCallout pdf={pdf} />
      <ModuleTimeline sessions={sessions} />
      <QuickLinks />
      <InstructorBlock syllabus={syllabus} track={track} />
    </main>
  );
}

// ---------------------------------------------------------------------------
// This week
// ---------------------------------------------------------------------------

function ThisWeekPanel({
  status,
  readingLinks,
  lastDate,
  pdf,
  track,
}: {
  status: ScheduleStatus;
  readingLinks: ReturnType<typeof getReadingLinks>;
  lastDate: string;
  pdf: { href: string; label: string };
  track: Track | null;
}) {
  if (status.phase === "before") {
    const isGrad = (track ?? DEFAULT_TRACK) === "grad";
    // The graduate section has an assigned reading for Session 1; the
    // undergraduate section only needs the syllabus.
    const firstReadings =
      isGrad && status.firstSession.number !== null
        ? readingLinks.get(status.firstSession.number)
        : undefined;

    return (
      <section className="rounded-[var(--radius-site)] border border-line bg-surface p-8">
        <p className="text-sm uppercase tracking-[0.15em] text-ink-soft">
          {status.daysUntil} day{status.daysUntil === 1 ? "" : "s"} until Session 1
        </p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-ink">
          Before the semester starts
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          There is nothing to install yet. Before {status.firstSession.date}, all you need to do is
          read the syllabus
          {firstReadings && firstReadings.links.length > 0
            ? " and the reading assigned for Session 1."
            : "."}
        </p>
        <a
          href={pdf.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-[var(--radius-site)] border border-ink bg-ink px-4 py-2 text-sm text-bg transition-colors hover:bg-ink-soft"
        >
          Read the syllabus ({pdf.label}) →
        </a>

        {firstReadings && firstReadings.links.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-semibold text-ink">Assigned reading for Session 1</p>
            <ul className="mt-1 list-inside list-disc text-sm text-ink-soft">
              {firstReadings.links.map((link, i) => (
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
          </div>
        )}
      </section>
    );
  }

  if (status.phase === "after") {
    return (
      <section className="rounded-[var(--radius-site)] border border-line bg-surface p-8">
        <h2 className="font-heading text-2xl font-semibold text-ink">
          That&rsquo;s the semester
        </h2>
        <p className="mt-3 max-w-xl text-ink-soft">
          Final Venture Packages, build logs, and peer evaluations were due {lastDate}. Thank you
          for building something real this semester.
        </p>
      </section>
    );
  }

  const session = status.currentSession;
  const readings = session.number !== null ? readingLinks.get(session.number) : undefined;

  return (
    <section className="rounded-[var(--radius-site)] border border-line bg-surface p-8">
      <p className="text-sm uppercase tracking-[0.15em] text-ink-soft">
        {session.moduleName} · {session.date}
      </p>
      <h2 className="mt-2 font-heading text-2xl font-semibold text-ink">
        {session.number !== null ? `Session ${session.number} — ` : ""}
        {renderInlineMarkdown(session.topic)}
      </h2>

      {session.due && (
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1 text-sm font-medium text-bg">
          Due: {stripMarkdownBold(session.due)}
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
        </div>
      )}

      {session.number !== null && (
        <Link
          href={`/sessions/${session.number}`}
          className="mt-5 inline-block text-sm text-ink underline"
        >
          Full session details →
        </Link>
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
        <p className="font-heading text-lg text-ink">{deadline.label}</p>
      </div>
      <p className="whitespace-nowrap text-sm text-ink-soft">
        {deadline.daysUntil <= 0
          ? "today"
          : `${deadline.daysUntil} day${deadline.daysUntil === 1 ? "" : "s"}`}
      </p>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Syllabus
// ---------------------------------------------------------------------------

function SyllabusCallout({ pdf }: { pdf: { href: string; label: string } }) {
  return (
    <a
      href={pdf.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 rounded-[var(--radius-site)] border border-ink bg-ink px-6 py-5 text-bg transition-colors hover:bg-ink-soft"
    >
      <div>
        <p className="text-xs uppercase tracking-[0.15em] text-bg/70">Start here</p>
        <p className="mt-1 font-heading text-lg font-semibold">
          Syllabus, {pdf.label} section
        </p>
        <p className="mt-0.5 text-sm text-bg/70">
          The official PDF. Everything on this site is drawn from it.
        </p>
      </div>
      <span className="shrink-0 text-sm underline underline-offset-4">Open PDF →</span>
    </a>
  );
}

// ---------------------------------------------------------------------------
// Module timeline
// ---------------------------------------------------------------------------

/** Four steps of the neutral ramp, light to dark, one per module. */
const MODULE_BAND = [
  "bg-line text-ink",
  "bg-line-strong text-ink",
  "bg-ink-faint text-bg",
  "bg-ink text-bg",
];
const MODULE_TICK = [
  "border-line bg-line/40 text-ink-soft",
  "border-line-strong bg-line-strong/40 text-ink",
  "border-ink-faint bg-ink-faint/25 text-ink",
  "border-ink bg-ink/10 text-ink",
];
const MODULE_SWATCH = ["bg-line", "bg-line-strong", "bg-ink-faint", "bg-ink"];

type ModuleBand = { number: number; name: string; first: number; last: number };

function moduleBands(sessions: SessionRow[]): ModuleBand[] {
  const byNumber = new Map<number, ModuleBand>();
  for (const s of sessions) {
    if (s.number === null) continue;
    const existing = byNumber.get(s.moduleNumber);
    // "Module 2: Building with Strategic Intent" -> drop the redundant prefix.
    const name = s.moduleName.replace(/^Module\s*\d+:\s*/, "");
    if (!existing) {
      byNumber.set(s.moduleNumber, {
        number: s.moduleNumber,
        name,
        first: s.number,
        last: s.number,
      });
    } else {
      existing.first = Math.min(existing.first, s.number);
      existing.last = Math.max(existing.last, s.number);
    }
  }
  return [...byNumber.values()].sort((a, b) => a.first - b.first);
}

function ModuleTimeline({ sessions }: { sessions: SessionRow[] }) {
  const now = new Date();
  const realSessions = sessions
    .filter((s): s is SessionRow & { number: number } => s.number !== null)
    .sort((a, b) => a.number - b.number);
  const currentRow = getCurrentRow(realSessions, now);
  const bands = moduleBands(sessions);
  const total = realSessions.length;
  const firstNumber = realSessions[0]?.number ?? 1;

  // Grid columns are 1-indexed off the first session, so a course that ever
  // starts numbering somewhere other than 1 still lines up.
  const col = (n: number) => n - firstNumber + 1;

  return (
    <section>
      <h3 className="font-heading text-lg font-semibold text-ink">The four modules</h3>
      <p className="mt-1 text-sm text-ink-soft">
        Every session belongs to one module, and each module answers one question.
      </p>

      <div className="mt-4 overflow-x-auto pb-2">
        <div className="min-w-[560px]">
          <div
            className="grid h-7 gap-1"
            style={{ gridTemplateColumns: `repeat(${total}, minmax(2.25rem, 1fr))` }}
          >
            {bands.map((b, i) => (
              <div
                key={b.number}
                style={{ gridColumn: `${col(b.first)} / ${col(b.last) + 1}` }}
                title={`Module ${b.number}: ${b.name}`}
                className={`flex items-center justify-center overflow-hidden whitespace-nowrap rounded-md px-2 text-[10px] font-semibold uppercase tracking-wide ${MODULE_BAND[i % 4]}`}
              >
                Module {b.number}
              </div>
            ))}
          </div>

          <div
            className="mt-1 grid gap-1"
            style={{ gridTemplateColumns: `repeat(${total}, minmax(2.25rem, 1fr))` }}
          >
            {realSessions.map((s) => {
              const bandIdx = bands.findIndex((b) => b.number === s.moduleNumber);
              const temporal = getTemporalStatus(s.dateObj, currentRow);
              const style = MODULE_TICK[(bandIdx < 0 ? 0 : bandIdx) % 4];

              return (
                <Link
                  key={s.number}
                  href={`/sessions/${s.number}`}
                  title={`${s.date} — ${s.topic.replace(/\*\*/g, "")}`}
                  className={`flex flex-col items-center rounded-md border px-1 py-1.5 text-center text-[10px] transition-colors hover:border-ink ${style} ${
                    temporal === "past" ? "opacity-40" : ""
                  } ${temporal === "current" ? "ring-2 ring-ink" : ""}`}
                >
                  <span className="font-semibold">{s.number}</span>
                  <span className="mt-0.5 whitespace-nowrap">{s.date}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <ul className="mt-4 space-y-1.5 text-sm">
        {bands.map((b, i) => (
          <li key={b.number} className="flex items-baseline gap-2.5">
            <span
              className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-sm ${MODULE_SWATCH[i % 4]}`}
              aria-hidden="true"
            />
            <span className="text-ink">
              Module {b.number}: {b.name}
            </span>
            <span className="text-ink-faint">
              {b.first === b.last ? `Session ${b.first}` : `Sessions ${b.first}\u2013${b.last}`}
            </span>
          </li>
        ))}
      </ul>
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
    <section className="flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-line pt-6">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="font-heading text-lg text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
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

function InstructorBlock({
  syllabus,
  track,
}: {
  syllabus: ReturnType<typeof getSyllabus>;
  track: Track | null;
}) {
  const meeting = forTrack(syllabus.classMeeting, track);
  const code = forTrack(syllabus.courseCode, track);
  const nameWords = syllabus.instructor.name.split(" ").filter((w) => !NAME_TITLES.test(w));
  const initials = [nameWords[0], nameWords[nameWords.length - 1]]
    .filter(Boolean)
    .map((w) => w[0])
    .join("");

  return (
    <section className="flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-ink font-heading text-xl text-bg">
        {initials}
      </div>
      <div className="text-sm text-ink-soft">
        <p className="font-heading text-base text-ink">{syllabus.instructor.name}</p>
        <p>{syllabus.instructor.email}</p>
        <p>
          Office: {syllabus.instructor.office} · Office hours: {syllabus.officeHoursSlot}
        </p>
        {meeting && (
          <p>
            Class ({code.label}): {meeting.dayTime}, {meeting.room}
          </p>
        )}
        <p>TA: {syllabus.ta}</p>
      </div>
    </section>
  );
}
