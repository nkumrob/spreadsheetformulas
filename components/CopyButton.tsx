"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

export function CopyButton({ text, slug }: { text: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API unavailable (old browser / non-secure context) — fall back.
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    track("formula_copy", { slug });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className={`shrink-0 rounded-md border px-3 py-1.5 text-[13px] font-medium transition-colors duration-150 ${
        copied
          ? "border-ledger bg-ledger text-paper"
          : "border-rule bg-paper text-ink-soft hover:border-ink-faint hover:text-ink"
      }`}
    >
      {copied ? "Formula copied." : "Copy"}
    </button>
  );
}
