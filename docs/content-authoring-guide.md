# Content Authoring Guide — Spreadsheet Formulas

Every formula page is a TypeScript object validated by `lib/schema.ts` (Zod) at build time.
Read `content/lookup.ts` and `content/errors.ts` for gold-standard examples before writing.

## File format

```ts
import type { Formula } from "@/lib/schema";

export const <exportName>: Formula[] = [ /* entries */ ];
```

Keep every file under 500 lines. Wrap formula strings in **single quotes** since formulas
contain double quotes: `'=IF(A2=B2,"Match","Mismatch")'`.

## Schema constraints (build fails if violated)

| Field | Rule |
|---|---|
| slug | exact slug you were assigned, kebab-case |
| kind | `"formula"` or `"error-fix"` |
| title | ≥8 chars, Title Case, benefit-oriented, no "How to" prefix |
| seoTitle | 8–70 chars, includes "Excel" and/or "Google Sheets" where it fits |
| description | 40–170 chars, one sentence, plain English |
| category | one of: lookup-matching, text-cleanup, dates-deadlines, counting-summarizing, conditional-logic, error-fixes, finance-business, small-business, google-sheets, excel |
| difficulty | beginner / intermediate / advanced |
| functions | UPPERCASE function names used, e.g. `["COUNTIFS"]` |
| keywords | 4–6 lowercase search phrases real users would type |
| problem | ≥40 chars — the situation, second person, no function names needed |
| quickFormula | starts with `=`, the single best answer |
| excelFormula | starts with `=` |
| sheetsFormula | `null` when identical in both platforms; a different `=` formula ONLY when the platforms genuinely differ (e.g. TEXTSPLIT vs SPLIT, TEXTBEFORE vs REGEXEXTRACT) |
| explanation | ≥80 chars, 3–6 sentences, plain English, explains WHY it works and edge behavior |
| steps | ≥1 item, `{part, meaning}` — each argument/segment of the quick formula |
| whenToUse | ≥40 chars, concrete real-work scenarios |
| commonMistakes | ≥2 items, `{mistake, fix}` — real failure modes, each fix actionable, include corrected formulas where useful |
| sampleInput / sampleOutput | small tables; `columns` + `rows` (all rows same width — RECTANGULAR, validated); `highlightColumn` = zero-based index of result column in sampleOutput; ≤4 columns, 2–5 rows |
| related | 2–4 slugs from the canonical list below, never your own slug |
| lastReviewed | `"2026-07-08"` |
| published | `true` |

## Voice and quality bar

- Written for office workers, not programmers. Plain English, confident, zero fluff.
- Explain the WHY (e.g. "dates are numbers, so subtraction works").
- Every formula must be CORRECT for both Excel and Google Sheets (or split via sheetsFormula).
  Prefer widely-compatible functions; call out version requirements (Excel 365/2021) in
  explanation or mistakes when using UNIQUE, FILTER, TEXTSPLIT, XLOOKUP, LET, etc.
- Sample data people: Ana Torres, Ben Okafor, Cara Lim, Dana Cruz, Eli Ford. Departments/regions:
  Sales, Finance, Ops, East. Dates as `"2026-07-01"` style strings. Money as plain numbers.
- Error cells in sample tables render red automatically when the string starts with `#`.
- commonMistakes are the most valuable section — write the mistakes people actually make.

## Canonical slug list (for `related` cross-links)

Existing: compare-two-columns, vlookup-exact-match, xlookup-basic-example, index-match-lookup,
count-if-multiple-conditions, sum-if-multiple-conditions, calculate-completion-percentage,
calculate-days-overdue, flag-overdue-tasks, extract-first-name, remove-extra-spaces,
combine-first-and-last-name, fix-na-error, fix-value-error, fix-ref-error, fix-div0-error

New (being authored now): find-missing-values, remove-duplicates, count-duplicates,
count-if-status-complete, find-blanks, count-blanks, highlight-duplicates,
highlight-overdue-dates, calculate-days-remaining, calculate-percentage-change,
summarize-by-month, group-dates-by-month, rank-values, calculate-running-total,
pull-latest-record, extract-last-name, extract-email-domain, capitalize-names,
split-text-by-delimiter, create-pass-fail-status, create-status-multiple-conditions,
find-highest-value-by-category, find-lowest-value-by-category, calculate-budget-variance,
calculate-profit-margin, calculate-invoice-due-date, calculate-inventory-reorder-status,
calculate-sales-commission, track-job-applications, calculate-percentage-of-total,
calculate-weighted-average, calculate-years-between-dates, average-by-category,
count-unique-values, query-filter-and-sort, arrayformula-apply-to-column,
regexmatch-check-text-pattern, importrange-pull-data-between-sheets, sparkline-mini-chart-in-cell,
googlefinance-live-stock-price, filter-rows-by-condition, let-readable-formulas,
sequence-generate-numbers, sumproduct-conditional-math, switch-replace-nested-ifs,
pmt-loan-payment, xlookup-vs-vlookup, countif-vs-countifs, sumif-vs-sumifs,
calculate-sales-tax, calculate-discount-price, calculate-break-even-point,
iferror-catch-formula-errors, substitute-find-and-replace, extract-numbers-from-text,
fix-name-error, fix-spill-error, fix-num-error,
fix-circular-reference, fix-formula-parse-error, vlookup-returns-wrong-value

## Error-fix pages (kind: "error-fix", category: "error-fixes")

Follow `content/errors.ts` exactly: title "Fix the #X Error" style, quickFormula is the most
useful diagnostic or guarded formula, explanation covers what the error MEANS, steps cover the
repair path, mistakes cover wrong ways people "fix" it (e.g. blanket IFERROR).
