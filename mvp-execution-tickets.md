# Spreadsheet Formulas — MVP Execution Ticket List

Derived from `prd.md` (master PRD). Scope is strictly the MVP defined in PRD §9, §22, and §26 — everything else (AI generator, converter, optimizer, accounts, payments, team workspace) is explicitly out of scope for these tickets.

**Stack (per PRD §25):** Next.js (App Router) + Tailwind CSS + MDX content + Plausible or PostHog + ConvertKit/Beehiiv + Vercel. No database needed for MVP — MDX files are the content store. Supabase/Postgres deferred until accounts/payments.

**Sizing:** S = ≤ half day · M = 1–2 days · L = 3–5 days

---

## Milestones

| Milestone | Epics | Exit criteria |
|---|---|---|
| M1: Skeleton | E0, E1 | Deployed site renders one real formula page from MDX with copy button |
| M2: Library | E2, E3, E4 | Search, categories, templates, error pages all working with seed content |
| M3: Tools + Growth | E5, E6, E7 | Homepage, explainer/fixer, newsletter, analytics live |
| M4: Content + Launch | E8, E9 | 50 formula pages, 10 error pages, 5 templates published; §26 checklist passes |

Content production (E8) starts in parallel from M1 — it is the long pole.

---

## Epic 0 — Project Foundation

### SF-001 · Initialize project scaffold — **S**
Next.js (App Router, TypeScript) + Tailwind. ESLint, Prettier, Vitest + React Testing Library, Playwright for e2e. Git repo with CI running lint + tests on every push.
- **AC:** `npm run dev`, `lint`, `test`, `build` all pass on a clean clone; CI green.
- **Depends on:** —

### SF-002 · Deployment pipeline — **S**
Vercel (or equivalent) with preview deploys per PR, production on main. Domain + SSL connected.
- **AC:** Merging to main auto-deploys production; PRs get preview URLs.
- **Depends on:** SF-001

### SF-003 · Base layout and design system — **M**
App shell: header with nav (Formulas, Templates, Tools, Categories), footer, mobile menu. Typography, color tokens, code-block styling for formulas. Design bar: clean, Linear/Airbnb-level polish — no generic AI-slop layout.
- **AC:** Shell is responsive at 320px–1440px; Lighthouse accessibility ≥ 95 on the shell.
- **Depends on:** SF-001

---

## Epic 1 — Content Model & Formula Pages

### SF-010 · Formula content model + MDX pipeline — **M**
MDX collection with frontmatter schema (PRD §25): id, title, slug, category, subcategory, platform, difficulty, problem statement, quick formula, excelFormula, sheetsFormula, sample input/output tables, common mistakes, related formula slugs, related templates, SEO title/description, published, lastReviewed. Build-time validation that fails the build on missing required fields or broken related-formula slugs.
- **AC:** Adding a valid `.mdx` file publishes a page at `/formulas/[slug]`; invalid frontmatter fails the build with a clear error; `published: false` pages don't render or appear in sitemap.
- **Depends on:** SF-001

### SF-011 · Formula page template — **L**
Renders all required sections (PRD §10): problem description, quick formula, example input table, expected output table, Excel + Google Sheets versions, plain-English explanation, step-by-step breakdown, when to use, common mistakes, related formulas. Answer (quick formula) must appear above the fold.
- **AC:** A fully-populated MDX file renders every §10 section in order; tables are accessible (proper `<th>`/scope); page is mobile-responsive.
- **Depends on:** SF-003, SF-010

### SF-012 · Copy formula button — **S**
One-click copy on every formula block; shows "Formula copied." confirmation. Fires analytics event.
- **AC:** Works in Chrome, Safari, Firefox, Edge, and iOS Safari (Playwright + manual check); confirmation appears and clears; keyboard-accessible.
- **Depends on:** SF-011

### SF-013 · Platform toggle / labels — **M**
When Excel and Sheets formulas differ, a toggle switches versions. When identical, show: "This formula works in both Excel and Google Sheets." Persist the user's platform preference in localStorage.
- **AC:** Toggle state persists across pages; identical-formula pages show the both-platforms message and no toggle.
- **Depends on:** SF-011

