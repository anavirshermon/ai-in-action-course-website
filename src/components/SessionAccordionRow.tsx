"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronIcon } from "./ChevronIcon";
import { renderInlineMarkdown, stripMarkdownBold } from "@/lib/content/inline-markdown";

export type ReadingView =
  | { kind: "handbook"; parts: { number: number; title: string; slug: string }[] }
  | { kind: "external"; label: string; url: string }
  | { kind: "text"; label: string };

export type SessionAccordionRowProps = {
  number: number;
  date: string;
  topic: string;
  due: string;
  border: string;
  dim: boolean;
  isCurrent: boolean;
  concept: string;
  lab: string | null;
  buildTechnique: string | null;
  readingsNote: string | null;
  readings: ReadingView[];
  assignmentSlug: string | null;
};

export function SessionAccordionRow(props: SessionAccordionRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`border-l-4 ${props.border} ${props.dim ? "opacity-50" : ""}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-surface"
      >
        <span className="w-14 shrink-0 text-sm text-ink-soft">{props.date}</span>
        <span className="w-16 shrink-0 font-heading text-lg text-ink">
          S{props.number}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-base text-ink">
            {renderInlineMarkdown(props.topic)}
            {props.isCurrent && (
              <span className="ml-2 text-xs font-normal uppercase tracking-wide text-ink-soft">
                this week
              </span>
            )}
          </p>
          {props.due && (
            <p className="mt-1 inline-block rounded-full bg-ink px-2.5 py-0.5 text-xs font-medium text-bg">
              Due: {stripMarkdownBold(props.due)}
            </p>
          )}
        </div>
        <ChevronIcon
          className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-90" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-line/60 bg-surface/30 px-4 py-5 pl-[4.5rem]">
          {props.assignmentSlug && (
            <Link
              href={`/resources/assignments#${props.assignmentSlug}`}
              className="mb-4 inline-block text-sm text-ink-soft underline"
            >
              View assignment details →
            </Link>
          )}

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
              What we cover
            </h3>
            <p className="mt-1 text-sm text-ink-soft">{renderInlineMarkdown(props.concept)}</p>
          </div>

          {props.buildTechnique && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                Build technique
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                {renderInlineMarkdown(props.buildTechnique)}
              </p>
            </div>
          )}

          {props.lab && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                In class
              </h3>
              <p className="mt-1 text-sm text-ink-soft">{renderInlineMarkdown(props.lab)}</p>
            </div>
          )}

          {props.readings.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">
                Before class
              </h3>
              {props.readingsNote && (
                <p className="mt-1 text-sm italic text-ink-soft">{props.readingsNote}</p>
              )}
              <ul className="mt-1 list-inside list-disc text-sm text-ink-soft">
                {props.readings.map((r, i) => (
                  <li key={i}>
                    {r.kind === "handbook" &&
                      r.parts.map((p, pi) => (
                        <span key={p.slug}>
                          {pi > 0 && ", "}
                          <Link
                            href={`/resources/handbook#${p.slug}`}
                            className="underline hover:text-ink"
                          >
                            Part {p.number}: {p.title}
                          </Link>
                        </span>
                      ))}
                    {r.kind === "external" && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-ink"
                      >
                        {r.label}
                      </a>
                    )}
                    {r.kind === "text" && r.label}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Link
            href={`/sessions/${props.number}`}
            className="mt-5 inline-block text-sm text-ink underline"
          >
            Full session details →
          </Link>
        </div>
      )}
    </div>
  );
}
