import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-page flex-col items-start px-5 pt-24">
      <p className="font-mono text-[15px] font-semibold text-rust">#REF!</p>
      <h1 className="mt-3 font-display text-[44px] leading-tight text-ink">
        This page points at cells that don&apos;t exist.
      </h1>
      <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-soft">
        The page may have moved or never existed. Try searching for the formula instead.
      </p>
      <div className="mt-7 flex gap-3">
        <Link href="/search" className="rounded-lg bg-ledger px-4 py-2.5 text-[14px] font-semibold text-paper hover:bg-ledger-deep">
          Search formulas
        </Link>
        <Link href="/" className="rounded-lg border border-rule bg-white px-4 py-2.5 text-[14px] font-medium text-ink-soft shadow-bar hover:text-ink">
          Back home
        </Link>
      </div>
    </div>
  );
}
