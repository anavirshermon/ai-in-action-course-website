import type { BuildArc, SessionRow } from "./content/syllabus";

/** Extracts the session range a build-arc label refers to, e.g.
 * "Sessions 4 and 5 are probes." -> [4, 5], "Sessions 6 through 9..." -> [6, 9].
 * The syllabus prose says "Sessions"; older drafts said "Weeks", so both parse. */
export function parseArcRange(label: string): [number, number] | null {
  const m = label.match(/(?:Weeks?|Sessions?)\s+(\d+)\s+(?:and|through)\s+(\d+)/i);
  if (!m) return null;
  return [Number(m[1]), Number(m[2])];
}

export function sessionArcIndex(arcs: BuildArc[], sessionNumber: number | null): number | null {
  if (sessionNumber === null) return null;
  for (let i = 0; i < arcs.length; i++) {
    const range = parseArcRange(arcs[i].label);
    if (range && sessionNumber >= range[0] && sessionNumber <= range[1]) return i;
  }
  return null;
}

export type TemporalStatus = "past" | "current" | "upcoming";

/** The course meets in Dallas, so "today" has to mean today in Central time.
 * Vercel runs the server in UTC, and comparing a UTC clock against the session
 * dates would roll the schedule over at 7pm Central, in the middle of a class. */
const COURSE_TIME_ZONE = "America/Chicago";

/** Midnight at the start of today in the course's time zone, built with the
 * same local-date constructor parseDate() uses, so the two compare cleanly. */
export function courseToday(now: Date): Date {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: COURSE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(now)
    .split("-")
    .map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

/** The row the course is currently pointed at: today's class if we are on a
 * class day, otherwise the next one coming up. Returns null once the last
 * calendar date has passed, so nothing is left highlighted after the semester. */
export function getCurrentRow(rows: SessionRow[], now: Date): SessionRow | null {
  const today = courseToday(now);
  const sorted = [...rows].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  return sorted.find((r) => r.dateObj.getTime() >= today.getTime()) ?? null;
}

/** Past, current, or upcoming relative to whichever row is current. Pass the
 * result of getCurrentRow() for the same list so a page's banner, timeline,
 * and session list all agree about where the semester is. */
export function getTemporalStatus(date: Date, currentRow: SessionRow | null): TemporalStatus {
  if (!currentRow) return "past";
  const diff = date.getTime() - currentRow.dateObj.getTime();
  if (diff === 0) return "current";
  return diff < 0 ? "past" : "upcoming";
}

export type ScheduleStatus =
  | { phase: "before"; firstSession: SessionRow; daysUntil: number }
  | { phase: "during"; currentSession: SessionRow; nextSession: SessionRow | null }
  | { phase: "after"; lastSession: SessionRow };

export type Deadline = {
  label: string;
  dateObj: Date;
  daysUntil: number;
};

function stripBold(text: string): string {
  return text.replace(/\*\*/g, "").trim();
}

/** Whole calendar days between two midnights. Rounding rather than ceiling
 * absorbs the one-hour wobble a daylight-saving change puts into the gap. */
function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function getScheduleStatus(sessions: SessionRow[], now: Date): ScheduleStatus {
  const today = courseToday(now);
  const sorted = [...sessions].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  if (today < first.dateObj) {
    return { phase: "before", firstSession: first, daysUntil: daysBetween(today, first.dateObj) };
  }

  // "After" once a week has passed since the last calendar entry.
  const oneWeekAfterLast = new Date(last.dateObj.getTime() + 7 * 24 * 60 * 60 * 1000);
  if (today >= oneWeekAfterLast) {
    return { phase: "after", lastSession: last };
  }

  // The panel is about what to prepare for, so it holds on today's class for
  // the whole of class day and then moves on to the next entry. In the last
  // week of the semester nothing is left ahead, so it stays on the final entry.
  const ahead = sorted.findIndex((s) => s.dateObj.getTime() >= today.getTime());
  const index = ahead === -1 ? sorted.length - 1 : ahead;

  return { phase: "during", currentSession: sorted[index], nextSession: sorted[index + 1] ?? null };
}

export function getNextDeadline(sessions: SessionRow[], now: Date): Deadline | null {
  const today = courseToday(now);
  const upcoming = sessions
    .filter((s) => stripBold(s.due) && s.dateObj.getTime() >= today.getTime())
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  if (upcoming.length === 0) return null;

  const target = upcoming[0];
  return {
    label: stripBold(target.due),
    dateObj: target.dateObj,
    daysUntil: daysBetween(today, target.dateObj),
  };
}
