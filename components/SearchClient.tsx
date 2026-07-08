"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchFormulas, type SearchDoc } from "@/lib/search";
import { track } from "@/lib/analytics";

const SUGGESTIONS = ["compare two columns", "fix #N/A", "xlookup", "days overdue", "trim spaces"];

export function SearchClient({ index }: { index: SearchDoc[] }) {
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");
  const trackTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const results = useMemo(() => searchFormulas(index, query), [index, query]);

  // Debounced analytics so we log searches, not keystrokes.
  useEffect(() => {
    if (!query.trim()) return;
    clearTimeout(trackTimer.current);
    trackTimer.current = setTimeout(
      () => track("search_query", { query: query.trim(), results: String(results.length) }),
      800,
    );
    return () => clearTimeout(trackTimer.current);
  }, [query, results.length]);

  return (
    <div className="max-w-2xl pb-4">
      <div className="mt-8 flex items-center gap-3 rounded-xl border border-rule bg-white py-2 pl-4 pr-3 shadow-lift focus-within:border-ledger">
        <span aria-hidden="true" className="select-none font-display text-xl italic leading-none text-ledger">
          fx
        </span>
        <span aria-hidden="true" className="h-7 w-px bg-rule" />
        <label htmlFor="search-input" className="sr-only">Search formulas</label>
        <input
          id="search-input"
          type="search"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe your spreadsheet problem…"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-ink-faint"
        />
        {query ? (
          <span className="font-mono text-[12px] text-ink-faint tabular" aria-live="polite">
            {results.length} result{results.length === 1 ? "" : "s"}
          </span>
        ) : null}
      </div>

      {!query.trim() ? (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-[13px] text-ink-faint">Popular:</span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setQuery(s)}
              className="rounded-full border border-rule bg-white px-3 py-1 text-[13px] text-ink-soft shadow-bar transition-colors hover:border-ledger hover:text-ledger-deep"
            >
              {s}
            </button>
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-rule bg-cream/50 p-8 text-center">
          <p className="font-mono text-[15px] text-rust">#N/A — no match found</p>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-ink-soft">
            Try a shorter phrase or a function name, or browse the{" "}
            <Link href="/categories" className="font-medium text-ledger-deep hover:underline">categories</Link>.
          </p>
        </div>
      ) : (
        <ol className="mt-8 space-y-3">
          {results.slice(0, 12).map((result) => (
            <li key={result.slug}>
              <Link
                href={result.kind === "error-fix" ? `/errors/${result.slug}` : `/formulas/${result.slug}`}
                className="group block rounded-lg border border-rule bg-white p-5 shadow-bar transition-all hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-lift"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-[16px] font-semibold text-ink group-hover:text-ledger-deep">
                    {result.title}
                  </h2>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[10.5px] font-medium ${
                      result.kind === "error-fix" ? "bg-rust-tint text-rust" : "bg-ledger-tint text-ledger-deep"
                    }`}
                  >
                    {result.kind === "error-fix" ? "error fix" : result.categoryName.toLowerCase()}
                  </span>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-soft">{result.description}</p>
                {result.functions.length > 0 ? (
                  <p className="mt-2 font-mono text-[11.5px] text-ink-faint">{result.functions.join(" · ")}</p>
                ) : null}
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
