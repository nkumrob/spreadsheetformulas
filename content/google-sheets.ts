import type { Formula } from "@/lib/schema";

export const googleSheetsFormulas: Formula[] = [
  {
    slug: "query-filter-and-sort",
    kind: "formula",
    title: "Filter and Sort Data With QUERY",
    seoTitle: "Google Sheets QUERY: Filter and Sort in One Formula",
    description:
      "QUERY runs a SQL-style select over your data — filter deals over 1,000 and sort them largest-first in a single Google Sheets formula.",
    category: "google-sheets",
    difficulty: "intermediate",
    functions: ["QUERY", "SORT", "FILTER", "CHOOSE"],
    keywords: ["query google sheets", "filter and sort formula", "select where order by", "query function", "sql in spreadsheet"],
    problem:
      "Your deals list runs hundreds of rows, and you need a live view of just the big ones — customer and amount, only where the amount tops 1,000, sorted largest first — without touching the original data.",
    quickFormula: '=QUERY(A1:D20,"select A, D where D > 1000 order by D desc",1)',
    excelFormula: "=SORT(FILTER(CHOOSE({1,2},A2:A20,D2:D20),D2:D20>1000),2,-1)",
    sheetsFormula: '=QUERY(A1:D20,"select A, D where D > 1000 order by D desc",1)',
    explanation:
      "QUERY is Google Sheets only: it runs a miniature SQL statement over a range, and this one keeps columns A and D, drops every row where D is 1,000 or less, and sorts what's left by D descending. The crucial quirk is that you refer to columns by their spreadsheet letters (A, D), never by their header names. The final 1 tells QUERY the first row is headers, so the headers ride along into the output instead of being treated as data. Excel has no QUERY — the 365 equivalent chains dynamic arrays: FILTER keeps the rows where the amount beats 1,000, CHOOSE({1,2},…) stitches just the customer and amount columns side by side, and SORT(…,2,-1) orders by the second column, descending.",
    steps: [
      { part: "A1:D20", meaning: "The data to query, including the header row." },
      { part: '"select A, D"', meaning: "Which columns to return — spreadsheet letters, not header names." },
      { part: '"where D > 1000"', meaning: "Keeps only rows whose amount is strictly greater than 1,000." },
      { part: '"order by D desc"', meaning: "Sorts the results by amount, biggest first." },
      { part: "1", meaning: "One header row — QUERY passes it through instead of treating it as data." },
    ],
    whenToUse:
      "Use it for live report views that update as the source changes: top deals over a threshold, unpaid invoices sorted by amount, open orders for one customer — anywhere you'd otherwise filter and sort by hand every week.",
    commonMistakes: [
      {
        mistake: 'Using header names instead of column letters: "select Amount".',
        fix: 'QUERY throws a parse error — it only understands spreadsheet letters. Write "select D", even though the column is labeled Amount.',
      },
      {
        mistake: "A column that mixes numbers and text.",
        fix: "QUERY decides each column's type by majority vote and silently blanks the minority — a 950 stored as text just disappears. Keep each column one type.",
      },
      {
        mistake: "Typing QUERY into Excel.",
        fix: "Excel shows #NAME? — QUERY doesn't exist there. Use the Excel 365 version: =SORT(FILTER(CHOOSE({1,2},A2:A20,D2:D20),D2:D20>1000),2,-1).",
      },
    ],
    sampleInput: {
      columns: ["Customer", "Owner", "Region", "Amount"],
      rows: [
        ["Acme Co", "Ana Torres", "East", "2400"],
        ["Borealis", "Ben Okafor", "Ops", "950"],
        ["Cobalt", "Cara Lim", "East", "3100"],
        ["Dover Ltd", "Dana Cruz", "Sales", "1000"],
      ],
    },
    sampleOutput: {
      columns: ["Customer", "Amount"],
      rows: [
        ["Cobalt", "3100"],
        ["Acme Co", "2400"],
      ],
      highlightColumn: 1,
    },
    related: ["rank-values", "pull-latest-record", "sum-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: null,
  },
  {
    slug: "arrayformula-apply-to-column",
    kind: "formula",
    title: "Apply One Formula to a Whole Column With ARRAYFORMULA",
    seoTitle: "ARRAYFORMULA: Fill a Whole Column (Google Sheets)",
    description:
      "One ARRAYFORMULA in the top cell calculates every row below it — no more copying quantity × price down the column by hand.",
    category: "google-sheets",
    difficulty: "beginner",
    functions: ["ARRAYFORMULA"],
    keywords: ["arrayformula", "apply formula to entire column", "fill formula down automatically", "multiply two columns", "array formula"],
    problem:
      "Every order row needs quantity times unit price, and you're tired of pasting the same formula down the column — and of new rows arriving without it.",
    quickFormula: "=ARRAYFORMULA(B2:B10*C2:C10)",
    excelFormula: "=B2:B10*C2:C10",
    sheetsFormula: "=ARRAYFORMULA(B2:B10*C2:C10)",
    explanation:
      "You put one formula in the top cell and the results spill down for every row of the range — one calculation, nine answers. Google Sheets needs the ARRAYFORMULA wrapper to switch the math into array mode; pressing Ctrl+Shift+Enter after typing the plain version wraps it for you. Excel 365 doesn't need a wrapper at all: dynamic arrays are the default, so =B2:B10*C2:C10 spills on its own. Either way, the cells below the formula must be empty — the spill needs the room, and anything in the way turns the whole result into an error.",
    steps: [
      { part: "ARRAYFORMULA(…)", meaning: "Tells Sheets to run the calculation on whole ranges at once. Excel 365 does this automatically." },
      { part: "B2:B10*C2:C10", meaning: "Multiplies each row's quantity by its unit price — row 2 with row 2, row 3 with row 3, and so on." },
    ],
    whenToUse:
      "Use it for any per-row calculation on a growing table: order line totals, invoice amounts, commission as deal value × rate. One formula at the top means new rows are covered without anyone remembering to fill down.",
    commonMistakes: [
      {
        mistake: "Something already sits in the spill path.",
        fix: "A stray value in D5 blocks the array — Sheets shows #REF!, Excel shows #SPILL!. Clear the cells below the formula; only the top cell should contain anything.",
      },
      {
        mistake: "Copying the ARRAYFORMULA down the column anyway.",
        fix: "Each copy tries to spill over the one above and everything errors. It lives in exactly one cell — the top of the column.",
      },
      {
        mistake: "Typing the plain array version in older Excel.",
        fix: "=B2:B10*C2:C10 only spills in Excel 365/2021. Older Excel needs the formula copied to each row (=B2*C2, filled down) or a legacy Ctrl+Shift+Enter array.",
      },
    ],
    sampleInput: {
      columns: ["Customer", "Qty", "Price"],
      rows: [
        ["Acme Co", "4", "25"],
        ["Borealis", "2", "90"],
        ["Cobalt", "10", "12"],
      ],
    },
    sampleOutput: {
      columns: ["Customer", "Qty", "Price", "Total"],
      rows: [
        ["Acme Co", "4", "25", "100"],
        ["Borealis", "2", "90", "180"],
        ["Cobalt", "10", "12", "120"],
      ],
      highlightColumn: 3,
    },
    related: ["fix-spill-error", "calculate-sales-commission", "fix-ref-error"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Customer", "Qty", "Price", "Total"],
          ["Acme Co", 4, 25, "=ARRAYFORMULA(B2:B4*C2:C4)"],
          ["Borealis", 2, 90, null],
          ["Cobalt", 10, 12, null],
        ],
      },
      expect: [
        { cell: "D2", value: 100 },
        { cell: "D3", value: 180 },
        { cell: "D4", value: 120 },
      ],
    },
  },
  {
    slug: "regexmatch-check-text-pattern",
    kind: "formula",
    title: "Flag Rows That Match a Text Pattern With REGEXMATCH",
    seoTitle: "REGEXMATCH: Flag Text Patterns in Google Sheets",
    description:
      "REGEXMATCH returns TRUE when a cell matches a regular expression — flag customers on personal Gmail addresses in one Google Sheets formula.",
    category: "google-sheets",
    difficulty: "intermediate",
    functions: ["REGEXMATCH", "ISNUMBER", "SEARCH"],
    keywords: ["regexmatch", "check if text matches pattern", "regex google sheets", "flag emails by domain", "true false text match"],
    problem:
      "Your customer list mixes company emails with personal Gmail addresses, and you need a TRUE/FALSE flag on each row so you can filter, count, or clean them up.",
    quickFormula: '=REGEXMATCH(A2,"@gmail\\.com$")',
    excelFormula: '=ISNUMBER(SEARCH("@gmail.com",A2))',
    sheetsFormula: '=REGEXMATCH(A2,"@gmail\\.com$")',
    explanation:
      "REGEXMATCH is Google Sheets only: it returns TRUE if any part of the cell matches the regular expression. Two characters do the precision work here — the backslash escapes the dot, because in regex a bare . matches any character (so @gmail.com would also match ana@gmailXcom), and the $ anchors the pattern to the end of the text, so an address ending in @gmail.com.br won't sneak through. Excel's classic functions have no regex at all; the nearest equivalent is =ISNUMBER(SEARCH(\"@gmail.com\",A2)), which finds the literal text anywhere in the cell — close, but it can't anchor to the end and treats the dot literally rather than as a pattern. Also note REGEXMATCH is case-sensitive: wrap the cell in LOWER, or start the pattern with (?i), if your data mixes cases.",
    steps: [
      { part: "A2", meaning: "The cell to test — an email address here." },
      { part: '"@gmail\\.com$"', meaning: "The pattern: literal @gmail.com (dot escaped) that must sit at the very end of the text ($)." },
    ],
    whenToUse:
      "Use it whenever \"contains this text\" isn't precise enough: flag free-mail domains in a CRM export, catch order IDs that don't match your SKU format, or spot invoice references with stray characters.",
    commonMistakes: [
      {
        mistake: "Forgetting to escape the dot.",
        fix: 'In regex, . matches any character — "@gmail.com" happily matches "@gmailXcom". Escape it: "@gmail\\.com".',
      },
      {
        mistake: "Case-sensitive misses.",
        fix: '"@Gmail.com" returns FALSE against a lowercase pattern. Use =REGEXMATCH(LOWER(A2),"@gmail\\.com$") or prefix the pattern with (?i).',
      },
      {
        mistake: "Typing REGEXMATCH into Excel.",
        fix: 'Excel shows #NAME? — it has no regex functions. The fallback =ISNUMBER(SEARCH("@gmail.com",A2)) matches literal text anywhere in the cell (case-insensitive), but it is not a real regex: no anchors, no character classes.',
      },
    ],
    sampleInput: {
      columns: ["Email", "Customer"],
      rows: [
        ["ana@acmeco.com", "Acme Co"],
        ["ben.okafor@gmail.com", "Borealis"],
        ["cara@northmail.com", "Cobalt"],
      ],
    },
    sampleOutput: {
      columns: ["Email", "Personal Gmail?"],
      rows: [
        ["ana@acmeco.com", "FALSE"],
        ["ben.okafor@gmail.com", "TRUE"],
        ["cara@northmail.com", "FALSE"],
      ],
      highlightColumn: 1,
    },
    related: ["extract-email-domain", "create-pass-fail-status", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: null,
  },
  {
    slug: "importrange-pull-data-between-sheets",
    kind: "formula",
    title: "Pull Data From Another Spreadsheet With IMPORTRANGE",
    seoTitle: "IMPORTRANGE: Link Two Google Sheets Files",
    description:
      "IMPORTRANGE streams a live block of data from one Google Sheets file into another — orders flow into your report without copy-pasting.",
    category: "google-sheets",
    difficulty: "beginner",
    functions: ["IMPORTRANGE"],
    keywords: ["importrange", "pull data from another spreadsheet", "link two google sheets", "importrange allow access", "reference another workbook"],
    problem:
      "Order data lives in one spreadsheet and your reporting lives in another — you need the orders to flow into the report live, not be copy-pasted every morning.",
    quickFormula: '=IMPORTRANGE("spreadsheet_url","Orders!A1:D20")',
    excelFormula: "='[Workbook.xlsx]Orders'!A1",
    sheetsFormula: '=IMPORTRANGE("spreadsheet_url","Orders!A1:D20")',
    explanation:
      "IMPORTRANGE is Google Sheets only: paste the source file's URL as the first argument, and the sheet-and-range — the whole thing in one quoted string, \"Orders!A1:D20\" — as the second, and the block spills into your report and keeps updating as the source changes. The first time you connect two files, the cell shows #REF! with an Allow access button: click it once and the grant is permanent for that source-and-destination pair (you need at least view permission on the source, and every user grants for themselves). Excel's equivalent is a direct cross-workbook reference like ='[Workbook.xlsx]Orders'!A1, which pulls a cell from another workbook — fine for a value or two, but for importing whole tables the robust Excel route is Power Query (Data > Get Data), a menu-driven feature rather than a formula.",
    steps: [
      { part: '"spreadsheet_url"', meaning: "The full URL of the source file, in quotes — copy it straight from the browser address bar." },
      { part: '"Orders!A1:D20"', meaning: "Sheet name and range as one quoted string. Leave off the sheet name to use the first sheet." },
    ],
    whenToUse:
      "Use it to feed a reporting file from a team's working file: orders into a revenue dashboard, project status into a client summary, invoice lists into a finance rollup — the source team keeps editing, your report stays current.",
    commonMistakes: [
      {
        mistake: "Stuck on #REF! — the permission loop.",
        fix: "Click the cell and press Allow access. If no button appears, you don't have view permission on the source file — access is granted per user, so every viewer of the report needs it.",
      },
      {
        mistake: "Forgetting the quotes around the range.",
        fix: "=IMPORTRANGE(url,Orders!A1:D20) fails — the second argument is one text string. Write it as \"Orders!A1:D20\", quotes included.",
      },
      {
        mistake: "Data already sitting where the import needs to land.",
        fix: "IMPORTRANGE spills the whole block; anything in the way triggers a #REF! \"result was not expanded\" error. Give it an empty area and don't type into the imported cells — they're read-only.",
      },
    ],
    sampleInput: {
      columns: ["Customer", "Item", "Amount"],
      rows: [
        ["Acme Co", "Monitors", "2400"],
        ["Borealis", "Cables", "950"],
      ],
    },
    sampleOutput: {
      columns: ["Customer", "Item", "Amount"],
      rows: [
        ["Acme Co", "Monitors", "2400"],
        ["Borealis", "Cables", "950"],
      ],
      highlightColumn: 0,
    },
    related: ["fix-ref-error", "vlookup-exact-match", "pull-latest-record"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: null,
  },
  {
    slug: "sparkline-mini-chart-in-cell",
    kind: "formula",
    title: "Show a Trend as a Mini Chart Inside a Cell",
    seoTitle: "SPARKLINE: In-Cell Mini Charts (Google Sheets)",
    description:
      "SPARKLINE draws a tiny chart inside a single cell — one per row shows every customer's sales trend at a glance, no chart objects needed.",
    category: "google-sheets",
    difficulty: "beginner",
    functions: ["SPARKLINE"],
    keywords: ["sparkline", "mini chart in cell", "trend line in cell", "in-cell chart", "tiny graph per row"],
    problem:
      "You track monthly sales per customer across twelve columns, and you want each row to show its trend at a glance — without building and positioning a chart for every single customer.",
    quickFormula: "=SPARKLINE(B2:M2)",
    excelFormula: "=SPARKLINE(B2:M2)",
    sheetsFormula: null,
    explanation:
      "SPARKLINE is a Google Sheets function that draws a miniature line chart inside the cell itself, plotting the row's twelve monthly values left to right — put one in every row and the whole table becomes scannable. A second argument customizes it with option pairs in curly braces: =SPARKLINE(B2:M2,{\"charttype\",\"column\";\"color\",\"green\"}) switches to tiny bars in green, and \"winloss\" or \"bar\" are also available. Excel offers the same visual but not as a formula — typing =SPARKLINE there returns #NAME?. In Excel you select the cells, go to Insert > Sparklines, and pick Line, Column, or Win/Loss; it's a menu feature attached to the cell, configured from the ribbon instead of by arguments.",
    steps: [
      { part: "B2:M2", meaning: "The numbers to plot — this row's January-through-December sales, drawn left to right." },
      { part: '{"charttype","column";"color","green"} (optional)', meaning: "Option pairs: comma between a setting and its value, semicolon between pairs." },
    ],
    whenToUse:
      "Use it wherever a number's direction matters more than its exact value: monthly sales per customer, weekly output per project, invoice volume per client — one glanceable trend per row of a summary table.",
    commonMistakes: [
      {
        mistake: "Typing =SPARKLINE into Excel.",
        fix: "Excel shows #NAME? — there is no SPARKLINE function there. Use Insert > Sparklines instead: select the data range and a location, and Excel draws the same in-cell chart as a feature, not a formula.",
      },
      {
        mistake: "Mixing up the separators in the options.",
        fix: 'It\'s comma between a setting and its value, semicolon between pairs: {"charttype","column";"color","green"}. Swap them and the formula errors.',
      },
      {
        mistake: "Text hiding in the data range.",
        fix: 'A stray "n/a" among the numbers breaks the chart. Blanks are fine (they show as gaps) — replace text placeholders with empty cells or numbers.',
      },
    ],
    sampleInput: {
      columns: ["Customer", "Jan", "Feb", "Mar"],
      rows: [
        ["Acme Co", "120", "150", "210"],
        ["Borealis", "300", "240", "180"],
      ],
    },
    sampleOutput: {
      columns: ["Customer", "Trend"],
      rows: [
        ["Acme Co", "▁▄█ rising"],
        ["Borealis", "█▄▁ falling"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-percentage-change", "summarize-by-month", "calculate-running-total"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: null,
  },
  {
    slug: "googlefinance-live-stock-price",
    kind: "formula",
    title: "Pull Live Stock Prices Into Your Spreadsheet",
    seoTitle: "GOOGLEFINANCE: Live Stock Prices in Google Sheets",
    description:
      "GOOGLEFINANCE fetches current and historical market prices straight into cells — a self-updating portfolio or holdings tracker in one formula.",
    category: "google-sheets",
    difficulty: "beginner",
    functions: ["GOOGLEFINANCE", "DATE"],
    keywords: ["googlefinance", "live stock price in spreadsheet", "stock portfolio tracker", "historical stock prices", "currency exchange rate formula"],
    problem:
      "You keep a portfolio or company-holdings tracker, and the share prices are stale the moment you type them — you want them to refresh themselves every time the file opens.",
    quickFormula: '=GOOGLEFINANCE("NASDAQ:AAPL","price")',
    excelFormula: '=GOOGLEFINANCE("NASDAQ:AAPL","price")',
    sheetsFormula: null,
    explanation:
      "GOOGLEFINANCE is a Google Sheets function that pulls market data from Google Finance: the first argument is the exchange-prefixed ticker, the second the attribute — \"price\" for the latest quote (delayed up to 20 minutes), or \"high\", \"low\", \"marketcap\", \"pe\" and others. Add dates for history: =GOOGLEFINANCE(\"NASDAQ:AAPL\",\"price\",DATE(2026,1,1),DATE(2026,6,30),\"DAILY\") spills a two-column table of dates and closing prices, ready for charting. It also does currencies — =GOOGLEFINANCE(\"CURRENCY:USDEUR\") returns the live exchange rate, handy for valuing foreign-currency invoices. Excel has no GOOGLEFINANCE; typing it returns #NAME?. The Excel equivalent is the Stocks data type: type the ticker in a cell, choose Data > Stocks, and pull fields like Price from the linked record — a data feature driven from the ribbon, not a formula you can copy.",
    steps: [
      { part: '"NASDAQ:AAPL"', meaning: "Exchange and ticker, colon-separated. The prefix keeps ambiguous tickers from pulling the wrong listing." },
      { part: '"price"', meaning: 'Which attribute to fetch. Try "high", "low", "volume", "marketcap", or "pe" for others.' },
    ],
    whenToUse:
      "Use it for a self-updating portfolio tracker, valuing company share holdings for a board pack, pulling exchange rates to convert foreign-currency invoices, or grabbing six months of price history to chart alongside your own sales data.",
    commonMistakes: [
      {
        mistake: "Leaving off the exchange prefix.",
        fix: '"AAPL" alone often works, but ambiguous tickers can resolve to the wrong exchange\'s listing. Write "NASDAQ:AAPL" or "NYSE:DIS" to pin it down.',
      },
      {
        mistake: "Treating the quote as real-time.",
        fix: "Prices can lag up to 20 minutes and are for reference only — fine for a tracker or report, not for timing trades.",
      },
      {
        mistake: "Expecting it to work in Excel.",
        fix: "Excel returns #NAME? — GOOGLEFINANCE doesn't exist there. Use Excel's Stocks data type instead: type the ticker, select Data > Stocks, then insert the Price field from the linked record.",
      },
      {
        mistake: "No room for the historical table.",
        fix: "The dated version spills a header row plus one row per trading day. If cells below are occupied you get a #REF! spill error — give it a clear area.",
      },
    ],
    sampleInput: {
      columns: ["Holding", "Shares"],
      rows: [
        ["NASDAQ:AAPL", "50"],
        ["NYSE:DIS", "120"],
      ],
    },
    sampleOutput: {
      columns: ["Holding", "Shares", "Price"],
      rows: [
        ["NASDAQ:AAPL", "50", "212.44"],
        ["NYSE:DIS", "120", "98.12"],
      ],
      highlightColumn: 2,
    },
    related: ["calculate-percentage-change", "calculate-profit-margin", "calculate-weighted-average"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: null,
  },
];
