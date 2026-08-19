import { readContentFile, splitSections, parseFirstTable } from "./markdown-utils";
import type { Track } from "../track";

const FILE = "00-Syllabus-ENTP6314-Fall2026.md";

export type Instructor = {
  name: string;
  email: string;
  office: string;
};

export type ClassMeeting = {
  section: string;
  dayTime: string;
  room: string;
};

export type EvaluationRow = {
  assessment: string;
  ownership: string;
  weight: string;
  due: string;
};

export type SessionRow = {
  moduleNumber: number;
  moduleName: string;
  number: number | null; // null for no-class rows
  date: string; // "M/D"
  dateObj: Date;
  topic: string;
  due: string;
  whatWeCover: string;
  isNoClass: boolean;
};

export type ModuleInfo = {
  number: number;
  name: string;
  sessionsRange: string;
  question: string;
  produces: string;
};

export type BuildArc = {
  label: string;
  detail: string;
};

/** Per-track values. The two sections meet on different days, carry different
 * course numbers, and diverge on two sessions, so anything the reader sees that
 * depends on their section is keyed this way. */
export type ByTrack<T> = { grad: T; undergrad: T };

export type CourseCode = {
  /** e.g. "ENTP 6314" */
  number: string;
  /** e.g. "MIS 6361", or null if not cross-listed */
  crossListedWith: string | null;
  /** e.g. "ENTP 6314 / MIS 6361" */
  label: string;
};

export type Syllabus = {
  courseCode: ByTrack<CourseCode>;
  courseTitle: string;
  courseSubtitle: string;
  instructor: Instructor;
  ta: string;
  classMeeting: ByTrack<ClassMeeting | null>;
  officeHoursSlot: string;
  officeHoursNote: string;
  evaluation: ByTrack<EvaluationRow[]>;
  sessions: ByTrack<SessionRow[]>;
  modules: ModuleInfo[];
  buildArcs: BuildArc[];
};

/** The graduate section is the default view for a reader who has not picked a
 * track, matching how the rest of the site falls back. */
export const DEFAULT_TRACK: Track = "grad";

export function forTrack<T>(value: ByTrack<T>, track: Track | null): T {
  return value[track ?? DEFAULT_TRACK];
}

function parseDate(mmdd: string): Date {
  const [month, day] = mmdd.replace(/\*\*/g, "").trim().split("/").map(Number);
  return new Date(2026, month - 1, day);
}

function parseEvaluationTable(body: string): EvaluationRow[] {
  const table = parseFirstTable(body);
  if (!table) return [];
  return table.rows.map((r) => ({
    assessment: r[0] ?? "",
    ownership: r[1] ?? "",
    weight: r[2] ?? "",
    due: r[3] ?? "",
  }));
}

/** "Graduate: ENTP 6314, cross-listed with MIS 6361." for each track. */
function parseCourseCodes(body: string): ByTrack<CourseCode> {
  const build = (label: "Graduate" | "Undergraduate"): CourseCode => {
    const m = body.match(
      new RegExp(
        `^${label}:\\s*([A-Z]{2,4}\\s?\\d{3,4})(?:,\\s*cross-listed with ([A-Z]{2,4}\\s?\\d{3,4}))?`,
        "m"
      )
    );
    if (!m) throw new Error(`syllabus: no "${label}:" line under "## Course Code"`);
    const crossListedWith = m[2] ?? null;
    return {
      number: m[1],
      crossListedWith,
      label: crossListedWith ? `${m[1]} / ${crossListedWith}` : m[1],
    };
  };
  return { grad: build("Graduate"), undergrad: build("Undergraduate") };
}

/** "Graduate — Section 501: Wednesday, 7 to 9:45 PM, Room: JSOM 13.501" */
function parseClassMeetings(body: string): ByTrack<ClassMeeting | null> {
  const build = (label: "Graduate" | "Undergraduate"): ClassMeeting | null => {
    const m = body.match(
      new RegExp(`^${label}\\s*[—-]\\s*Section\\s+(\\S+):\\s+(.+?),\\s+Room:\\s+(.+)$`, "m")
    );
    return m ? { section: m[1], dayTime: m[2], room: m[3] } : null;
  };
  return { grad: build("Graduate"), undergrad: build("Undergraduate") };
}

