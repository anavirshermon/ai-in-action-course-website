import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TRACK_COOKIE } from "@/lib/track";

// Returning visitors who already picked a track skip the landing picker.
// `?pick=1` is the escape hatch to see the landing page again deliberately.
export function proxy(request: NextRequest) {
  const hasTrack = request.cookies.get(TRACK_COOKIE)?.value;
  const bypass = request.nextUrl.searchParams.has("pick");

  if (hasTrack && !bypass) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
