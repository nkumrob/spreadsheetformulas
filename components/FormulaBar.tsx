import { CopyButton } from "./CopyButton";

/**
 * A formula rendered as a spreadsheet formula bar: the italic fx glyph,
 * the formula in mono, and a one-click copy button. The signature block
 * of the whole site — every formula on every page renders through this.
 */
export function FormulaBar({
  formula,
  slug,
  label,
}: {
  formula: string;
  slug: string;
  label?: string;
}) {
  return (
    <div>
      {label ? (
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          {label}
        </div>
      ) : null}
      <div className="flex items-center gap-3 rounded-lg border border-rule bg-white py-2.5 pl-4 pr-2.5 shadow-bar">
        <span
          aria-hidden="true"
          className="select-none font-display text-lg italic leading-none text-ledger"
        >
          fx
        </span>
        <span aria-hidden="true" className="h-6 w-px bg-rule" />
        <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-1 font-mono text-[15px] text-ink">
          {formula}
        </code>
        <CopyButton text={formula} slug={slug} />
      </div>
    </div>
  );
}
