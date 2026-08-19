"use client";

import { useRouter } from "next/navigation";
import { type Track, setTrackCookie } from "@/lib/track";

export function TrackPicker({
  gradLabel,
  undergradLabel,
}: {
  gradLabel: string;
  undergradLabel: string;
}) {
  const router = useRouter();

  function choose(track: Track) {
    setTrackCookie(track);
    router.push("/home");
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <button
        onClick={() => choose("grad")}
        className="rounded-[var(--radius-site)] border border-ink bg-ink px-8 py-4 text-left text-bg transition-colors hover:bg-ink-soft"
      >
        <span className="block font-heading text-lg font-semibold">
          Graduate section
        </span>
        <span className="block text-sm text-bg/70">{gradLabel}</span>
      </button>
      <button
        onClick={() => choose("undergrad")}
        className="rounded-[var(--radius-site)] border border-ink bg-transparent px-8 py-4 text-left text-ink transition-colors hover:bg-surface"
      >
        <span className="block font-heading text-lg font-semibold">
          Undergraduate section
        </span>
        <span className="block text-sm text-ink-faint">{undergradLabel}</span>
      </button>
    </div>
  );
}
