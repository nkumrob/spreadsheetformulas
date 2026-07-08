import Link from "next/link";

/** The wordmark: a spreadsheet selection cursor (with fill handle) beside the name. */
export function Wordmark() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className="relative inline-block h-[18px] w-[22px]" aria-hidden="true">
        <span className="absolute inset-0 rounded-[3px] border-2 border-ledger bg-ledger-tint/50 cursor-blink" />
        <span className="absolute -bottom-[3px] -right-[3px] h-[7px] w-[7px] rounded-[1px] border border-paper bg-ledger" />
      </span>
      <span className="font-sans text-[17px] font-bold tracking-tight text-ink">
        Spreadsheet<span className="text-ledger">Formulas</span>
      </span>
    </span>
  );
}

const NAV = [
  { href: "/formulas", label: "Formulas" },
  { href: "/categories", label: "Categories" },
  { href: "/errors", label: "Error Fixes" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-page items-center justify-between px-5">
        <Link href="/" aria-label="Spreadsheet Formulas home" className="rounded-sm">
          <Wordmark />
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden rounded-md px-3 py-1.5 text-[14px] font-medium text-ink-soft transition-colors hover:bg-cream hover:text-ink sm:block"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/search"
            className="ml-1 flex items-center gap-2 rounded-md border border-rule bg-white px-3 py-1.5 text-[13px] text-ink-faint shadow-bar transition-colors hover:border-ink-faint hover:text-ink-soft"
          >
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.8" />
              <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <span className="hidden md:inline">Search formulas</span>
            <span className="md:hidden">Search</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
