import { getAnnouncements } from "@/lib/announcements";

// Matches the fetch's own `next.revalidate` window in getAnnouncements().
export const revalidate = 60;

/** Monochrome: urgency reads as fill, everything else as a hairline outline. */
const TAG_STYLES: Record<string, string> = {
  deadline: "border-ink bg-ink text-bg",
  "schedule change": "border-ink bg-ink text-bg",
  logistics: "border-line-strong text-ink-soft",
  resource: "border-line-strong text-ink-soft",
};

function formatDate(a: { date: string; dateObj: Date | null }): string {
  if (!a.dateObj) return a.date;
  return a.dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();
  const configured = Boolean(process.env.ANNOUNCEMENTS_CSV_URL);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12">
      <h1 className="font-heading text-3xl font-semibold text-ink">Announcements</h1>

      {!configured && (
        <p className="mt-4 rounded-[var(--radius-site)] border border-line bg-surface px-4 py-3 text-sm text-ink-soft">
          Announcements aren&rsquo;t connected yet. Once the Google Sheet is set up and{" "}
          <code className="rounded bg-bg px-1">ANNOUNCEMENTS_CSV_URL</code> is set in Vercel,
          new rows will appear here within a minute of being added — no redeploy needed.
        </p>
      )}

      {configured && announcements.length === 0 && (
        <p className="mt-4 text-ink-soft">No announcements yet.</p>
      )}

      <ul className="mt-8 space-y-6">
        {announcements.map((a, i) => (
          <li key={i} className="border-b border-line pb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-ink-soft">{formatDate(a)}</span>
              {a.pinned && (
                <span className="rounded-full border border-ink px-2 py-0.5 text-xs text-ink">
                  Pinned
                </span>
              )}
              {a.tag && (
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs ${
                    TAG_STYLES[a.tag.toLowerCase()] ?? "border-line text-ink-soft"
                  }`}
                >
                  {a.tag}
                </span>
              )}
            </div>
            <p className="mt-1 font-heading text-lg text-ink">{a.title}</p>
            {a.body && <p className="mt-1 text-sm text-ink-soft">{a.body}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}
