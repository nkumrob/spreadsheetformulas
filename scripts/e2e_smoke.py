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
    page.goto(f"{BASE}/templates/project-task-tracker")
    page.wait_for_load_state("networkidle")
    check("template page formulas listed", "Formulas built in" in page.content())
    request = urllib.request.Request(f"{BASE}/templates/project-task-tracker.xlsx", method="HEAD")
    with urllib.request.urlopen(request) as response:
        check("xlsx download 200", response.status == 200)

    # 7. Workbook editor: upload a template, edit a cell, dependent recomputes live.
    page.goto(f"{BASE}/tools/analyze-workbook")
    page.wait_for_load_state("networkidle")
    page.set_input_files("input[type=file]", "public/templates/budget-tracker.xlsx")
    page.wait_for_selector('[data-cell="A1"]', timeout=20000)
    check("editor opened workbook grid", page.locator('[data-cell="B2"]').inner_text().strip() != "")
    # Select C2 (Rent actual, 2500) and check the formula bar mirrors it.
    page.click('[data-cell="C2"]')
    check("formula bar mirrors selection", page.get_attribute('input[aria-label="Formula bar"]', "value") == "2500")
    # Edit C2 to 3000 → D2 (=C2-B2, budget 2500) must recompute to 500.
    page.dblclick('[data-cell="C2"]')
    page.keyboard.press("Meta+a")
    page.keyboard.type("3000")
    page.keyboard.press("Enter")
    page.wait_for_timeout(400)
    check("edit recomputed dependent", page.locator('[data-cell="D2"]').inner_text().strip() == "500")
    check("download button present", page.locator("text=Download fixed .xlsx").count() == 1)
    # Introduce an error, Re-scan must surface it in the findings list.
    page.click('[data-cell="A10"]')
    page.keyboard.type("=1/0")
    page.keyboard.press("Enter")
    page.click("text=Re-scan")
    page.wait_for_timeout(500)
    check(
        "rescan surfaces new error cell",
        page.locator('section[aria-label="Findings"] button:has-text("A10")').count() == 1,
    )

    # 8. Converter: TEXTSPLIT becomes SPLIT.
    page.goto(f"{BASE}/tools/convert-formula")
    page.wait_for_load_state("networkidle")
    page.fill("textarea", '=TEXTSPLIT(A2,",")')
    page.get_by_role("button", name="Convert", exact=True).click()
    page.wait_for_timeout(300)
    converted = page.locator("code", has_text="=SPLIT(A2,").count()
    check("converter renames TEXTSPLIT", converted >= 1)

    # 9. Error page + 404.
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