### SF-014 · Formula feedback widget — **M**
Three options per PRD §18: "This worked" / "This did not work" / "I need help adapting it." Stored via a lightweight API route (Vercel KV or simple log-to-analytics event) — no auth, rate-limited.
- **AC:** Each vote records page slug + option; one vote per page per visitor (localStorage guard); thank-you state after voting.
- **Depends on:** SF-011

### SF-015 · SEO infrastructure — **M**
Per-page unique title/description from frontmatter, canonical URLs, OpenGraph tags, `sitemap.xml`, `robots.txt`, HowTo/FAQ schema markup on formula pages, internal links via related formulas.
- **AC:** Every published page has unique metadata; sitemap includes all published pages only; schema validates in Google Rich Results test.
- **Depends on:** SF-010, SF-011

---

## Epic 2 — Categories & Navigation

### SF-020 · Category pages — **M**
11 category pages (PRD §9): Lookup & Matching, Text Cleanup, Dates & Deadlines, Counting & Summarizing, Conditional Logic, Error Fixes, HR & Training, Finance & Business, Small Business, Google Sheets, Excel. Each lists its formulas with title, short description, platform label.
- **AC:** `/categories/[slug]` renders for all 11; formulas appear based on frontmatter category; empty categories show a "coming soon" state, not an error.
- **Depends on:** SF-010, SF-003

### SF-021 · Category index + breadcrumbs — **S**
`/categories` overview page; breadcrumbs on formula pages (Home › Category › Formula) with BreadcrumbList schema.
- **AC:** Breadcrumbs render and link correctly on every formula page.
- **Depends on:** SF-020

---

## Epic 3 — Search

### SF-030 · Search index — **M**
Build-time index over title, function names, error types, plain-English keywords, use case, category, platform (PRD §11). Client-side fuzzy search (e.g. Pagefind, Fuse.js, or FlexSearch) — no server needed at MVP scale.
- **AC:** Queries from PRD §11 ("compare two columns", "xlookup", "fix #N/A", "split full name", "training completion percentage") each return the correct page in the top 3 results.
- **Depends on:** SF-010

### SF-031 · Search UI — **M**
Search bar in header + large homepage search. Results show title, short description, category, platform, formula type, and related template if available. Keyboard navigation, empty-state with suggested popular searches.
- **AC:** Results render in <100ms after typing stops; searches fire an analytics event with the query; zero-result state suggests categories.
- **Depends on:** SF-030, SF-003

---

## Epic 4 — Error-Fix Pages & Templates