function parseSchedule(scheduleBody: string): SessionRow[] {
  const scheduleModules = splitSections(scheduleBody, 3);
  const sessions: SessionRow[] = [];

  scheduleModules.forEach((mod, modIdx) => {
    const table = parseFirstTable(mod.body);
    if (!table) return;
    for (const row of table.rows) {
      const [numRaw, dateRaw, topicRaw, dueRaw, coverRaw] = row;
      const numberClean = numRaw.replace(/\*\*/g, "").trim();
      const isNoClass = numberClean === "—" || numberClean === "-";
      sessions.push({
        moduleNumber: modIdx + 1,
        moduleName: mod.title,
        number: isNoClass ? null : Number(numberClean),
        date: dateRaw.replace(/\*\*/g, "").trim(),
        dateObj: parseDate(dateRaw),
        topic: topicRaw,
        due: dueRaw,
        whatWeCover: coverRaw,
        isNoClass,
      });
    }
  });

  sessions.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
  return sessions;
}

let cached: Syllabus | null = null;

export function getSyllabus(): Syllabus {
  if (cached) return cached;

  const raw = readContentFile(FILE);
  const lines = raw.split("\n");
  const courseTitle = lines[0].replace(/^# /, "").trim();
  const courseSubtitle = lines[1].replace(/^## /, "").trim();

  const top = splitSections(raw, 2);
  const byTitle = (title: string) => top.find((s) => s.title === title)?.body ?? "";

  const instructorBody = byTitle("Instructor").split("\n").filter(Boolean);
  const instructor: Instructor = {
    name: instructorBody[0] ?? "",
    email: instructorBody[1] ?? "",
    office: (instructorBody[2] ?? "").replace(/^Office:\s*/, ""),
  };

  const ta = byTitle("Teaching Assistant").trim();

  const courseCode = parseCourseCodes(byTitle("Course Code"));
  const classMeeting = parseClassMeetings(byTitle("Class Schedule for Fall 2026"));

  const officeHoursBody = byTitle("Office Hours");
  const [officeHoursSlot = "", ...officeHoursRest] = officeHoursBody
    .split("\n\n")
    .map((s) => s.trim());
  const officeHoursNote = officeHoursRest.join("\n\n");

  const evaluationBody = byTitle("Course Evaluation");
  const evalSections = splitSections(evaluationBody, 3);
  const gradBody = evalSections.find((s) => s.title === "Graduate section")?.body ?? "";
  const ugBody = evalSections.find((s) => s.title === "Undergraduate section")?.body ?? "";

  const sessions: ByTrack<SessionRow[]> = {
    grad: parseSchedule(byTitle("Course Schedule (Graduate)")),
    undergrad: parseSchedule(byTitle("Course Schedule (Undergraduate)")),
  };

  const courseStructureBody = byTitle("Course Structure");
  const structureSections = splitSections(courseStructureBody, 3);

  const modulesBody = structureSections.find((s) => s.title === "Four modules")?.body ?? "";
  const modulesTable = parseFirstTable(modulesBody);
  const modules: ModuleInfo[] = (modulesTable?.rows ?? []).map((r) => {
    const [moduleCell, sessionsRange, question, produces] = r;
    const m = moduleCell.match(/^(\d+)\.\s*(.+)$/);
    return {
      number: m ? Number(m[1]) : 0,
      name: m ? m[2] : moduleCell,
      sessionsRange,
      question,
      produces,
    };
  });

  const arcsBody = structureSections.find((s) => s.title === "Two build arcs")?.body ?? "";
  const buildArcs: BuildArc[] = [];
  for (const para of arcsBody.split("\n\n")) {
    const m = para.trim().match(/^\*\*(.+?)\*\*\s*([\s\S]*)$/);
    if (m) {
      buildArcs.push({ label: m[1], detail: m[2].trim() });
    }
  }

  cached = {
    courseCode,
    courseTitle,
    courseSubtitle,
    instructor,
    ta,
    classMeeting,
    officeHoursSlot,
    officeHoursNote,
    evaluation: {
      grad: parseEvaluationTable(gradBody),
      undergrad: parseEvaluationTable(ugBody),
    },
    sessions,
    modules,
    buildArcs,
  };

  return cached;
}
