# Regression Tracking — Spreadsheet Formulas

Log every bug found, its root cause, the fix, and the test added to prevent recurrence.

| Date | Ticket | Bug | Root cause | Fix | Guard test |
|---|---|---|---|---|---|
| 2026-07-08 | SF-010 | Build failed: schema rejected valid single-step formula (TRIM) | steps min(2) was over-constrained for one-part formulas | Relaxed to min(1) in lib/schema.ts | tests/content.test.ts validates every entry against the schema |
| 2026-07-08 | SF-001 | `next build` type error TS2882 on `import "./globals.css"` | TypeScript 5.9 now checks side-effect imports; Next 14 types only declare `*.module.css` | Added `types/globals.d.ts` with `declare module "*.css"` | Build in CI catches recurrence |
| 2026-07-08 | SF-001 | TS2554: `useRef<T>()` requires an initial argument | React 18 types + TS 5.9 tightened the zero-arg overload | Pass explicit `undefined` initial value in CopyButton/SearchClient | Build in CI catches recurrence |
| 2026-07-08 | SF-090 | First screenshot run captured a different website | Port 3000 already serves another local app; helper only waits for port readiness | Ran `next start` on port 4123 | Noted in claude-memories.md: never use port 3000 on this machine |
