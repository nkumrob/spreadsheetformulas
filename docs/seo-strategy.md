# SEO Strategy — Spreadsheet Formulas

**Date:** July 2026 · **Goal:** large free organic traffic → tool usage → email → template sales.
**Evidence basis:** deep-research run (claims marked ✓ survived 3-vote adversarial verification; ~ = gathered but unverified due to run limits; ◇ = domain knowledge, verify before betting big).

---

## 1. The market reality we must build for

The classic 2015–2022 playbook — rank tutorial pages, collect clicks — is structurally decaying:

- ✓ An AI Overview on the SERP correlates with **58% lower CTR** for the #1 result on informational queries (Ahrefs, Dec 2023→Dec 2025 GSC data), and the erosion is **accelerating** (34.5% in Apr 2025 → 58% in Feb 2026).
- ✓ Position-1 CTR on AIO SERPs collapsed **7.3% → 1.6%**. Even informational queries *without* an AIO halved (7.6% → 3.9%) — users are also going to ChatGPT/Perplexity directly.
- ✓ If you're **not cited** in the AI Overview: **0.52% CTR** (down 65% YoY). If you **are cited**: 0.70% — a **~35% relative advantage**. Citation is now a ranking surface of its own.
- ✓ AIO prevalence is significant but volatile (6.5% → 24.6% → 15.7% of queries through 2025) and is spreading from informational (91%→57% of AIO triggers) into commercial/transactional queries.
- ~ Roughly **two-thirds of AIO SERPs still produce a click** (Semrush clickstream) — the pond is shrinking, not empty.
- ~ Transactional intent (tools, downloads) appears **relatively insulated** from AIOs.
- ◇ HowTo rich results were removed by Google (Sept 2023) and FAQ rich results restricted (2023) with docs deleted (2025) — schema won't earn us visual SERP features on tutorials anymore.
- ~ Incumbents are bleeding: Exceljet ~506k monthly visits and declining; Ablebits declining — the AI-clone "SEO heist" + AIOs hit text-only tutorial sites first.

**The thesis that follows:** don't build a site whose value an AI Overview can repeat. Build the things an AI Overview *cannot be* — tools, downloads, live verification, unique data — and structure the text content to be the thing AI Overviews *cite*.

## 2. The five traffic engines (priority order)

### Engine 1 — Tools as primary SEO assets (transactional intent, AIO-insulated)
Our fixer, explainer, converter, and in-browser workbook editor aren't features on content pages; they're the *landing pages*. Target tool-intent queries head-on:
- "excel formula checker / fixer" → /tools/fix-formula
- "convert excel formula to google sheets" → /tools/convert-formula
- "open xlsx online free / fix excel file online" → /tools/analyze-workbook (the privacy story — *never uploaded* — is the differentiator against every "free online" competitor)
- Build thin-intent variants: per-error tool pages ("#N/A checker") that pre-configure the fixer.
An AIO can describe a fix; it cannot *run your formula*. This is also what Reddit/LLMs recommend by name.

### Engine 2 — Long-tail task queries the AIO coverage misses
AIOs blanket head terms ("vlookup how to"). Multi-condition, real-work phrasing ("count overdue tasks by department and month excel") is too sparse for consistent AIO coverage and matches our task-first page format exactly. Scale from 77 → 150+ pages prioritizing:
- current thin categories: dates/deadlines (5), conditional logic (5), finance (4)
- comparison pages 3 → ~20 ("index match vs xlookup", "sumifs vs sumproduct", "filter vs query") — decision intent, users click through for the verdict
- Excel↔Sheets equivalence pages ("textsplit in google sheets", "countunique in excel") — a lane Exceljet ignores entirely.

### Engine 3 — Citation/GEO optimization (be the source AIOs and LLMs quote)
✓ Cited pages get ~35% more CTR — and citations are won by extractable, verifiable specificity:
- One-sentence answer + the formula in the first 100 words of every page (already our format).
- Quotable unique facts no tutorial site has: engine-verified numbers ("stacking 20% then 10% = 28%, not 30% — machine-verified"), the /how-we-test methodology, live verification counts.
- Add `llms.txt` and keep clean semantic HTML; keep JSON-LD lean (Article/Breadcrumb — drop the dead HowTo markup eventually, it's harmless but earns nothing ◇).
- Publish one **original data study** per quarter (e.g., "We ran 500 AI-generated formulas through a real spreadsheet engine — X% were wrong"). This is link-bait *and* citation-bait, and only we have the harness to do it.

### Engine 4 — Downloads (templates + per-page proof sheets)
Transactional, AIO-proof, and the conversion asset. Auto-generate a downloadable "proof sheet" .xlsx from every page's verification block (we have the machinery) — 77 instant download surfaces AI scrapers can't fake, each an email-capture moment. Template gallery grows toward the PRD's 10, each targeting "\<use case\> template" queries.

### Engine 5 — Non-Google distribution (insurance + compounding)
- **Reddit (r/excel, r/googlesheets):** answer threads genuinely; share tools only where they solve the thread. Reddit is also what LLMs train on and cite — presence there feeds Engine 3.
- **YouTube Shorts / TikTok:** 30–60s "broken formula → fixed live in the editor" clips; embed on matching pages.
- **Pinterest:** template pins (long-lived template-query traffic ◇).
- **Email:** already capturing; the list is the asset that survives algorithm shifts (Exceljet's 100k list outlived its traffic halving).

## 3. Conversion architecture (traffic → value)

Every surface routes to the next step of value:
tutorial page → "open your spreadsheet" / proof-sheet download → editor or download → email capture at the moment of success → newsletter → template sales later. Track the full funnel in GA4: `search_query`, `formula_copy`, `tool_use`, `template_download`, `newsletter_signup`, `feedback_vote` (already instrumented).

## 4. 90-day roadmap

**P0 — launch week (blocking):** deploy; GA4 (installed) + Search Console + sitemap submission; verify indexation of all ~111 routes.
**P1 — weeks 1–4:** 40 new long-tail/task pages into thin categories; comparisons 3→12; tool landing pages retitled/expanded for tool-intent keywords; proof-sheet downloads on top 20 pages; llms.txt.
**P2 — months 2–3:** first original data study; comparisons →20; equivalence page set; Reddit presence cadence (2–3 genuinely helpful answers/week); first 10 Shorts; Pinterest board for templates.
**P3 — quarter 2:** category pillar pages; template gallery to 10+; Spanish-language pilot on the top-10 pages (unverified opportunity — treat as experiment); quarterly data study #2.

## 5. KPIs (weekly once live)

- Impressions & clicks by query class (tool / error / task / comparison / template) in GSC — expect tool+download CTR ≫ tutorial CTR; allocate content effort accordingly.
- AIO citation sightings for our top 20 queries (manual GSC + SERP checks monthly).
- Organic visit → tool-use rate; tool-use → email rate; email list growth.
- Indexed pages vs published; internal-link click-through (currently 3.0 related links/page).

## 6. What we deliberately don't do

- Chase head-term tutorials ("how to use vlookup") as primary bets — that pond lost half its water even without AIOs ✓.
- Programmatic thin pages at scale — the Exceljet clone-heist proved text-only content is trivially copyable; every page we ship carries assets copies can't fake (verification badge, proof sheet, live tools).
- Schema chasing — HowTo/FAQ rich results are gone ◇; effort goes to citation-worthiness instead.
