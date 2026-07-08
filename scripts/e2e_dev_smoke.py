from playwright.sync_api import sync_playwright
"""StrictMode guard (dev-only bug class): run against `next dev` to catch
resource-lifecycle bugs that production e2e cannot see. Usage:
  with_server.py --server "env NEXT_DIST_DIR=.next-dev-verify npx next dev -p 4124" --port 4124 -- python3 scripts/e2e_dev_smoke.py
"""

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    errors = []
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.goto("http://localhost:4124/tools/analyze-workbook")
    page.wait_for_load_state("networkidle")
    page.set_input_files("input[type=file]", "public/templates/budget-tracker.xlsx")
    try:
        page.wait_for_selector('[data-cell="A1"]', timeout=30000)
        page.click('[data-cell="C2"]')
        page.wait_for_timeout(800)
    except Exception as e:
        errors.append(f"interaction failed: {e}")
    crash = [e for e in errors if "sheetMapping" in e or "destroyed" in e.lower()]
    print("CRASH REPRODUCED" if crash else ("OTHER ERRORS: " + "; ".join(errors[:2]) if errors else "NO CRASH — editor healthy"))
    browser.close()
