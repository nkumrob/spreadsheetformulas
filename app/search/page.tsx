import type { Metadata } from "next";
import { Suspense } from "react";
import { allFormulas } from "@/lib/content";
import { buildSearchIndex } from "@/lib/search";
import { SearchClient } from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search Formulas",
  description:
    "Search tested Excel and Google Sheets formulas by problem, function name, or error type — compare columns, fix #N/A, count overdue tasks, and more.",
};

export default function SearchPage() {
  // Index is built server-side at render and shipped as props — instant client-side search.
  const index = buildSearchIndex(allFormulas);

  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <header className="max-w-prose">
        <h1 className="font-display text-[44px] leading-tight text-ink">Search</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
          Search by problem (&quot;compare two columns&quot;), function (&quot;XLOOKUP&quot;), or
          error (&quot;#N/A&quot;).
        </p>
      </header>
      <Suspense>
        <SearchClient index={index} />
      </Suspense>
    </div>
  );
}
