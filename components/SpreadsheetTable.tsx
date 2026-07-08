import type { SampleTable } from "@/lib/schema";

const COLUMN_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function isNumeric(value: string): boolean {
  return value !== "" && !Number.isNaN(Number(value.replace(/[%,$]/g, "")));
}

/**
 * Renders sample data as a real mini-spreadsheet: column letters, row
 * numbers, a header row, and an optional tinted result column. This is
 * the visual signature of the site — examples look like the tool itself.
 */
export function SpreadsheetTable({ table, caption }: { table: SampleTable; caption: string }) {
  const highlight = table.highlightColumn;

  return (
    <figure className="min-w-0">
      <figcaption className="mb-2 flex items-center gap-2">
        <span
          className={`inline-block h-2 w-2 rounded-[2px] ${
            caption.toLowerCase().includes("result") ? "bg-ledger" : "bg-ink-faint"
          }`}
          aria-hidden="true"
        />
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-faint">
          {caption}
        </span>
      </figcaption>
      <div className="overflow-x-auto rounded-lg border border-rule bg-white shadow-bar">
        <table className="w-full border-collapse text-[13px] leading-tight">
          <thead>
            <tr>
              <th className="w-8 border-b border-r border-rule bg-cream/80 p-0" aria-hidden="true" />
              {table.columns.map((_, i) => (
                <th
                  key={i}
                  scope="col"
                  aria-hidden="true"
                  className="border-b border-r border-rule bg-cream/80 px-3 py-1 text-center font-mono text-[11px] font-medium text-ink-faint last:border-r-0"
                >
                  {COLUMN_LETTERS[i]}
                </th>
              ))}
            </tr>
            <tr>
              <th
                scope="row"
                className="border-b border-r border-rule bg-cream/80 px-2 py-1.5 text-center font-mono text-[11px] font-medium text-ink-faint"
              >
                1
              </th>
              {table.columns.map((column, i) => (
                <th
                  key={column + i}
                  scope="col"
                  className={`border-b border-r border-rule px-3 py-1.5 text-left font-sans font-semibold last:border-r-0 ${
                    highlight === i ? "bg-ledger-tint text-ledger-deep" : "text-ink"
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                <th
                  scope="row"
                  className="border-b border-r border-rule bg-cream/80 px-2 py-1.5 text-center font-mono text-[11px] font-medium text-ink-faint"
                >
                  {r + 2}
                </th>
                {row.map((cell, c) => {
                  const error = cell.startsWith("#");
                  return (
                    <td
                      key={c}
                      className={`border-b border-r border-rule px-3 py-1.5 last:border-r-0 ${
                        highlight === c ? "bg-ledger-tint/60 font-medium text-ledger-deep" : "text-ink-soft"
                      } ${error ? "font-mono text-[12px] font-semibold !text-rust" : ""} ${
                        !error && isNumeric(cell) ? "tabular text-right font-mono text-[12.5px]" : ""
                      }`}
                    >
                      {cell === "" ? " " : cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
