"use client";

import { useState } from "react";

type SidebarPart = { number: number; title: string; slug: string };
type SidebarSection = { title: string; parts: SidebarPart[] };

export function HandbookSidebar({ sections }: { sections: SidebarSection[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  return (
    <>
      {/* Mobile / tablet: a jump-to-part select instead of the full sidebar,
          which would otherwise leave almost no room for the prose below lg. */}
      <div className="lg:hidden">
        <label className="sr-only" htmlFor="handbook-jump">
          Jump to part
        </label>
        <select
          id="handbook-jump"
          defaultValue=""
          onChange={(e) => {
            if (e.target.value) window.location.hash = e.target.value;
          }}
          className="w-full rounded-[var(--radius-site)] border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-green-700"
        >
          <option value="" disabled>
            Jump to a part…
          </option>
          {sections.map((section) => (
            <optgroup key={section.title} label={section.title}>
              {section.parts.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.number}. {p.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Desktop: full searchable sidebar */}
      <nav className="sticky top-24 hidden w-64 shrink-0 self-start lg:block">
        <input
          type="search"
          placeholder="Find a part…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-[var(--radius-site)] border border-line bg-paper px-3 py-1.5 text-sm outline-none focus:border-green-700"
        />
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
          {sections.map((section) => {
            const visibleParts = section.parts.filter(
              (p) => !q || p.title.toLowerCase().includes(q) || String(p.number).includes(q)
            );
            if (visibleParts.length === 0) return null;

            return (
              <div key={section.title} className="mb-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                  {section.title}
                </p>
                <ul className="mt-1 space-y-1">
                  {visibleParts.map((p) => (
                    <li key={p.slug}>
                      <a
                        href={`#${p.slug}`}
                        className="block rounded px-1.5 py-0.5 text-sm text-ink hover:bg-paper-dim/60"
                      >
                        {p.number}. {p.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
