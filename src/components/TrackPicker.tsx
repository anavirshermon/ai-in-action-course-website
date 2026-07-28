"use client";

import { useRouter } from "next/navigation";
import { type Track, setTrackCookie } from "@/lib/track";

export function TrackPicker() {
  const router = useRouter();

  function choose(track: Track) {
    setTrackCookie(track);
    router.push("/home");
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <button
        onClick={() => choose("grad")}
        className="rounded-[var(--radius-site)] border border-green-900 bg-green-900 px-8 py-4 text-left text-paper transition-colors hover:bg-green-700"
      >
        <span className="block font-heading text-lg font-semibold">
          Graduate section
        </span>
        <span className="block text-sm text-paper/80">MIS 6361</span>
      </button>
      <button
        onClick={() => choose("undergrad")}
        className="rounded-[var(--radius-site)] border border-orange-700 bg-orange-700 px-8 py-4 text-left text-paper transition-colors hover:bg-orange-500"
      >
        <span className="block font-heading text-lg font-semibold">
          Undergraduate section
        </span>
        <span className="block text-sm text-paper/80">ENTP 4332 / ITSS 4332</span>
      </button>
    </div>
  );
}
