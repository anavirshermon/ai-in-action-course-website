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

const CURRENT_WINDOW_MS = 3.5 * 24 * 60 * 60 * 1000;

export function getTemporalStatus(date: Date, now: Date): TemporalStatus {
  const diff = date.getTime() - now.getTime();
  if (Math.abs(diff) <= CURRENT_WINDOW_MS) return "current";
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

function daysBetween(from: Date, to: Date): number {
  const ms = to.getTime() - from.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

export function getScheduleStatus(sessions: SessionRow[], now: Date): ScheduleStatus {
  const sorted = [...sessions].sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  if (now < first.dateObj) {
    return { phase: "before", firstSession: first, daysUntil: daysBetween(now, first.dateObj) };
  }

  // "After" once a week has passed since the last calendar entry.
  const oneWeekAfterLast = new Date(last.dateObj.getTime() + 7 * 24 * 60 * 60 * 1000);
  if (now >= oneWeekAfterLast) {
    return { phase: "after", lastSession: last };
  }

  let current = sorted[0];
  let next: SessionRow | null = null;
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].dateObj <= now) {
      current = sorted[i];
      next = sorted[i + 1] ?? null;
    }
  }

  return { phase: "during", currentSession: current, nextSession: next };
}

export function getNextDeadline(sessions: SessionRow[], now: Date): Deadline | null {
  const upcoming = sessions
    .filter((s) => stripBold(s.due) && s.dateObj >= now)
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  if (upcoming.length === 0) return null;

  const target = upcoming[0];
  return {
    label: stripBold(target.due),
    dateObj: target.dateObj,
    daysUntil: daysBetween(now, target.dateObj),
  };
}
