# Claude Memories — Spreadsheet Formulas

## 2026-07-08 — Project inception
- Repo initialized with master PRD (`prd.md`) and MVP execution ticket list (`mvp-execution-tickets.md`).
- Product: SEO-driven Excel/Google Sheets formula library growing into an AI spreadsheet assistant.
- Agreed MVP stack: Next.js (App Router, TS) + Tailwind + MDX content (no DB at MVP) + Plausible/PostHog + ConvertKit/Beehiiv + Vercel. Supabase/Postgres and Stripe deferred to the accounts/payments phase.
- Ticket numbering: SF-0XX, grouped into epics E0–E9; milestones M1–M4.
- Key scope decision: MVP includes ONLY basic explainer + basic fixer tools (LLM route with deterministic pre-checks in SF-050). Generator/converter/optimizer are post-MVP — the homepage "Generate a Formula" CTA points to a waitlist page (SF-072).
- Quality bar: every published formula must be verified in real Excel AND Google Sheets files before publishing (PRD §10).
- No code exists yet; next step is SF-001 (project scaffold).
