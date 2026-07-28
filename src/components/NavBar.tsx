"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { type Track, readTrackCookieClient, setTrackCookie } from "@/lib/track";

const links = [
  { href: "/home", label: "Home" },
  { href: "/sessions", label: "Sessions" },
  { href: "/resources", label: "Resources" },
  { href: "/announcements", label: "Announcements" },
];

type Listener = () => void;
let listeners: Listener[] = [];

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function getServerSnapshot(): Track | null {
  return null;
}

function TrackToggle({ track, choose }: { track: Track; choose: (t: Track) => void }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-line/70 bg-paper-dim/60 p-0.5 text-xs">
      <button
        onClick={() => choose("grad")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          track === "grad" ? "bg-green-900 text-paper" : "text-ink-soft hover:text-ink"
        }`}
      >
        Grad
      </button>
      <button
        onClick={() => choose("undergrad")}
        className={`rounded-full px-2.5 py-1 transition-colors ${
          track === "undergrad" ? "bg-green-900 text-paper" : "text-ink-soft hover:text-ink"
        }`}
      >
        UG
      </button>
    </div>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-5 w-5">
      {open ? (
        <path
          d="M5 5L15 15M15 5L5 15"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M3 6H17M3 10H17M3 14H17"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export function NavBar() {
  const track = useSyncExternalStore(subscribe, readTrackCookieClient, getServerSnapshot);
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  function choose(next: Track) {
    setTrackCookie(next);
    emitChange();
    router.refresh();
  }

  return (
    <div className="sticky top-4 z-50 flex justify-center px-4">
      <div className="w-full max-w-4xl">
        <nav className="flex items-center justify-between gap-6 rounded-[var(--radius-site)] border border-line/70 bg-paper/70 px-5 py-3 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-md">
          <Link
            href="/"
            className="font-heading text-sm font-semibold tracking-tight text-green-900"
          >
            AI in Action
          </Link>

          <div className="hidden items-center gap-6 text-sm text-ink-soft sm:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-ink">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {track && (
              <div className="hidden sm:block">
                <TrackToggle track={track} choose={choose} />
              </div>
            )}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="text-ink-soft sm:hidden"
            >
              <MenuIcon open={mobileOpen} />
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div className="mt-2 flex flex-col gap-1 rounded-[var(--radius-site)] border border-line/70 bg-paper/95 p-3 text-sm shadow-sm backdrop-blur-md sm:hidden">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-md px-3 py-2 text-ink-soft transition-colors hover:bg-paper-dim/60 hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
            {track && (
              <div className="px-3 py-2">
                <TrackToggle track={track} choose={choose} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
