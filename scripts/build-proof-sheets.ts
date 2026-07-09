/**
 * Generate a downloadable "proof sheet" .xlsx for every engine-verified page
 * (SEO Engine 4): the page's verification grid — real formulas included — as
 * a file users can open and re-run themselves. Run: npx tsx scripts/build-proof-sheets.ts
 */
import { mkdirSync, writeFileSync, readdirSync, unlinkSync } from "fs";
import { join } from "path";
import { allFormulas } from "../lib/content";
import { exportWorkbook, type ParsedWorkbook, type CellValue } from "../lib/workbook-analysis";

const OUT = join(__dirname, "..", "public", "proofs");
mkdirSync(OUT, { recursive: true });
for (const stale of readdirSync(OUT)) unlinkSync(join(OUT, stale));

let count = 0;
for (const formula of allFormulas) {
  if (!formula.verification) continue;
  const workbook: ParsedWorkbook = {
    sheets: Object.entries(formula.verification.sheets).map(([name, grid]) => ({
      name,
      values: grid.map((row) =>
        row.map((cell) => (typeof cell === "string" && cell.startsWith("=") ? null : (cell as CellValue))),
      ),
      formulas: grid.map((row) =>
        row.map((cell) => (typeof cell === "string" && cell.startsWith("=") ? cell : null)),
      ),
    })),
  };
  writeFileSync(join(OUT, `${formula.slug}.xlsx`), Buffer.from(exportWorkbook(workbook)));
  count++;
}
console.log(`proof sheets written: ${count}`);
