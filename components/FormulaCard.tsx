import Link from "next/link";
import type { Formula } from "@/lib/schema";
import { formulaPath } from "@/lib/paths";
import { getCategory } from "@/lib/categories";

/** Compact formula listing used on the homepage, category pages, and the index. */
export function FormulaCard({ formula, index }: { formula: Formula; index?: number }) {
  const category = getCategory(formula.category);
  const isError = formula.kind === "error-fix";

  return (
    <Link
      href={formulaPath(formula)}
      className="group flex h-full flex-col rounded-lg border border-rule bg-white p-5 shadow-bar transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-faint hover:shadow-lift"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-medium ${
            isError ? "bg-rust-tint text-rust" : "bg-ledger-tint text-ledger-deep"
          }`}
        >
          {isError ? "error fix" : category?.name.toLowerCase() ?? formula.category}
        </span>
        {typeof index === "number" ? (
          <span className="font-mono text-[11px] text-ink-faint" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </div>
      <h3 className="text-[16px] font-semibold leading-snug text-ink transition-colors group-hover:text-ledger-deep">
        {formula.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-ink-soft">
        {formula.description}
      </p>
      <code className="mt-auto block overflow-hidden text-ellipsis whitespace-nowrap pt-4 font-mono text-[12.5px] text-ink-faint">
        {formula.quickFormula}
      </code>
    </Link>
  );
}
