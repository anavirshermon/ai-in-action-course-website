import { readContentFile, splitSections, parseFirstTable } from "./markdown-utils";

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

export type Syllabus = {
  courseCode: string;
  courseTitle: string;
  courseSubtitle: string;
  instructor: Instructor;
  ta: string;
  crossListedWith: string | null;
  classMeeting: ClassMeeting | null;
  officeHoursSlot: string;
  officeHoursNote: string;
  evaluation: {
    grad: EvaluationRow[];
    undergrad: EvaluationRow[];
  };
  sessions: SessionRow[];
  modules: ModuleInfo[];
  buildArcs: BuildArc[];
};

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

  const courseCodeBody = byTitle("Course Code");
  const crossListMatch = courseCodeBody.match(/cross-listed with ([A-Z]{2,4}\s?\d{3,4})/);
  const crossListedWith = crossListMatch ? crossListMatch[1] : null;

  const classScheduleBody = byTitle("Class Schedule for Fall 2026");
  const classMatch = classScheduleBody.match(
    /^Section\s+(\S+):\s+(.+?),\s+Room:\s+(.+)$/m
  );
  const classMeeting: ClassMeeting | null = classMatch
    ? { section: classMatch[1], dayTime: classMatch[2], room: classMatch[3] }
    : null;

  const officeHoursBody = byTitle("Office Hours");
  const [officeHoursSlot = "", ...officeHoursRest] = officeHoursBody
    .split("\n\n")
    .map((s) => s.trim());
  const officeHoursNote = officeHoursRest.join("\n\n");

  const evaluationBody = byTitle("Course Evaluation");
  const evalSections = splitSections(evaluationBody, 3);
  const gradBody = evalSections.find((s) => s.title === "Graduate section")?.body ?? "";
  const ugBody = evalSections.find((s) => s.title === "Undergraduate section")?.body ?? "";

  const scheduleBody = byTitle("Course Schedule");
  const scheduleModules = splitSections(scheduleBody, 3);
  const sessions: SessionRow[] = [];

  scheduleModules.forEach((mod, modIdx) => {
    const table = parseFirstTable(mod.body);
    if (!table) return;
    for (const row of table.rows) {
      const [numRaw, dateRaw, topicRaw, dueRaw, coverRaw] = row;
      const isNoClass = numRaw.replace(/\*\*/g, "").trim() === "—";
      const numberClean = numRaw.replace(/\*\*/g, "").trim();
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
    courseCode: crossListedWith ? `ENTP 6314 / ${crossListedWith}` : "ENTP 6314",
    courseTitle,
    courseSubtitle,
    instructor,
    ta,
    crossListedWith,
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
