"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
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

export function NavBar() {
  const track = useSyncExternalStore(subscribe, readTrackCookieClient, getServerSnapshot);
  const router = useRouter();

  function choose(next: Track) {
    setTrackCookie(next);
    emitChange();
    router.refresh();
  }

  return (
    <div className="sticky top-4 z-50 flex justify-center px-4">
      <nav className="flex w-full max-w-4xl items-center justify-between gap-6 rounded-[var(--radius-site)] border border-line/70 bg-paper/70 px-5 py-3 shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-md">
        <Link
          href="/"
          className="font-heading text-sm font-semibold tracking-tight text-green-900"
        >
          ENTP 6314
        </Link>

        <div className="hidden items-center gap-6 text-sm text-ink-soft sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {track && (
          <div className="flex items-center gap-1 rounded-full border border-line/70 bg-paper-dim/60 p-0.5 text-xs">
            <button
              onClick={() => choose("grad")}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                track === "grad"
                  ? "bg-green-900 text-paper"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Grad
            </button>
            <button
              onClick={() => choose("undergrad")}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                track === "undergrad"
                  ? "bg-green-900 text-paper"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              UG
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
