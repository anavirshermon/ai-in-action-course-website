"use client";

import { useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

export function PromptBlock({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="relative my-4 rounded-[var(--radius-site)] border border-green-700 bg-green-900/5">
      <button
        onClick={copy}
        className="absolute right-2 top-2 rounded-md border border-green-700 bg-paper px-2 py-1 text-xs text-green-900 transition-colors hover:bg-green-900 hover:text-paper"
      >
        {copied ? "Copied" : "Copy"}
      </button>
      <pre className="overflow-x-auto whitespace-pre-wrap p-4 pr-16 text-sm text-ink">{text}</pre>
    </div>
  );
}

const components: Components = {
  code(props) {
    const { className, children, ...rest } = props;
    const isPrompt = /language-prompt/.test(className ?? "");
    const text = String(children).replace(/\n$/, "");

    if (isPrompt) {
      return <PromptBlock text={text} />;
    }

    const isBlock = /language-/.test(className ?? "");
    if (isBlock) {
      return (
        <pre className="my-4 overflow-x-auto rounded-[var(--radius-site)] border border-line bg-paper-dim/60 p-4 text-sm">
          <code {...rest} className={className}>
            {children}
          </code>
        </pre>
      );
    }

    return (
      <code {...rest} className="rounded bg-paper-dim px-1 py-0.5 text-[0.9em]">
        {children}
      </code>
    );
  },
};

export function Markdown({ source }: { source: string }) {
  return (
    <div className="prose-site">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
