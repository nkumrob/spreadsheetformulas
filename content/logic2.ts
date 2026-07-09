import type { Formula } from "@/lib/schema";

export const logic2Formulas: Formula[] = [
  {
    slug: "if-cell-contains-text",
    kind: "formula",
    title: "Flag Rows Where a Cell Contains Specific Text",
    seoTitle: "IF Cell Contains Text: SEARCH Formula (Excel & Sheets)",
    description:
      "Label an order Priority when its notes mention \"rush\" — SEARCH finds the word anywhere in the cell and IF turns the result into a clean status.",
    category: "conditional-logic",
    difficulty: "beginner",
    functions: ["IF", "ISNUMBER", "SEARCH"],
    keywords: ["if cell contains text", "if contains word", "search text in cell", "flag rows with keyword", "partial text match"],
    problem:
      "A notes column holds free text — order comments, ticket descriptions, delivery instructions — and you need to flag every row that mentions a certain word, wherever it appears in the cell.",
    quickFormula: '=IF(ISNUMBER(SEARCH("rush",A2)),"Priority","Standard")',
    excelFormula: '=IF(ISNUMBER(SEARCH("rush",A2)),"Priority","Standard")',
    sheetsFormula: null,
    explanation:
      "You can't test \"contains\" with A2=\"rush\" — that only matches cells that say exactly rush and nothing else. SEARCH returns the position where the text starts (a number) when it's found, and a #VALUE! error when it isn't. ISNUMBER converts that into a clean TRUE or FALSE, and IF turns it into your two labels. SEARCH ignores case, so \"RUSH - client launch\" matches too; if capitalization must matter (matching a code like \"ID\" but not \"id\"), swap in FIND, which is case-sensitive but otherwise identical.",
    steps: [
      { part: 'SEARCH("rush",A2)', meaning: "Finds where \"rush\" starts in A2 — a number if present, #VALUE! if not. Case doesn't matter." },
      { part: "ISNUMBER(…)", meaning: "TRUE when SEARCH found a position, FALSE when it errored — the clean found/not-found test." },
      { part: '"Priority","Standard"', meaning: "What IF returns for a match and for everything else." },
    ],
    whenToUse:
      "Use it to route orders whose notes mention rush or urgent, flag tickets that reference refund, or tag transactions whose descriptions contain a vendor name.",
    commonMistakes: [
      {
        mistake: 'Testing A2="rush" and matching almost nothing.',
        fix: "The = test needs the whole cell to equal rush exactly. For \"contains anywhere,\" you need SEARCH wrapped in ISNUMBER.",
      },
      {
        mistake: "Using FIND and missing capitalized matches.",
        fix: 'FIND is case-sensitive, so it skips "Rush" and "RUSH". Use SEARCH unless case genuinely matters.',
      },
      {
        mistake: "Substring false positives.",
        fix: '"brush" and "crush" contain "rush" too. If that bites, search for the word with a leading space — SEARCH(" rush",A2) — or match against a fixed list of phrases instead.',
      },
    ],
    sampleInput: {
      columns: ["Order", "Notes"],
      rows: [
        ["1041", "Please rush this order"],
        ["1042", "Ship via ground"],
        ["1043", "RUSH - client launch"],
      ],
    },
    sampleOutput: {
      columns: ["Order", "Status"],
      rows: [
        ["1041", "Priority"],
        ["1042", "Standard"],
        ["1043", "Priority"],
      ],
      highlightColumn: 1,
    },
    related: ["count-if-multiple-conditions", "regexmatch-check-text-pattern", "create-pass-fail-status"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Notes", "Status"],
          ["Please rush this order", '=IF(ISNUMBER(SEARCH("rush",A2)),"Priority","Standard")'],
          // No match: SEARCH errors, ISNUMBER returns FALSE.
          ["Ship via ground", '=IF(ISNUMBER(SEARCH("rush",A3)),"Priority","Standard")'],
          // Case-insensitive match.
          ["RUSH - client launch", '=IF(ISNUMBER(SEARCH("rush",A4)),"Priority","Standard")'],
        ],
      },
      expect: [
        { cell: "B2", value: "Priority" },
        { cell: "B3", value: "Standard" },
        { cell: "B4", value: "Priority" },
      ],
    },
  },
  {
    slug: "if-between-two-values",
    kind: "formula",
    title: "Test Whether a Number Falls Between Two Values",
    seoTitle: "IF Between Two Values Formula (Excel & Sheets)",
    description:
      "AND checks both ends of the range in one IF — label order quantities that qualify for a carton discount, with the boundaries counted correctly.",
    category: "conditional-logic",
    difficulty: "beginner",
    functions: ["IF", "AND"],
    keywords: ["if between two values", "if number in range", "and formula", "between formula", "range check"],
    problem:
      "A carton discount applies only to orders of 10 to 20 units. You need each order labeled in or out of that window — and orders of exactly 10 or exactly 20 must count as in.",
    quickFormula: '=IF(AND(B2>=10,B2<=20),"In range","Out of range")',
    excelFormula: '=IF(AND(B2>=10,B2<=20),"In range","Out of range")',
    sheetsFormula: null,
    explanation:
      "Spreadsheets have no single \"between\" operator, so you test each end separately and let AND require both: at least 10 AND at most 20. AND returns TRUE only when every condition inside it passes, and IF converts that into your labels. The operators define whether the boundaries count — >= and <= include exactly 10 and exactly 20, while > and < would exclude them. Decide that before you write the formula; it's the difference between a 10-unit order getting the discount or not.",
    steps: [
      { part: "B2>=10", meaning: "The lower bound. >= means exactly 10 counts as in range." },
      { part: "B2<=20", meaning: "The upper bound. <= means exactly 20 counts too." },
      { part: "AND(…)", meaning: "TRUE only when both bounds pass — the number sits inside the window." },
    ],
    whenToUse:
      "Use it for quantity discount bands, acceptable tolerance ranges on measurements, invoice amounts within an approval threshold, or response times inside an SLA window.",
    commonMistakes: [
      {
        mistake: "Writing 10<=B2<=20 like math.",
        fix: "Spreadsheets evaluate that left to right: 10<=B2 becomes TRUE or FALSE, which is then compared to 20 — silently wrong on every row. Always split it: AND(B2>=10,B2<=20).",
      },
      {
        mistake: "Boundary values land on the wrong side.",
        fix: 'AND(B2>10,B2<20) rejects an order of exactly 10 or 20. If the ends should count, use >= and <= — say the rule out loud ("10 through 20 inclusive") before picking operators.',
      },
      {
        mistake: "Bounds accidentally reversed.",
        fix: "AND(B2>=20,B2<=10) can never be true, so everything shows Out of range. The smaller number takes >=, the larger takes <=.",
      },
    ],
    sampleInput: {
      columns: ["Customer", "Qty"],
      rows: [
        ["Acme Co", "15"],
        ["Borealis", "9"],
        ["Cobalt", "20"],
      ],
    },
    sampleOutput: {
      columns: ["Customer", "Discount Window"],
      rows: [
        ["Acme Co", "In range"],
        ["Borealis", "Out of range"],
        ["Cobalt", "In range"],
      ],
      highlightColumn: 1,
    },
    related: ["create-pass-fail-status", "create-status-multiple-conditions", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Customer", "Qty", "Window"],
          ["Acme Co", 15, '=IF(AND(B2>=10,B2<=20),"In range","Out of range")'],
          ["Borealis", 9, '=IF(AND(B3>=10,B3<=20),"In range","Out of range")'],
          // Boundary cases: exactly 10 and exactly 20 are inclusive.
          ["Cobalt", 10, '=IF(AND(B4>=10,B4<=20),"In range","Out of range")'],
          ["Delta", 20, '=IF(AND(B5>=10,B5<=20),"In range","Out of range")'],
          ["Eastline", 21, '=IF(AND(B6>=10,B6<=20),"In range","Out of range")'],
        ],
      },
      expect: [
        { cell: "C2", value: "In range" },
        { cell: "C3", value: "Out of range" },
        { cell: "C4", value: "In range" },
        { cell: "C5", value: "In range" },
        { cell: "C6", value: "Out of range" },
      ],
    },
  },
  {
    slug: "if-cell-is-not-empty",
    kind: "formula",
    title: "Test Whether a Cell Is Filled or Empty",
    seoTitle: "IF Cell Is Not Empty Formula (Excel & Google Sheets)",
    description:
      "Flag rows with a missing PO number using a simple not-equal-to-empty test — and know when it disagrees with ISBLANK on formula-made blanks.",
    category: "conditional-logic",
    difficulty: "beginner",
    functions: ["IF", "ISBLANK"],
    keywords: ["if cell is not empty", "if cell is blank", "isblank formula", "check empty cell", "flag missing data"],
    problem:
      "An invoice tracker requires a PO number before payment can be released, but some rows arrived without one. You need a column that shows which rows are complete and which still need chasing.",
    quickFormula: '=IF(A2<>"","Filled","Missing")',
    excelFormula: '=IF(A2<>"","Filled","Missing")',
    sheetsFormula: null,
    explanation:
      "A2<>\"\" asks \"is this cell anything other than empty text?\" A truly empty cell compares equal to \"\", so it fails the test and returns Missing; any real entry returns Filled. The subtle case is a cell whose formula returned \"\" — say a lookup wrapped in IFERROR(…,\"\"). To your eye it's blank, and A2<>\"\" agrees and says Missing. ISBLANK does not: it tests whether the cell contains literally nothing, and a cell holding a formula isn't nothing, so ISBLANK calls it filled. For \"does this row have data I can act on,\" the <>\"\" test almost always gives the answer you mean.",
    steps: [
      { part: 'A2<>""', meaning: "TRUE when the cell holds anything other than empty text — a value, a date, even a zero." },
      { part: '"Filled"', meaning: "Returned when something usable is there." },
      { part: '"Missing"', meaning: "Returned for truly empty cells and for formulas that produced \"\"." },
    ],
    whenToUse:
      "Use it to flag invoices without PO numbers, orders without tracking codes, or CRM rows without an owner — any completeness check before a report goes out or a payment is approved.",
    commonMistakes: [
      {
        mistake: "Using ISBLANK on cells that contain formulas.",
        fix: 'A cell whose formula returns "" looks empty but ISBLANK returns FALSE — the cell holds a formula, so it counts as filled. Test A2<>"" (or A2="") when formula-made blanks should count as missing.',
      },
      {
        mistake: "Cells that look empty but hold a space.",
        fix: 'A stray space fails A2="" and shows Filled. Trim before testing: =IF(TRIM(A2)<>"","Filled","Missing").',
      },
      {
        mistake: "Treating zero as missing.",
        fix: '0<>"" is TRUE, so a zero shows Filled — usually right, since 0 is real data. If zero should also count as missing, test both: =IF(AND(A2<>"",A2<>0),"Filled","Missing").',
      },
    ],
    sampleInput: {
      columns: ["Invoice", "PO Number"],
      rows: [
        ["INV-201", "PO-4821"],
        ["INV-202", ""],
        ["INV-203", "PO-4900"],
      ],
    },
    sampleOutput: {
      columns: ["Invoice", "Check"],
      rows: [
        ["INV-201", "Filled"],
        ["INV-202", "Missing"],
        ["INV-203", "Filled"],
      ],
      highlightColumn: 1,
    },
    related: ["find-blanks", "count-blanks", "find-missing-values"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Invoice", "PO Number", "Check", "ISBLANK"],
          ["INV-201", "PO-4821", '=IF(B2<>"","Filled","Missing")', "=ISBLANK(B2)"],
          // Truly empty cell: <>"" is FALSE and ISBLANK is TRUE.
          ["INV-202", null, '=IF(B3<>"","Filled","Missing")', "=ISBLANK(B3)"],
          // Formula-returned "": Missing by <>"", yet ISBLANK says FALSE (filled).
          ["INV-203", '=""', '=IF(B4<>"","Filled","Missing")', "=ISBLANK(B4)"],
        ],
      },
      expect: [
        { cell: "C2", value: "Filled" },
        { cell: "C3", value: "Missing" },
        { cell: "D3", value: true },
        { cell: "C4", value: "Missing" },
        { cell: "D4", value: false },
      ],
    },
  },
  {
    slug: "nested-if-statements",
    kind: "formula",
    title: "Build Three-Tier Results with Nested IF Statements",
    seoTitle: "Nested IF Statements: 3+ Tiers (Excel & Sheets)",
    description:
      "Put one IF inside another to return a third outcome — tiered unit pricing by order quantity, checked from the strictest condition down.",
    category: "conditional-logic",
    difficulty: "intermediate",
    functions: ["IF"],
    keywords: ["nested if", "if inside if", "multiple if statements", "tiered pricing formula", "three conditions if"],
    problem:
      "One IF gives you two outcomes, but your price list has three: orders of 100+ units pay 4.50, 50–99 pay 5.25, and everything smaller pays the 6.00 list price.",
    quickFormula: "=IF(B2>=100,4.5,IF(B2>=50,5.25,6))",
    excelFormula: "=IF(B2>=100,4.5,IF(B2>=50,5.25,6))",
    sheetsFormula: null,
    explanation:
      "The second IF sits in the first IF's \"otherwise\" slot. The formula tests B2>=100 first; if that's true it returns 4.50 and stops. Only when the order is under 100 does the inner IF run, testing B2>=50 for the 5.25 tier, with 6.00 as the final fallback. Because each test only sees what the previous one rejected, the conditions must run from strictest to loosest — and the inner test doesn't need an upper bound, since anything 100+ never reaches it. Past three or four tiers, nesting gets hard to read: switch to IFS (Excel 2019+ and Google Sheets), which lists condition/result pairs flat.",
    steps: [
      { part: "B2>=100,4.5", meaning: "The strictest test first. 100 units or more gets the bulk price and the formula stops." },
      { part: "IF(B2>=50,5.25", meaning: "Runs only for orders under 100 — so it alone defines the 50–99 tier." },
      { part: ",6)", meaning: "The final fallback: anything under 50 pays list price." },
    ],
    whenToUse:
      "Use it for tiered unit pricing, shipping rates by weight band, discount levels by order size, or commission brackets — anywhere a number maps to three or four outcomes and IFS isn't available.",
    commonMistakes: [
      {
        mistake: "Loosest condition first, so the top tier never fires.",
        fix: "=IF(B2>=50,5.25,IF(B2>=100,4.5,6)) prices a 200-unit order at 5.25, because B2>=50 catches it first. Order the tests strictest to loosest.",
      },
      {
        mistake: "Boundary quantities priced in the wrong tier.",
        fix: "With >= tests, exactly 100 gets 4.50 and exactly 50 gets 5.25. If the deal sheet says \"over 100,\" use B2>100 instead — check the wording before choosing.",
      },
      {
        mistake: "Nesting five or more tiers into an unreadable formula.",
        fix: 'Every extra IF adds a parenthesis to misplace. From four tiers up, use IFS — =IFS(B2>=100,4.5,B2>=50,5.25,TRUE,6) — or a VLOOKUP against a rate table.',
      },
    ],
    sampleInput: {
      columns: ["Customer", "Qty"],
      rows: [
        ["Acme Co", "250"],
        ["Borealis", "60"],
        ["Cobalt", "12"],
      ],
    },
    sampleOutput: {
      columns: ["Customer", "Unit Price"],
      rows: [
        ["Acme Co", "4.50"],
        ["Borealis", "5.25"],
        ["Cobalt", "6.00"],
      ],
      highlightColumn: 1,
    },
    related: ["create-status-multiple-conditions", "create-pass-fail-status", "switch-replace-nested-ifs"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Customer", "Qty", "Price"],
          ["Acme Co", 250, "=IF(B2>=100,4.5,IF(B2>=50,5.25,6))"],
          ["Borealis", 60, "=IF(B3>=100,4.5,IF(B3>=50,5.25,6))"],
          ["Cobalt", 12, "=IF(B4>=100,4.5,IF(B4>=50,5.25,6))"],
          // Boundary cases: exactly 100 and exactly 50 take the higher tier.
          ["Delta", 100, "=IF(B5>=100,4.5,IF(B5>=50,5.25,6))"],
          ["Eastline", 50, "=IF(B6>=100,4.5,IF(B6>=50,5.25,6))"],
        ],
      },
      expect: [
        { cell: "C2", value: 4.5 },
        { cell: "C3", value: 5.25 },
        { cell: "C4", value: 6 },
        { cell: "C5", value: 4.5 },
        { cell: "C6", value: 5.25 },
      ],
    },
  },
  {
    slug: "if-or-multiple-conditions",
    kind: "formula",
    title: "Flag a Row When Any One Condition Is True",
    seoTitle: "IF with OR: Multiple Conditions (Excel & Sheets)",
    description:
      "OR inside IF fires when any test passes — escalate an order if it shipped Rush or its value tops $500, without writing two formulas.",
    category: "conditional-logic",
    difficulty: "beginner",
    functions: ["IF", "OR"],
    keywords: ["if or formula", "if multiple conditions", "if any condition true", "or function", "either condition"],
    problem:
      "The ops team reviews an order when it meets either trigger: the customer chose Rush shipping, or the order value is over $500. One matching condition is enough — you need a formula that thinks the same way.",
    quickFormula: '=IF(OR(A2="Rush",B2>500),"Escalate","Normal")',
    excelFormula: '=IF(OR(A2="Rush",B2>500),"Escalate","Normal")',
    sheetsFormula: null,
    explanation:
      "OR takes any number of tests and returns TRUE the moment one of them passes — Rush shipping, a value over 500, or both. IF then converts that into Escalate or Normal. Only when every test fails does the row stay Normal. Note the text comparison isn't case-sensitive, so \"rush\" and \"RUSH\" in column A both match. And B2>500 is strict: an order of exactly 500 stays Normal, because 500 is not greater than 500 — use >= if the threshold itself should escalate.",
    steps: [
      { part: 'A2="Rush"', meaning: "First trigger: the shipping method is Rush (any capitalization)." },
      { part: "B2>500", meaning: "Second trigger: order value strictly above 500 — exactly 500 doesn't fire." },
      { part: "OR(…)", meaning: "TRUE when at least one trigger passes; FALSE only when all fail." },
    ],
    whenToUse:
      "Use it wherever one match is enough: escalate tickets that are urgent or aging, review expenses that are large or missing a receipt, flag shipments that are late or incomplete.",
    commonMistakes: [
      {
        mistake: "Using AND when the rule says either.",
        fix: 'AND(A2="Rush",B2>500) escalates only orders that are both Rush and large — a $900 ground order slips through. "Either one" means OR.',
      },
      {
        mistake: "The threshold row doesn't escalate.",
        fix: "B2>500 excludes exactly 500. If a $500 order should count, write B2>=500 — one character changes the policy.",
      },
      {
        mistake: 'Writing OR(A2="Rush","Express") to match two methods.',
        fix: 'Each test must be complete on its own: OR(A2="Rush",A2="Express"). A bare "Express" isn\'t a condition and won\'t match anything.',
      },
    ],
    sampleInput: {
      columns: ["Shipping", "Value"],
      rows: [
        ["Rush", "200"],
        ["Ground", "800"],
        ["Ground", "120"],
      ],
    },
    sampleOutput: {
      columns: ["Shipping", "Value", "Queue"],
      rows: [
        ["Rush", "200", "Escalate"],
        ["Ground", "800", "Escalate"],
        ["Ground", "120", "Normal"],
      ],
      highlightColumn: 2,
    },
    related: ["create-status-multiple-conditions", "flag-overdue-tasks", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Shipping", "Value", "Queue"],
          ["Rush", 200, '=IF(OR(A2="Rush",B2>500),"Escalate","Normal")'],
          ["Ground", 800, '=IF(OR(A3="Rush",B3>500),"Escalate","Normal")'],
          ["Ground", 120, '=IF(OR(A4="Rush",B4>500),"Escalate","Normal")'],
          // Boundary case: exactly 500 is NOT greater than 500.
          ["Ground", 500, '=IF(OR(A5="Rush",B5>500),"Escalate","Normal")'],
        ],
      },
      expect: [
        { cell: "C2", value: "Escalate" },
        { cell: "C3", value: "Escalate" },
        { cell: "C4", value: "Normal" },
        { cell: "C5", value: "Normal" },
      ],
    },
  },
  {
    slug: "if-and-or-combined",
    kind: "formula",
    title: "Combine AND with OR in a Single IF Formula",
    seoTitle: "IF with AND + OR Combined (Excel & Google Sheets)",
    description:
      "Nest OR inside AND to express rules like \"Open, and either older than 30 days or high priority\" — the grouping decides everything.",
    category: "conditional-logic",
    difficulty: "intermediate",
    functions: ["IF", "AND", "OR"],
    keywords: ["if and or combined", "nested and or", "complex if conditions", "multiple criteria if", "and or together"],
    problem:
      "Your ticket queue rule isn't a simple either/or: a ticket needs review when it's still Open AND it's either been sitting more than 30 days OR it's marked High priority. Closed tickets never qualify, however old.",
    quickFormula: '=IF(AND(A2="Open",OR(B2>30,C2="High")),"Review","OK")',
    excelFormula: '=IF(AND(A2="Open",OR(B2>30,C2="High")),"Review","OK")',
    sheetsFormula: null,
    explanation:
      "Read it from the inside out. OR(B2>30,C2=\"High\") is the \"either\" part — aging or urgent, one is enough. That whole result becomes the second condition of AND, so the row must be Open and pass the OR. A Closed ticket fails AND immediately, no matter how old or urgent; a fresh Low-priority Open ticket fails the OR and stays OK. The structure mirrors the sentence: AND for the parts joined by \"and,\" OR wrapped around the parts joined by \"or.\" Write the rule in plain English first, then translate each connector.",
    steps: [
      { part: 'A2="Open"', meaning: "The must-have condition. Anything not Open is OK regardless of the rest." },
      { part: 'OR(B2>30,C2="High")', meaning: "The either/or group: more than 30 days old, or High priority — one suffices." },
      { part: "AND(…,…)", meaning: "Requires the must-have AND the either/or group to both pass before Review fires." },
    ],
    whenToUse:
      "Use it for layered business rules: review open tickets that are old or urgent, chase unpaid invoices that are large or overdue, audit active vendors that are new or flagged.",
    commonMistakes: [
      {
        mistake: "Flattening everything into one AND.",
        fix: 'AND(A2="Open",B2>30,C2="High") demands old AND urgent, so a 45-day Low ticket slips through. The either/or pair must sit inside its own OR.',
      },
      {
        mistake: "Putting AND inside OR instead.",
        fix: 'OR(A2="Open",AND(B2>30,C2="High")) reviews every Open ticket and even some Closed ones. Match the nesting to the sentence: (Open) AND (old OR urgent).',
      },
      {
        mistake: "Status text doesn't match the data.",
        fix: 'A2="Open" won\'t match "Open " with a trailing space or "Re-opened". Check the actual values, and TRIM the column if exports add spaces.',
      },
    ],
    sampleInput: {
      columns: ["Status", "Days Open", "Priority"],
      rows: [
        ["Open", "45", "Low"],
        ["Open", "10", "High"],
        ["Closed", "60", "High"],
      ],
    },
    sampleOutput: {
      columns: ["Status", "Days Open", "Action"],
      rows: [
        ["Open", "45", "Review"],
        ["Open", "10", "Review"],
        ["Closed", "60", "OK"],
      ],
      highlightColumn: 2,
    },
    related: ["create-status-multiple-conditions", "flag-overdue-tasks", "sum-if-multiple-conditions"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Status", "Days", "Priority", "Action"],
          ["Open", 45, "Low", '=IF(AND(A2="Open",OR(B2>30,C2="High")),"Review","OK")'],
          ["Open", 10, "High", '=IF(AND(A3="Open",OR(B3>30,C3="High")),"Review","OK")'],
          // Open but neither old nor urgent: the OR fails.
          ["Open", 10, "Low", '=IF(AND(A4="Open",OR(B4>30,C4="High")),"Review","OK")'],
          // Closed always fails the AND, even when old AND urgent.
          ["Closed", 60, "High", '=IF(AND(A5="Open",OR(B5>30,C5="High")),"Review","OK")'],
        ],
      },
      expect: [
        { cell: "D2", value: "Review" },
        { cell: "D3", value: "Review" },
        { cell: "D4", value: "OK" },
        { cell: "D5", value: "OK" },
      ],
    },
  },
  {
    slug: "return-blank-instead-of-zero",
    kind: "formula",
    title: "Return a Blank Instead of a Zero",
    seoTitle: "Show Blank Instead of Zero (Excel & Google Sheets)",
    description:
      "Swap zeros for empty cells so reports read cleanly — and understand how the invisible \"\" quietly changes averages computed on that column.",
    category: "conditional-logic",
    difficulty: "beginner",
    functions: ["IF"],
    keywords: ["blank instead of zero", "hide zeros", "if zero show blank", "empty cell instead of 0", "suppress zeros"],
    problem:
      "A monthly sales report is littered with zeros — reps with no sales, regions with no activity — and the zeros bury the numbers that matter. You want those cells to read as empty.",
    quickFormula: '=IF(A2=0,"",A2)',
    excelFormula: '=IF(A2=0,"",A2)',
    sheetsFormula: null,
    explanation:
      "If the value is zero, the formula returns \"\" — empty text that displays as nothing — otherwise it passes the value through untouched. But that blank is cosmetic, not a real empty cell, and it changes downstream math: AVERAGE skips text, so an average over the display column ignores the zero months entirely and reads higher than the truth, and arithmetic like C2*1.1 on a \"\" cell returns #VALUE!. Same philosophy as guarding #DIV/0!: hide a value only where people read it, never in a column other formulas calculate from. If you just want zeros invisible, a custom number format (0;-0;;@) hides them with the real numbers intact underneath.",
    steps: [
      { part: "A2=0", meaning: "The test: is this value exactly zero?" },
      { part: '""', meaning: "Empty text — displays as a blank cell, but it's text, not a true empty." },
      { part: "A2", meaning: "Everything non-zero passes through unchanged." },
    ],
    whenToUse:
      "Use it on presentation copies of reports — sales by rep, spend by category, units by branch — where zeros are noise. Keep the raw numbers in their own column for any math.",
    commonMistakes: [
      {
        mistake: "Averaging the column after blanking zeros.",
        fix: 'AVERAGE ignores "" — with values 0, 250, 350 the true average is 200, but the blanked column averages 300. Point AVERAGE at the raw column, or keep the zeros.',
      },
      {
        mistake: "Doing math on the blanked column.",
        fix: 'C2*1.1 on a cell holding "" returns #VALUE! — "" is text, not a number. Calculate from the original values, and use the blanked column only for display.',
      },
      {
        mistake: "Reaching for the formula when a number format would do.",
        fix: "The custom format 0;-0;;@ makes zeros invisible while keeping the real number in the cell — sums and averages stay correct. Prefer it when you don't need the value gone, just hidden.",
      },
    ],
    sampleInput: {
      columns: ["Rep", "Sales"],
      rows: [
        ["Ana Torres", "0"],
        ["Ben Okafor", "250"],
        ["Cara Lim", "350"],
      ],
    },
    sampleOutput: {
      columns: ["Rep", "Sales (Display)"],
      rows: [
        ["Ana Torres", ""],
        ["Ben Okafor", "250"],
        ["Cara Lim", "350"],
      ],
      highlightColumn: 1,
    },
    related: ["fix-div0-error", "iferror-catch-formula-errors", "find-blanks"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Rep", "Sales", "Display"],
          ["Ana Torres", 0, '=IF(B2=0,"",B2)'],
          ["Ben Okafor", 250, '=IF(B3=0,"",B3)'],
          ["Cara Lim", 350, '=IF(B4=0,"",B4)'],
          // The caveat, proven: AVERAGE over the display column skips the ""
          // (300), while the raw column includes the zero (200).
          ["Avg of display", "=AVERAGE(C2:C4)", null],
          ["Avg of raw", "=AVERAGE(B2:B4)", null],
        ],
      },
      expect: [
        { cell: "C2", value: "" },
        { cell: "C3", value: 250 },
        { cell: "C4", value: 350 },
        { cell: "B5", value: 300 },
        { cell: "B6", value: 200 },
      ],
    },
  },
  {
    slug: "check-if-value-in-list",
    kind: "formula",
    title: "Check Whether a Value Appears in a List",
    seoTitle: "Check If Value Is in a List: COUNTIF (Excel & Sheets)",
    description:
      "COUNTIF counts how often a value appears in a reference list — wrap it in IF to mark each vendor Approved or Not approved in one pass.",
    category: "conditional-logic",
    difficulty: "beginner",
    functions: ["IF", "COUNTIF"],
    keywords: ["check if value in list", "countif in list", "is value in range", "approved list check", "match against list"],
    problem:
      "Finance keeps an approved-vendor list, and your payment sheet names a vendor on every row. You need each row checked against the list automatically — no eyeballing two columns side by side.",
    quickFormula: '=IF(COUNTIF($D$2:$D$5,A2)>0,"Approved","Not approved")',
    excelFormula: '=IF(COUNTIF($D$2:$D$5,A2)>0,"Approved","Not approved")',
    sheetsFormula: null,
    explanation:
      "COUNTIF counts how many cells in the list equal A2 — at least 1 means the vendor is on the list, 0 means it isn't, and >0 turns that count into TRUE or FALSE for IF. The $ anchors on $D$2:$D$5 are essential: they lock the list range so it doesn't slide down a row each time you copy the formula. Matching is case-insensitive (\"borealis\" matches \"Borealis\") but otherwise exact — \"Acme\" won't match \"Acme Co\". Unlike VLOOKUP, there's no #N/A to catch when the value is absent; a zero count is a perfectly clean answer.",
    steps: [
      { part: "$D$2:$D$5", meaning: "The reference list, locked with $ so it stays put when you copy the formula down." },
      { part: "COUNTIF(…,A2)>0", meaning: "Counts exact matches for this row's value; more than zero means it's on the list." },
      { part: '"Approved","Not approved"', meaning: "The two labels IF hands back." },
    ],
    whenToUse:
      "Use it to validate vendors against an approved list, SKUs against the current catalog, customer IDs against an active-accounts list, or expense categories against the chart of accounts.",
    commonMistakes: [
      {
        mistake: "Forgetting the $ anchors on the list.",
        fix: "COUNTIF(D2:D5,A2) shifts to D3:D6, D4:D7… as you copy down, so later rows check against a shrinking list. Lock it: $D$2:$D$5.",
      },
      {
        mistake: "Comparing row by row with =IF(A2=D2,…).",
        fix: "That only tests whether row 2 of each column happens to match. COUNTIF searches the whole list for each value, which is what \"is it on the list\" means.",
      },
      {
        mistake: "Near-matches counted as misses.",
        fix: '"Acme" vs "Acme Co" or a trailing space both count as different values. Standardize names first (TRIM, consistent naming), or you\'ll reject vendors that are genuinely approved.',
      },
    ],
    sampleInput: {
      columns: ["Vendor", "Approved List"],
      rows: [
        ["Acme Co", "Acme Co"],
        ["Zenith Supply", "Borealis"],
        ["Borealis", "Cobalt"],
      ],
    },
    sampleOutput: {
      columns: ["Vendor", "Status"],
      rows: [
        ["Acme Co", "Approved"],
        ["Zenith Supply", "Not approved"],
        ["Borealis", "Approved"],
      ],
      highlightColumn: 1,
    },
    related: ["find-missing-values", "vlookup-exact-match", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Vendor", "Status", null, "Approved List"],
          ["Acme Co", '=IF(COUNTIF($D$2:$D$5,A2)>0,"Approved","Not approved")', null, "Acme Co"],
          ["Zenith Supply", '=IF(COUNTIF($D$2:$D$5,A3)>0,"Approved","Not approved")', null, "Borealis"],
          // Case-insensitive: lowercase "borealis" still matches the list.
          ["borealis", '=IF(COUNTIF($D$2:$D$5,A4)>0,"Approved","Not approved")', null, "Cobalt"],
          [null, null, null, "Delta Freight"],
        ],
      },
      expect: [
        { cell: "B2", value: "Approved" },
        { cell: "B3", value: "Not approved" },
        { cell: "B4", value: "Approved" },
      ],
    },
  },
];
