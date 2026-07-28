import Papa from "papaparse";

export type Announcement = {
  date: string;
  dateObj: Date | null;
  title: string;
  body: string;
  tag: string;
  pinned: boolean;
};

type SheetRow = {
  date?: string;
  title?: string;
  body?: string;
  tag?: string;
  pinned?: string;
};

/** Parses "YYYY-MM-DD" or "M/D/YYYY" as a LOCAL date. Passing either format
 * straight to `new Date(string)` parses YYYY-MM-DD as UTC midnight, which
 * then renders as the previous day in any timezone behind UTC. */
function parseLocalDate(dateStr: string): Date | null {
  const iso = dateStr.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));
  }
  const slash = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) {
    return new Date(Number(slash[3]), Number(slash[1]) - 1, Number(slash[2]));
  }
  const fallback = new Date(dateStr);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const url = process.env.ANNOUNCEMENTS_CSV_URL;
  if (!url) return [];

  let csv: string;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    csv = await res.text();
  } catch {
    return [];
  }

  const parsed = Papa.parse<SheetRow>(csv, { header: true, skipEmptyLines: true });

  return parsed.data
    .map((row): Announcement => {
      const dateStr = row.date?.trim() ?? "";
      return {
        date: dateStr,
        dateObj: dateStr ? parseLocalDate(dateStr) : null,
        title: row.title?.trim() ?? "",
        body: row.body?.trim() ?? "",
        tag: row.tag?.trim() ?? "",
        pinned: /^(true|yes|1)$/i.test(row.pinned?.trim() ?? ""),
      };
    })
    .filter((a) => a.title)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return (b.dateObj?.getTime() ?? 0) - (a.dateObj?.getTime() ?? 0);
    });
}