### SF-040 · Error-fix page type — **M**
Variant of the formula page for error pages (#N/A, #VALUE!, #REF!, #DIV/0!, #NAME?, #SPILL!, parse errors, etc.): what the error means, common causes, fix per cause, prevention, related formulas.
- **AC:** `/errors/[slug]` renders the error page structure; error pages appear in search and the Error Fixes category.
- **Depends on:** SF-010, SF-011

### SF-041 · Template library pages — **M**
`/templates` index + `/templates/[slug]` detail pages per PRD §12: what it does, who it's for, included formulas, preview image or sample table, download button, related formula tutorials.
- **AC:** Template pages render all §12 sections; related tutorials cross-link both ways.
- **Depends on:** SF-010, SF-003

### SF-042 · Template download delivery — **S**
Serve .xlsx and Google Sheets copy-link per template. Download click fires analytics event. Files versioned in the repo (or blob storage) so links never 404.
- **AC:** Downloads work on desktop + mobile; every download recorded; no broken links (checked in CI).
- **Depends on:** SF-041

---

## Epic 5 — Basic Tools (MVP-light versions)

Per PRD §9 the MVP needs a *basic* explainer and *basic* fixer. Recommendation: single LLM-backed API route with guardrails powering both, plus deterministic pre-checks. No accounts; IP-based rate limiting.

### SF-050 · Formula parser + deterministic checks — **M**
Shared utility: tokenize a formula, detect mismatched parentheses, smart/curly quotes, wrong argument separators, known error values, missing VLOOKUP exact-match argument, obvious range mismatches. Pure functions, fully unit-tested — this is the trust layer before any AI output.
- **AC:** Unit tests cover each detection rule with pass/fail fixtures, including the PRD §8 example (`=VLOOKUP(A2,Sheet2!A:B,2)` → suggest `,FALSE` and XLOOKUP alternative).
- **Depends on:** SF-001

### SF-051 · Basic Formula Explainer tool — **L**
`/tools/explain-formula`: paste a formula → plain-English explanation of what it does, each part, ranges involved, and what happens when no result is found (PRD Tool 3, basic tier). Platform selector. LLM route with prompt guardrails + disclaimer ("verify before using in important work"). Deterministic checks from SF-050 run first and are shown as warnings.
- **AC:** The PRD §8 INDEX/MATCH example produces a correct explanation; malformed input gets a helpful error, not a crash; rate limit returns a friendly message; output includes disclaimer.
- **Depends on:** SF-050, SF-003

### SF-052 · Basic Formula Fixer tool — **L**
`/tools/fix-formula`: paste a broken formula (+ optional error message) → likely problem, why it happens, corrected formula, safer modern alternative, link to the relevant error-fix page (PRD Tool 2, basic tier).
- **AC:** Handles the §13 supported-issue list at least via deterministic rules for the top 6 issues; every response links a relevant `/errors/` page when an error value is mentioned; copy button on corrected formula.
- **Depends on:** SF-050, SF-040, SF-051 (shares the LLM route)

### SF-053 · Tool abuse controls — **S**
Rate limiting per IP, input length caps, prompt-injection hardening on the LLM route, error reporting hook ("report a wrong answer").
- **AC:** Requests over limit get 429 with friendly UI; 10KB+ input rejected; reports land in analytics.
- **Depends on:** SF-051

---

## Epic 6 — Homepage

### SF-060 · Homepage — **L**
Per PRD §16: hero ("Solve Spreadsheet Problems Faster" + subhead), CTAs (Find a Formula / Fix My Formula / Generate a Formula*), large search bar, popular categories, common problems, tool previews, featured templates, Excel vs Sheets section, recently added formulas, newsletter signup, trust message. (*Generate CTA links to a waitlist page — SF-072 — since the generator is post-MVP.)
- **AC:** All §16 sections present; hero search works; recently-added list is driven by frontmatter dates, not hardcoded; passes mobile QA.
- **Depends on:** SF-031, SF-041, SF-051

---

## Epic 7 — Growth Infrastructure

### SF-070 · Newsletter signup — **M**
ConvertKit/Beehiiv/Resend integration. Embedded form on homepage, formula pages (footer slot), and template pages. Double opt-in, success/error states, signup analytics event.
- **AC:** Test signup arrives in the email platform; duplicate submissions handled gracefully; form is keyboard-accessible.
- **Depends on:** SF-003

### SF-071 · Analytics + event tracking — **M**
Plausible or PostHog. Track (PRD §18): page views, search queries, formula copy clicks, template downloads, tool usage, newsletter signups, feedback ratings. Define the event schema once; all components fire through one tracking helper.
- **AC:** Each of the 7 event types visible in the analytics dashboard from a test session; no PII in events; script doesn't block page render.
- **Depends on:** SF-001 (helper), consumed by SF-012/031/042/051/070

### SF-072 · AI tools waitlist page — **S**
Landing page for post-MVP AI tools (generator, converter, optimizer) with email capture — feeds the Post-Launch plan in PRD §22.
- **AC:** Signup stored with a `waitlist` tag in the email platform.
- **Depends on:** SF-070

---

## Epic 8 — Content Production (parallel track, starts at M1)

Every formula must be tested in a real Excel and Google Sheets file before publishing (PRD §10 quality standard). Track tested-status in frontmatter (`lastReviewed`).

### SF-080 · Content templates + style guide — **M**
Author guide: voice, structure per §10, sample-data conventions (named example columns like Department/Due Date/Status), platform-difference rules, SEO title patterns. Plus one gold-standard example page ("Count overdue tasks by department").
- **AC:** Gold-standard page published and used as the reference for all content tickets.
- **Depends on:** SF-010

### SF-081–085 · Formula pages, 5 batches of 10 — **L each**
Batched from the PRD §17 launch list of 50:
- **SF-081:** Lookup & matching (topics 1–7) + counting (8–10)
- **SF-082:** Dates & deadlines (11–15) + text extraction (16–20)
- **SF-083:** Text cleanup + blanks + highlighting (21–26) + summarizing (27–29, 35)
- **SF-084:** Status logic & records (30–34) + finance (36–40)
- **SF-085:** HR/training & scores (41–46) — remaining 4 slots covered by SF-086 error topics 47–50
- **AC per batch:** 10 pages published; every formula verified in both Excel and Google Sheets with the page's own sample data; frontmatter complete; related-formula links set.
- **Depends on:** SF-080, SF-011

### SF-086 · 10 error-fix pages — **L**
#N/A, #VALUE!, #REF!, #DIV/0!, #NAME?, #SPILL!, #NUM!, circular reference, Google Sheets formula parse error, VLOOKUP returns wrong value.
- **AC:** 10 pages published in the error page type; each reproduced and fixed in a real spreadsheet before publishing.
- **Depends on:** SF-080, SF-040

### SF-087 · 5 launch templates — **L**
Training compliance tracker, budget tracker, invoice tracker, project task tracker, job application tracker (top 5 from PRD §12). Each: working .xlsx + Google Sheets version, template page, cross-links to related formula pages.
- **AC:** All formulas inside templates work in both platforms; download + copy-link verified; template pages complete per §12.
- **Depends on:** SF-080, SF-041, SF-042

---

## Epic 9 — QA & Launch

### SF-090 · Cross-browser + mobile QA pass — **M**
Playwright suite for critical paths (search → formula page → copy; template download; explainer; newsletter signup) across Chromium/WebKit/Firefox + mobile viewports. Manual pass on real iOS/Android for clipboard behavior.
- **AC:** e2e suite green in CI; clipboard verified on real devices; no horizontal scroll on any page at 320px.
- **Depends on:** M2 + M3 complete

### SF-091 · SEO/launch audit — **M**
Verify PRD §26 acceptance criteria 1–14 one by one. Check: unique metadata on all pages, sitemap submitted to Search Console, schema validates, Core Web Vitals pass, no broken internal links (CI link checker), analytics events firing in production.
- **AC:** Signed-off §26 checklist in the repo; Lighthouse ≥ 90 performance / ≥ 95 SEO & accessibility on formula pages.
- **Depends on:** SF-090, all E8 content

### SF-092 · Launch — **S**
Production content freeze, final smoke test, submit sitemap, announce, enable post-launch dashboards (top searches, zero-result queries, high-bounce pages) to drive the PRD §22 post-launch loop.
- **AC:** Site live on production domain; §22 post-launch tracking views exist.
- **Depends on:** SF-091

---

## Dependency-ordered build sequence (single developer)

1. SF-001 → SF-002 → SF-003 (foundation)
2. SF-010 → SF-011 → SF-012/013/014/015 (formula pages) — **start SF-080 content track here**
3. SF-020/021 → SF-030/031 (categories, search)
4. SF-040 → SF-041/042 (errors, templates)
5. SF-050 → SF-051 → SF-052/053 (tools)
6. SF-070/071/072 → SF-060 (growth, then homepage last so it showcases real features)
7. SF-090 → SF-091 → SF-092 (QA, launch)

Rough engineering total: ~30–40 dev-days, plus the content track (~15–20 days) running in parallel. With one developer + one content author, MVP launch lands in roughly 8 weeks.

## Explicitly deferred (do not build in MVP)

AI formula generator · Excel↔Sheets converter · formula optimizer · conditional formatting generator · problem solver · template builder · sandbox · upload analyzer · regex/Power Query/Apps Script/VBA helpers · user accounts · saved formulas · Stripe/payments · premium templates · team workspace · CMS admin UI (MDX in repo is the admin interface for MVP).
