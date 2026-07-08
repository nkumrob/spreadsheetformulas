import type { Formula } from "@/lib/schema";

export const summarizingFormulas: Formula[] = [
  {
    slug: "rank-values",
    kind: "formula",
    title: "Rank Values from Highest to Lowest",
    seoTitle: "RANK Formula for Excel & Google Sheets",
    description:
      "Assign each row its position in the list — 1 for the biggest number — with RANK, without sorting the data itself.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["RANK", "COUNTIF"],
    keywords: ["rank values", "rank formula", "leaderboard", "top performers", "rank sales"],
    problem:
      "You have a column of numbers — sales, scores, hours — and want each row labeled with its position in the pack, 1st through last, without reordering the sheet.",
    quickFormula: "=RANK(B2,$B$2:$B$20,0)",
    excelFormula: "=RANK(B2,$B$2:$B$20,0)",
    sheetsFormula: null,
    explanation:
      "RANK compares the value in B2 against every value in $B$2:$B$20 and returns its position. The third argument sets the direction: 0 (or leaving it out) means descending — the largest value gets rank 1 — while 1 means ascending, where the smallest wins. The $ signs anchor the range so it stays put as you fill the formula down; only B2 moves. Ties share a rank and skip the following ones: two values tied for 2nd both show 2, and the next value shows 4. In current Excel you'll also see RANK.EQ — it behaves identically, and plain RANK still works everywhere including Google Sheets.",
    steps: [
      { part: "B2", meaning: "The value to rank." },
      { part: "$B$2:$B$20", meaning: "The full list to rank against — anchored with $ so it doesn't shift when filled down." },
      { part: "0", meaning: "Descending order: the largest value gets rank 1. Use 1 to rank smallest first." },
    ],
    whenToUse:
      "Use this for sales leaderboards, test-score standings, and \"top 10\" reports — anywhere you want positions visible next to the data while keeping the sheet in its original order.",
    commonMistakes: [
      {
        mistake: "Forgetting the $ anchors, so ranks go wrong further down.",
        fix: "=RANK(B2,B2:B20,0) shifts the range one row per fill — by row 10 you're ranking against B10:B28. Anchor it: =RANK(B2,$B$2:$B$20,0).",
      },
      {
        mistake: "Ties skip ranks — two people show 2 and nobody shows 3.",
        fix: "That's how RANK works by design. If you need unique ranks, break ties by position: =RANK(B2,$B$2:$B$20,0)+COUNTIF($B$2:B2,B2)-1.",
      },
      {
        mistake: "The best performer shows the highest rank number instead of 1.",
        fix: "The direction argument is set to 1 (ascending), which rewards the smallest value. Use 0 for largest-first: =RANK(B2,$B$2:$B$20,0).",
      },
    ],
    sampleInput: {
      columns: ["Person", "Sales"],
      rows: [
        ["Ana Torres", "9200"],
        ["Ben Okafor", "4500"],
        ["Cara Lim", "7800"],
        ["Dana Cruz", "9200"],
      ],
    },
    sampleOutput: {
      columns: ["Person", "Sales", "Rank"],
      rows: [
        ["Ana Torres", "9200", "1"],
        ["Ben Okafor", "4500", "4"],
        ["Cara Lim", "7800", "3"],
        ["Dana Cruz", "9200", "1"],
      ],
      highlightColumn: 2,
    },
    related: ["find-highest-value-by-category", "calculate-running-total", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Deal", "Value", "Rank"],
          ["Acme", 40, "=RANK(B2,$B$2:$B$5,0)"],
          ["Borealis", 10, "=RANK(B3,$B$2:$B$5,0)"],
          ["Cobalt", 40, "=RANK(B4,$B$2:$B$5,0)"],
          ["Delta", 25, "=RANK(B5,$B$2:$B$5,1)"],
        ],
      },
      expect: [
        { cell: "C2", value: 1 },
        { cell: "C3", value: 4 },
        { cell: "C4", value: 1 },
        { cell: "C5", value: 2 },
      ],
    },
  },
  {
    slug: "calculate-running-total",
    kind: "formula",
    title: "Calculate a Running Total Down a Column",
    seoTitle: "Running Total Formula in Excel & Google Sheets",
    description:
      "Build a cumulative sum with SUM($B$2:B2) — the anchored-start range expands one row at a time as you fill down.",
    category: "counting-summarizing",
    difficulty: "beginner",
    functions: ["SUM"],
    keywords: ["running total", "cumulative sum", "running balance", "sum so far", "cumulative total"],
    problem:
      "You have a column of amounts — deposits, sales, hours — and next to each row you want the total so far, from the top of the list down to that row.",
    quickFormula: "=SUM($B$2:B2)",
    excelFormula: "=SUM($B$2:B2)",
    sheetsFormula: null,
    explanation:
      "The trick is anchoring only the start of the range. $B$2 is locked with $ signs, so it never moves; B2 is relative, so it shifts down as you fill the formula down. In row 2 the range is $B$2:B2 (one cell), in row 3 it becomes $B$2:B3, in row 4 $B$2:B4 — an expanding range that always sums from the first amount down to the current row. That's the entire mechanism: one anchored end, one moving end. It works identically in Excel and Google Sheets and needs no helper columns.",
    steps: [
      { part: "$B$2", meaning: "The anchored start of the range — the $ signs keep it fixed on the first amount." },
      { part: ":B2", meaning: "The relative end — it becomes B3, B4, B5 as you fill down, so the range grows." },
      { part: "SUM(…)", meaning: "Adds everything from the top of the list to the current row." },
    ],
    whenToUse:
      "Use this for account balances after each transaction, cumulative sales toward a target, year-to-date totals, and burn-down or burn-up tracking in project sheets.",
    commonMistakes: [
      {
        mistake: "Anchoring both ends — every row shows the same number.",
        fix: "=SUM($B$2:$B$2) never expands. Anchor only the start: =SUM($B$2:B2). Anchoring neither end is just as wrong — each row sums only itself.",
      },
      {
        mistake: "Sorting the data after adding the running total.",
        fix: "The cumulative order is baked into row positions, so sorting scrambles the story the totals tell. Sort the source data first, then fill the running total down.",
      },
      {
        mistake: "Starting the anchor on the header row.",
        fix: "=SUM($B$1:B2) tries to include the header. With a text header SUM ignores it silently, but the habit breaks the moment row 1 holds a number. Anchor on the first data row: $B$2.",
      },
    ],
    sampleInput: {
      columns: ["Date", "Amount"],
      rows: [
        ["2026-07-01", "1200"],
        ["2026-07-02", "800"],
        ["2026-07-03", "1500"],
      ],
    },
    sampleOutput: {
      columns: ["Date", "Amount", "Running Total"],
      rows: [
        ["2026-07-01", "1200", "1200"],
        ["2026-07-02", "800", "2000"],
        ["2026-07-03", "1500", "3500"],
      ],
      highlightColumn: 2,
    },
    related: ["sum-if-multiple-conditions", "summarize-by-month", "rank-values"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Date", "Amount", "Running Total"],
          ["2026-07-01", 1200, "=SUM($B$2:B2)"],
          ["2026-07-02", 800, "=SUM($B$2:B3)"],
          ["2026-07-03", 1500, "=SUM($B$2:B4)"],
        ],
      },
      expect: [
        { cell: "C2", value: 1200 },
        { cell: "C3", value: 2000 },
        { cell: "C4", value: 3500 },
      ],
    },
  },
  {
    slug: "pull-latest-record",
    kind: "formula",
    title: "Pull the Latest Record for a Name",
    seoTitle: "Find the Last Matching Entry in Excel & Sheets",
    description:
      "Get the most recent entry for a person or item with XLOOKUP searching bottom-up — perfect for logs where new rows land at the end.",
    category: "lookup-matching",
    difficulty: "intermediate",
    functions: ["XLOOKUP", "LOOKUP"],
    keywords: ["last match", "latest entry", "most recent record", "xlookup last", "lookup bottom up"],
    problem:
      "Your log adds a new row every time something happens — a status update, a payment, a check-in — and the same name appears many times. You need each name's most recent entry, not its first.",
    quickFormula: '=XLOOKUP(E2,A:A,B:B,"",0,-1)',
    excelFormula: '=XLOOKUP(E2,A:A,B:B,"",0,-1)',
    sheetsFormula: null,
    explanation:
      "Normal lookups stop at the first match from the top — the oldest entry in an append-style log. XLOOKUP's sixth argument flips the direction: -1 means search last-to-first, so the first match it finds is the bottom-most row, which is the newest entry when rows are added chronologically. The 0 before it is the match mode (exact match), and the \"\" is what to return when the name isn't found at all, instead of #N/A. XLOOKUP needs Excel 365 or Excel 2021; Google Sheets has it too, with the same arguments.",
    steps: [
      { part: "E2", meaning: "The name to look up." },
      { part: "A:A,B:B", meaning: "Search column A, return the matching value from column B." },
      { part: '""', meaning: "What to show when there's no match at all — a blank instead of #N/A." },
      { part: "0", meaning: "Match mode: exact match only." },
      { part: "-1", meaning: "Search mode: scan from the last row up, so the bottom-most match wins." },
    ],
    whenToUse:
      "Use this on status logs, payment histories, ticket updates, and check-in sheets — any table where rows are appended over time and \"current state\" means the last row for each name.",
    commonMistakes: [
      {
        mistake: "XLOOKUP isn't available in older Excel.",
        fix: "Excel 2019 and earlier lack XLOOKUP. Use the legacy last-match trick instead: =LOOKUP(2,1/(A:A=E2),B:B) — it also returns the bottom-most match.",
      },
      {
        mistake: "Putting -1 in the wrong slot.",
        fix: '=XLOOKUP(E2,A:A,B:B,"",-1) sets match mode to -1 (exact or next smaller), not the search direction. The search mode is the sixth argument: =XLOOKUP(E2,A:A,B:B,"",0,-1).',
      },
      {
        mistake: "The log isn't in chronological order, so the last row isn't the latest.",
        fix: "Bottom-up search only equals \"most recent\" when new rows go at the bottom. If the log gets sorted or merged, sort it by date ascending first — or look up by the maximum date instead.",
      },
    ],
    sampleInput: {
      columns: ["Person", "Status"],
      rows: [
        ["Ana Torres", "Submitted"],
        ["Ben Okafor", "Submitted"],
        ["Ana Torres", "In Review"],
        ["Ana Torres", "Approved"],
      ],
    },
    sampleOutput: {
      columns: ["Lookup", "Latest Status"],
      rows: [
        ["Ana Torres", "Approved"],
        ["Ben Okafor", "Submitted"],
      ],
      highlightColumn: 1,
    },
    related: ["xlookup-basic-example", "vlookup-exact-match", "index-match-lookup"],
    lastReviewed: "2026-07-08",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Person", "Status", null, null, "Lookup", "Latest Status"],
          ["Ana Torres", "Submitted", null, null, "Ana Torres", '=XLOOKUP(E2,A2:A5,B2:B5,"",0,-1)'],
          ["Ben Okafor", "Submitted", null, null, "Ben Okafor", '=XLOOKUP(E3,A2:A5,B2:B5,"",0,-1)'],
          ["Ana Torres", "In Review", null, null, "Cara Lim", '=XLOOKUP(E4,A2:A5,B2:B5,"",0,-1)'],
          ["Ana Torres", "Approved", null, null, null, null],
        ],
      },
      expect: [
        { cell: "F2", value: "Approved" },
        { cell: "F3", value: "Submitted" },
        { cell: "F4", value: "" },
      ],
    },
  },
];
