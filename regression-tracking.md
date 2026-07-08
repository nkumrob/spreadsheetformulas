# Regression Tracking — Spreadsheet Formulas

Log every bug found, its root cause, the fix, and the test added to prevent recurrence.

| Date | Ticket | Bug | Root cause | Fix | Guard test |
|---|---|---|---|---|---|
| 2026-07-08 | SF-010 | Build failed: schema rejected valid single-step formula (TRIM) | steps min(2) was over-constrained for one-part formulas | Relaxed to min(1) in lib/schema.ts | tests/content.test.ts validates every entry against the schema |
| 2026-07-08 | SF-001 | `next build` type error TS2882 on `import "./globals.css"` | TypeScript 5.9 now checks side-effect imports; Next 14 types only declare `*.module.css` | Added `types/globals.d.ts` with `declare module "*.css"` | Build in CI catches recurrence |
| 2026-07-08 | SF-001 | TS2554: `useRef<T>()` requires an initial argument | React 18 types + TS 5.9 tightened the zero-arg overload | Pass explicit `undefined` initial value in CopyButton/SearchClient | Build in CI catches recurrence |
| 2026-07-08 | SF-090 | First screenshot run captured a different website | Port 3000 already serves another local app; helper only waits for port readiness | Ran `next start` on port 4123 | Noted in claude-memories.md: never use port 3000 on this machine |
| 2026-07-08 | SF-030 | "countifs" search buried the dedicated COUNTIFS tutorial once HR pages landed | Max-per-token weighting + alphabetical tiebreak can't distinguish dedicated tutorials from applied use-cases | Summed field weights + primary-function boost + seoTitle-prefix boost in lib/search.ts | tests/search.test.ts "ranks title matches" + function-name assertions |
| 2026-07-08 | SF-087 | Template date math would return #VALUE! in generated .xlsx | Dates written as ISO strings, not date objects, so =C2+D2 was string arithmetic | scripts/build_templates.py writes datetime.date values | Caught pre-generation in review; e2e verifies download integrity |
| 2026-07-08 | SF-060 | Homepage horizontally scrolled at 375px after adding template rail | Grid items default to min-width:auto; nowrap `<code>` inside FormulaCard forced column width | Added min-w-0 to FormulaCard link | scripts/e2e_smoke.py "mobile no horizontal scroll" check |
| 2026-07-08 | verify-L1 | Engine returned "Not found"/#NAME? for correct VLOOKUP formulas | HyperFormula doesn't parse bare TRUE/FALSE literals; IFERROR masked the #NAME? into plausible output | Harness registers TRUE/FALSE as named expressions so page formulas run verbatim | 52 engine-execution tests would fail on recurrence |
| 2026-07-08 | verify-L1 | Build broke with matchAll iteration type error after adding harness | tsconfig had no explicit target; test files entering the type graph exposed ES5 default | Added "target": "ES2017" to tsconfig | next build in the standard gate |
| 2026-07-08 | content | fix-circular-reference sample showed circular refs producing #REF! | Content inaccuracy: Excel shows 0 plus a warning for circular references, not #REF! | Corrected sample cell to "0 + warning" | Engine harness now pins the corrected formula's real output |
