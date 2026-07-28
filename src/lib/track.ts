export type Track = "grad" | "undergrad";

export const TRACK_COOKIE = "entp6314-track";

export function parseTrack(value: string | undefined | null): Track | null {
  return value === "grad" || value === "undergrad" ? value : null;
}

/** Server-side read. Call from a page/component that needs the track value —
 * doing so opts just that subtree into dynamic rendering, not the whole site. */
export async function getTrack(): Promise<Track | null> {
  const { cookies } = await import("next/headers");
  const store = await cookies();
  return parseTrack(store.get(TRACK_COOKIE)?.value);
}

/** Client-side write. Path must be "/" or pages outside the writing route won't see it. */
export function setTrackCookie(track: Track) {
  document.cookie = `${TRACK_COOKIE}=${track}; path=/; max-age=31536000; samesite=lax`;
}

/** Client-side read, e.g. for the nav toggle on mount. */
export function readTrackCookieClient(): Track | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${TRACK_COOKIE}=([^;]*)`));
  return parseTrack(match?.[1]);
}
