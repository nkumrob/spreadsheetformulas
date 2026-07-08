"use client";

import { useRouter } from "next/navigation";

/** The homepage search bar, styled as a spreadsheet formula bar. Submits to /search. */
export function HeroSearch() {
  const router = useRouter();

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("q");
    if (typeof query === "string" && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  }

  return (
    <form onSubmit={submit} role="search" aria-label="Search formulas">
      <div className="flex items-center gap-3 rounded-xl border border-rule bg-white py-2 pl-4 pr-2 shadow-lift transition-shadow focus-within:border-ledger">
        <span aria-hidden="true" className="select-none font-display text-xl italic leading-none text-ledger">
          fx
        </span>
        <span aria-hidden="true" className="h-7 w-px bg-rule" />
        <label htmlFor="hero-search" className="sr-only">
          Describe your spreadsheet problem
        </label>
        <input
          id="hero-search"
          name="q"
          type="search"
          placeholder="Describe your problem… e.g. count overdue tasks by department"
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-1.5 text-[15px] text-ink outline-none placeholder:text-ink-faint"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-ledger px-4 py-2.5 text-[13.5px] font-semibold text-paper transition-colors hover:bg-ledger-deep"
        >
          Find a formula
        </button>
      </div>
    </form>
  );
}
