#!/usr/bin/env python3
"""E2E smoke suite (ticket SF-090). Run against a built site:
  python3 <with_server.py> --server "npx next start -p 4123" --port 4123 -- python3 scripts/e2e_smoke.py
"""

import sys
import urllib.request

from playwright.sync_api import sync_playwright

BASE = "http://localhost:4123"
failures = []


def check(name, condition, detail=""):
    status = "ok" if condition else "FAIL"
    print(f"[{status}] {name}{f' — {detail}' if detail and not condition else ''}")
    if not condition:
        failures.append(name)


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})

    # 1. Homepage renders with hero + sections.
    page.goto(BASE)
    page.wait_for_load_state("networkidle")
    check("homepage hero", page.locator("h1").first.inner_text().startswith("Solve spreadsheet"))
    check("homepage templates rail", page.locator("#templates").count() == 1)

    # 2. Hero search navigates to results.
    page.fill("#hero-search", "count overdue tasks")
    page.click("text=Find a formula")
    page.wait_for_url("**/search**")
    page.wait_for_load_state("networkidle")
    check("search results shown", page.locator("ol li").count() >= 1)

    # 3. First result opens a formula page; copy button works.
    page.locator("ol li a").first.click()
    page.wait_for_load_state("networkidle")
    check("formula page has quick formula", page.locator("text=Quick formula").count() == 1)
    page.locator("button:has-text('Copy')").first.click()
    check("copy confirmation", page.locator("text=Formula copied.").count() >= 1)

    # 4. Fixer catches the PRD journey-2 VLOOKUP and suggests FALSE.
    page.goto(f"{BASE}/tools/fix-formula")
    page.wait_for_load_state("networkidle")
    page.fill("textarea", "=VLOOKUP(A2,Sheet2!A:B,2)")
    page.click("text=Check formula")
    page.wait_for_timeout(300)
    check("fixer flags approx match", "exact-match" in page.content())
    check("fixer suggests correction", "=VLOOKUP(A2,Sheet2!A:B,2,FALSE)" in page.content())

    # 5. Explainer breaks down the PRD journey-4 formula.
    page.goto(f"{BASE}/tools/explain-formula")
    page.wait_for_load_state("networkidle")
    page.fill("textarea", '=IFERROR(INDEX($B$2:$B$100,MATCH(E2,$A$2:$A$100,0)),"")')
    page.click("text=Explain formula")
    page.wait_for_timeout(300)
    check("explainer identifies IFERROR", "IFERROR" in page.content() and "Piece by piece" in page.content())

    # 6. Template page renders and the .xlsx download is reachable.
    page.goto(f"{BASE}/templates/training-compliance-tracker")
    page.wait_for_load_state("networkidle")
    check("template page formulas listed", "Formulas built in" in page.content())
    request = urllib.request.Request(f"{BASE}/templates/training-compliance-tracker.xlsx", method="HEAD")
    with urllib.request.urlopen(request) as response:
        check("xlsx download 200", response.status == 200)

    # 7. Workbook analyzer: upload our own template, expect report + live formula test.
    page.goto(f"{BASE}/tools/analyze-workbook")
    page.wait_for_load_state("networkidle")
    page.set_input_files("input[type=file]", "public/templates/budget-tracker.xlsx")
    page.wait_for_selector("text=budget-tracker.xlsx", timeout=15000)
    check("analyzer parsed workbook", "cells" in page.content() and "formulas" in page.content())
    page.fill("textarea", "=SUM(B2:B6)")
    page.click("text=Run it")
    page.wait_for_timeout(1500)
    check("analyzer computed user formula", "25600" in page.content())

    # 8. Error page + 404.
    page.goto(f"{BASE}/errors/fix-spill-error")
    page.wait_for_load_state("networkidle")
    check("new error page renders", "#SPILL!" in page.content())
    response = page.goto(f"{BASE}/formulas/does-not-exist")
    check("404 status", response.status == 404)
    check("404 branded", "#REF!" in page.content())

    # 8. Mobile: no horizontal scroll on homepage.
    mobile = browser.new_page(viewport={"width": 375, "height": 812})
    mobile.goto(BASE)
    mobile.wait_for_load_state("networkidle")
    overflow = mobile.evaluate("document.documentElement.scrollWidth > document.documentElement.clientWidth")
    check("mobile no horizontal scroll", not overflow)

    browser.close()

print(f"\n{len(failures)} failure(s)" if failures else "\nAll smoke checks passed.")
sys.exit(1 if failures else 0)
