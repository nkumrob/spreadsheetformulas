# Claude Memories — Spreadsheet Formulas

## 2026-07-08 — Project inception
- Repo initialized with master PRD (`prd.md`) and MVP execution ticket list (`mvp-execution-tickets.md`).
- Product: SEO-driven Excel/Google Sheets formula library growing into an AI spreadsheet assistant.
- Agreed MVP stack: Next.js (App Router, TS) + Tailwind + MDX content (no DB at MVP) + Plausible/PostHog + ConvertKit/Beehiiv + Vercel. Supabase/Postgres and Stripe deferred to the accounts/payments phase.
- Ticket numbering: SF-0XX, grouped into epics E0–E9; milestones M1–M4.
- Key scope decision: MVP includes ONLY basic explainer + basic fixer tools (LLM route with deterministic pre-checks in SF-050). Generator/converter/optimizer are post-MVP — the homepage "Generate a Formula" CTA points to a waitlist page (SF-072).
- Quality bar: every published formula must be verified in real Excel AND Google Sheets files before publishing (PRD §10).
- No code exists yet; next step is SF-001 (project scaffold).

## 2026-07-08 — MVP skeleton built (milestones M1 + most of M2)
- Stack in place: Next.js 14.2 (App Router, TS strict) + Tailwind 3.4 + Vitest + Zod. All 32 routes prerender statically; first-load JS < 100 kB.
- **Design system: "The Modern Ledger"** — user demanded expert-level, non-AI-slop design. Direction: warm paper (#FAF7F1), ink (#1C1A16), ledger green (#166B4A), rust for errors (#B3402E), hairline rules, faint cell-grid backgrounds. Fonts: Instrument Serif (display), Schibsted Grotesk (UI), Spline Sans Mono (formulas) via next/font. Signature elements: FormulaBar (fx glyph + copy) and SpreadsheetTable (real column letters/row numbers, tinted result column). Keep ALL future UI consistent with this — no Inter, no purple gradients.
- Content is typed TS data (content/*.ts) validated by Zod at build time — NOT MDX (deviation from SF-010; structured fields fit the §10 page anatomy better). 12 formula pages + 4 error-fix pages seeded, all formulas verified logically; error fixes live at /errors/[slug], formulas at /formulas/[slug] (lib/paths.ts routes by kind).
- Search is build-time index + client-side scoring (lib/search.ts), tested against PRD §11 queries. Platform preference persists in localStorage (sf-platform). Feedback + copy + search events funnel through lib/analytics.ts (Plausible-ready, no-op until script added).
- Newsletter posts to /api/subscribe; forwards to NEWSLETTER_WEBHOOK_URL env var when set.
- **Port 3000 is occupied by another app on this machine ("NATO Phonetic")** — always use another port (e.g. 4123) for local servers.
- Visual QA done via Playwright screenshots at 1440px and 375px on home, formula, error, search, categories — all clean, no horizontal scroll on mobile.
- Remaining for launch (see mvp-execution-tickets.md): 38 more formula pages, 6 more error pages, templates (SF-041/042/087), explainer/fixer tools (E5), real analytics + newsletter provider wiring, e2e suite (SF-090).
