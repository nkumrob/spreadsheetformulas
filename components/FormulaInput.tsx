"use client";

/** Shared mono textarea styled like an oversized formula bar, used by both tools. */
export function FormulaInput({
  value,
  onChange,
  placeholder,
  label,
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-rule bg-white shadow-lift focus-within:border-ledger">
      <div className="flex items-center gap-2 border-b border-rule px-4 py-2">
        <span aria-hidden="true" className="select-none font-display text-lg italic leading-none text-ledger">
          fx
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">{label}</span>
      </div>
      <label className="sr-only" htmlFor={`formula-input-${label}`}>
        {label}
      </label>
      <textarea
        id={`formula-input-${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        spellCheck={false}
        autoComplete="off"
        className="w-full resize-y bg-transparent px-4 py-3 font-mono text-[15px] leading-relaxed text-ink outline-none placeholder:text-ink-faint"
      />
    </div>
  );
}
