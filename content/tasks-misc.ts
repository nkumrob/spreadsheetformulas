import type { Formula } from "@/lib/schema";

export const tasksMiscFormulas: Formula[] = [
  {
    slug: "two-way-lookup-index-match",
    kind: "formula",
    title: "Two-Way Lookup with INDEX and MATCH",
    seoTitle: "Two-Way Lookup: INDEX MATCH (Excel & Sheets)",
    description:
      "Pull a value from a grid by matching both a row label and a column header — one MATCH finds the row, another finds the column.",
    category: "lookup-matching",
    difficulty: "intermediate",
    functions: ["INDEX", "MATCH"],
    keywords: ["two way lookup", "index match match", "lookup row and column", "matrix lookup", "lookup grid"],
    problem:
      "Your data is a grid — products down the side, pricing tiers across the top — and you need the value where a chosen row and a chosen column intersect.",
    quickFormula: "=INDEX(B2:D5,MATCH(F2,A2:A5,0),MATCH(G2,B1:D1,0))",
    excelFormula: "=INDEX(B2:D5,MATCH(F2,A2:A5,0),MATCH(G2,B1:D1,0))",
    sheetsFormula: null,
    explanation:
      "INDEX returns the value at a given row and column of a range — the trick is letting two MATCH functions supply those coordinates. The first MATCH finds your row label in the side column (Monitor is the 3rd row), the second finds your column header in the top row (Standard is the 2nd column), and INDEX grabs the cell where they cross. The 0 in each MATCH forces an exact match, so a typo returns #N/A instead of a silently wrong price. Because both lookups are dynamic, changing either dropdown cell instantly repoints the whole formula.",
    steps: [
      { part: "B2:D5", meaning: "The grid of values only — no row labels, no headers." },
      { part: "MATCH(F2,A2:A5,0)", meaning: "Finds which ROW your label sits in. Monitor → 3." },
      { part: "MATCH(G2,B1:D1,0)", meaning: "Finds which COLUMN your header sits in. Standard → 2." },
      { part: "0", meaning: "Exact match. Always use it — the default approximate mode misfires on unsorted data." },
    ],
    whenToUse:
      "Use it on any matrix-shaped table: price by product and tier, shipping cost by zone and weight, staffing by team and month — anywhere the answer lives at a row/column intersection.",
    commonMistakes: [
      {
        mistake: "Including the labels and headers inside the INDEX range.",
        fix: "If INDEX covers A1:D5 but MATCH counts from A2 and B1, everything shifts by one. Keep INDEX on the values only (B2:D5) and point each MATCH at the matching labels.",
      },
      {
        mistake: "Swapping the two MATCH functions.",
        fix: "INDEX takes row first, then column. If the row MATCH scans the header row, you get #REF! or the wrong cell. Row lookup scans the side column; column lookup scans the top row.",
      },
      {
        mistake: "Omitting the 0 in MATCH.",
        fix: "Without it, MATCH assumes sorted data and returns the nearest position. Always write MATCH(value,range,0).",
      },
    ],
    sampleInput: {
      columns: ["Product", "Basic", "Standard", "Premium"],
      rows: [["Notebook", "10", "12", "15"], ["Stapler", "20", "24", "30"], ["Monitor", "30", "36", "45"]],
    },
    sampleOutput: {
      columns: ["Product", "Tier", "Price"],
      rows: [["Monitor", "Standard", "36"]],
      highlightColumn: 2,
    },
    related: ["index-match-lookup", "xlookup-basic-example", "vlookup-exact-match"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Product", "Basic", "Standard", "Premium", null, "Want", "Tier", "Price"],
          ["Notebook", 10, 12, 15, null, "Monitor", "Standard", "=INDEX(B2:D5,MATCH(F2,A2:A5,0),MATCH(G2,B1:D1,0))"],
          ["Stapler", 20, 24, 30, null, "Desk", "Premium", "=INDEX(B2:D5,MATCH(F3,A2:A5,0),MATCH(G3,B1:D1,0))"],
          ["Monitor", 30, 36, 45, null, null, null, null],
          ["Desk", 50, 60, 75, null, null, null, null],
        ],
      },
      expect: [
        { cell: "H2", value: 36 },
        { cell: "H3", value: 75 },
      ],
    },
  },
  {
    slug: "lookup-with-multiple-criteria",
    kind: "formula",
    title: "Look Up a Value Using Multiple Criteria",
    seoTitle: "Lookup with Multiple Criteria (Excel & Sheets)",
    description:
      "Match on two columns at once — like region AND product — by joining them into one helper key and looking that up with XLOOKUP.",
    category: "lookup-matching",
    difficulty: "intermediate",
    functions: ["XLOOKUP"],
    keywords: ["lookup two criteria", "xlookup multiple criteria", "match two columns", "lookup with two conditions", "helper column lookup"],
    problem:
      "No single column identifies the row you need — the price depends on region AND product together, so a normal lookup on either column alone grabs the wrong row.",
    quickFormula: '=XLOOKUP(F2&"|"&G2,D2:D5,C2:C5)',
    excelFormula: '=XLOOKUP(F2&"|"&G2,D2:D5,C2:C5)',
    sheetsFormula: null,
    explanation:
      "The helper-column approach turns a two-criteria problem into a one-criteria problem. In column D, build a key that glues both criteria together: =A2&\"|\"&B2 gives \"West|Stapler\". The pipe separator matters — without it, \"East\"&\"1\" and \"Eas\"&\"t1\" would collide. Then XLOOKUP joins your two search values the same way and finds the combined key in one pass. XLOOKUP needs Excel 365/2021 or Google Sheets; on older Excel, swap in INDEX + MATCH against the same key column. If you'd rather avoid the helper column, the array form =INDEX(C2:C5,MATCH(1,(A2:A5=F2)*(B2:B5=G2),0)) does it in one cell, at the cost of readability.",
    steps: [
      { part: '=A2&"|"&B2 (helper, column D)', meaning: "Joins the two criteria columns into one unique key per row." },
      { part: 'F2&"|"&G2', meaning: "Builds the same combined key from your two search values — the join must match the helper exactly." },
      { part: "D2:D5", meaning: "Where to search: the helper key column." },
      { part: "C2:C5", meaning: "What to return: the value column for the matching row." },
    ],
    whenToUse:
      "Use it when rows are only unique in combination: price by region and product, rate by employee and month, stock by warehouse and SKU.",
    commonMistakes: [
      {
        mistake: "Joining without a separator.",
        fix: '=A2&B2 can produce identical keys from different rows. Always insert a character that never appears in the data: =A2&"|"&B2.',
      },
      {
        mistake: "Building the search key in a different order than the helper.",
        fix: 'If the helper is Region|Product, the lookup must be F2&"|"&G2 in that same order — Product|Region finds nothing and returns #N/A.',
      },
      {
        mistake: "Using XLOOKUP in Excel 2019 or older.",
        fix: "It shows #NAME?. Use =INDEX(C2:C5,MATCH(F2&\"|\"&G2,D2:D5,0)) against the same helper column instead.",
      },
    ],
    sampleInput: {
      columns: ["Region", "Product", "Price", "Key"],
      rows: [
        ["East", "Notebook", "12", "East|Notebook"],
        ["East", "Stapler", "24", "East|Stapler"],
        ["West", "Stapler", "27", "West|Stapler"],
      ],
    },
    sampleOutput: {
      columns: ["Region", "Product", "Price"],
      rows: [["West", "Stapler", "27"]],
      highlightColumn: 2,
    },
    related: ["xlookup-basic-example", "index-match-lookup", "count-if-multiple-conditions"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Region", "Product", "Price", "Key", null, "Region", "Product", "Price"],
          ["East", "Notebook", 12, '=A2&"|"&B2', null, "West", "Stapler", '=XLOOKUP(F2&"|"&G2,D2:D5,C2:C5)'],
          ["East", "Stapler", 24, '=A3&"|"&B3', null, "East", "Notebook", '=XLOOKUP(F3&"|"&G3,D2:D5,C2:C5)'],
          ["West", "Notebook", 14, '=A4&"|"&B4', null, null, null, null],
          ["West", "Stapler", 27, '=A5&"|"&B5', null, null, null, null],
        ],
      },
      expect: [
        { cell: "D2", value: "East|Notebook" },
        { cell: "H2", value: 27 },
        { cell: "H3", value: 12 },
      ],
    },
  },
  {
    slug: "extract-text-between-characters",
    kind: "formula",
    title: "Extract Text Between Two Characters",
    seoTitle: "Extract Text Between Characters (Excel & Sheets)",
    description:
      "Pull the text inside parentheses or between any two markers — FIND locates both characters and MID grabs what sits between them.",
    category: "text-cleanup",
    difficulty: "intermediate",
    functions: ["MID", "FIND"],
    keywords: ["extract text between characters", "text inside parentheses", "extract between brackets", "mid find formula", "pull text between"],
    problem:
      "Cells like \"Acme (west)\" bury the piece you need between two markers, and you have hundreds of rows — you need just the \"west\" out of every one.",
    quickFormula: '=MID(A2,FIND("(",A2)+1,FIND(")",A2)-FIND("(",A2)-1)',
    excelFormula: '=MID(A2,FIND("(",A2)+1,FIND(")",A2)-FIND("(",A2)-1)',
    sheetsFormula: null,
    explanation:
      "MID needs three things: the text, where to start, and how many characters to take — and the two FIND calls compute both numbers. FIND(\"(\",A2) returns the position of the opening parenthesis, so adding 1 starts extraction just after it. The length is the distance between the markers: closing position minus opening position minus 1, which excludes both parentheses themselves. In \"Acme (west)\" the \"(\" is at position 6 and the \")\" at 11, so MID starts at 7 and takes 11−6−1 = 4 characters: \"west\". Swap the two characters for any markers — dashes, brackets, colons.",
    steps: [
      { part: 'FIND("(",A2)+1', meaning: "Position of the opening marker, plus 1 to start just after it." },
      { part: 'FIND(")",A2)-FIND("(",A2)-1', meaning: "Distance between the markers minus 1 — the exact length of the text inside." },
      { part: "MID(A2, start, length)", meaning: "Extracts that many characters from the start position." },
    ],
    whenToUse:
      "Use it for region codes in parentheses, order numbers in brackets, values between dashes in SKUs — any export where the useful part sits between two fixed characters.",
    commonMistakes: [
      {
        mistake: "A row is missing one of the markers.",
        fix: 'FIND returns #VALUE! when the character is absent, killing the row. Wrap it: =IFERROR(MID(A2,FIND("(",A2)+1,FIND(")",A2)-FIND("(",A2)-1),"").',
      },
      {
        mistake: "Forgetting the -1 on the length.",
        fix: 'Without it the closing marker is included: "west)" instead of "west". The length must subtract positions AND one extra for the marker itself.',
      },
      {
        mistake: "Using FIND when the marker's case varies.",
        fix: "FIND is case-sensitive — fine for parentheses, but if your marker is a letter like \"x\", use SEARCH instead, which ignores case.",
      },
    ],
    sampleInput: {
      columns: ["Account"],
      rows: [["Acme (west)"], ["Borealis (east)"], ["Cobalt (north)"]],
    },
    sampleOutput: {
      columns: ["Account", "Region"],
      rows: [
        ["Acme (west)", "west"],
        ["Borealis (east)", "east"],
        ["Cobalt (north)", "north"],
      ],
      highlightColumn: 1,
    },
    related: ["extract-first-name", "split-text-by-delimiter", "substitute-find-and-replace"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Account", "Region"],
          ["Acme (west)", '=MID(A2,FIND("(",A2)+1,FIND(")",A2)-FIND("(",A2)-1)'],
          ["Borealis (east)", '=MID(A3,FIND("(",A3)+1,FIND(")",A3)-FIND("(",A3)-1)'],
        ],
      },
      expect: [
        { cell: "B2", value: "west" },
        { cell: "B3", value: "east" },
      ],
    },
  },
  {
    slug: "count-words-in-cell",
    kind: "formula",
    title: "Count the Words in a Cell",
    seoTitle: "Count Words in a Cell (Excel & Google Sheets)",
    description:
      "Count words by counting spaces: strip the spaces out with SUBSTITUTE, compare lengths, and add 1 — with TRIM handling messy spacing.",
    category: "text-cleanup",
    difficulty: "intermediate",
    functions: ["LEN", "TRIM", "SUBSTITUTE"],
    keywords: ["count words in cell", "word count formula", "number of words", "len substitute trick", "count words excel"],
    problem:
      "You need a word count per cell — task descriptions, survey answers, product titles — and the spreadsheet has no WORDCOUNT function.",
    quickFormula: '=LEN(TRIM(A2))-LEN(SUBSTITUTE(TRIM(A2)," ",""))+1',
    excelFormula: '=LEN(TRIM(A2))-LEN(SUBSTITUTE(TRIM(A2)," ",""))+1',
    sheetsFormula: null,
    explanation:
      "A cell with N words contains N−1 spaces, so counting spaces and adding 1 gives the word count. The formula measures the length of the text, then measures it again with every space removed by SUBSTITUTE — the difference is the number of spaces. TRIM is what makes it reliable on real data: it removes leading and trailing spaces and collapses runs of spaces into single ones, so \"quarterly   budget review\" still counts as 3, not 5. Without TRIM, every stray double space inflates the count.",
    steps: [
      { part: "TRIM(A2)", meaning: "Cleans the text first — no leading/trailing spaces, no doubled spaces between words." },
      { part: "LEN(TRIM(A2))", meaning: "Length of the cleaned text, spaces included." },
      { part: 'LEN(SUBSTITUTE(TRIM(A2)," ",""))', meaning: "Length with every space deleted. The difference between the two = number of spaces." },
      { part: "+1", meaning: "N spaces separate N+1 words." },
    ],
    whenToUse:
      "Use it to enforce length rules on descriptions, spot one-word survey answers worth ignoring, or QA product titles that must stay under a word limit.",
    commonMistakes: [
      {
        mistake: "An empty cell counts as 1 word.",
        fix: 'The +1 fires even on nothing. Guard it: =IF(TRIM(A2)="",0,LEN(TRIM(A2))-LEN(SUBSTITUTE(TRIM(A2)," ",""))+1).',
      },
      {
        mistake: "Skipping TRIM.",
        fix: '=LEN(A2)-LEN(SUBSTITUTE(A2," ",""))+1 counts every extra space as a word — " Ana  Torres " comes back as 4 or 5 instead of 2. Always TRIM both LEN calls.',
      },
      {
        mistake: "Text separated by line breaks instead of spaces.",
        fix: 'Words split by Alt+Enter have no spaces between them. Convert breaks first: SUBSTITUTE(A2,CHAR(10)," ") inside the TRIM.',
      },
    ],
    sampleInput: {
      columns: ["Task"],
      rows: [["follow up with vendor"], ["quarterly   budget review"], ["invoice"]],
    },
    sampleOutput: {
      columns: ["Task", "Words"],
      rows: [["follow up with vendor", "4"], ["quarterly   budget review", "3"], ["invoice", "1"]],
      highlightColumn: 1,
    },
    related: ["remove-extra-spaces", "split-text-by-delimiter", "extract-first-name"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Task", "Words"],
          ["follow up with vendor", '=LEN(TRIM(A2))-LEN(SUBSTITUTE(TRIM(A2)," ",""))+1'],
          ["quarterly   budget review", '=LEN(TRIM(A3))-LEN(SUBSTITUTE(TRIM(A3)," ",""))+1'],
          ["invoice", '=LEN(TRIM(A4))-LEN(SUBSTITUTE(TRIM(A4)," ",""))+1'],
        ],
      },
      expect: [
        { cell: "B2", value: 4 },
        { cell: "B3", value: 3 },
        { cell: "B4", value: 1 },
      ],
    },
  },
  {
    slug: "swap-first-and-last-name",
    kind: "formula",
    title: "Swap Last Name, First Name into First Last",
    seoTitle: "Swap First and Last Name (Excel & Google Sheets)",
    description:
      "Turn \"Torres, Ana\" into \"Ana Torres\" — MID pulls everything after the comma, LEFT grabs everything before it, and & rejoins them.",
    category: "text-cleanup",
    difficulty: "intermediate",
    functions: ["MID", "FIND", "LEFT"],
    keywords: ["swap first and last name", "reverse last name first name", "flip names in excel", "last comma first to first last", "reorder names"],
    problem:
      "An export lists people as \"Last, First\" — \"Torres, Ana\" — but your mail merge, CRM, or report needs the natural \"Ana Torres\" order.",
    quickFormula: '=MID(A2,FIND(",",A2)+2,99)&" "&LEFT(A2,FIND(",",A2)-1)',
    excelFormula: '=MID(A2,FIND(",",A2)+2,99)&" "&LEFT(A2,FIND(",",A2)-1)',
    sheetsFormula: null,
    explanation:
      "The comma's position, found once by FIND, splits the cell into two halves. MID starts 2 characters after the comma — skipping the comma itself and the space that follows — and the 99 just means \"take everything to the end\" (any number longer than the name works). LEFT takes the characters before the comma: the position minus 1 excludes the comma itself. The & operator glues the two halves back together with a space between them, so \"Torres, Ana\" becomes \"Ana Torres\". Once the formulas are filled down, copy the column and Paste Special → Values to replace the originals.",
    steps: [
      { part: 'FIND(",",A2)', meaning: 'Position of the comma — the pivot point. In "Torres, Ana" it\'s 7.' },
      { part: "MID(A2,…+2,99)", meaning: "The first name: starts after the comma and its trailing space, takes up to 99 characters." },
      { part: '&" "&', meaning: "Joins the two pieces with a single space." },
      { part: "LEFT(A2,…-1)", meaning: "The last name: everything before the comma." },
    ],
    whenToUse:
      "Use it on HR exports, payroll files, and directory dumps that arrive \"Last, First\" when your template, badge printer, or email tool expects \"First Last.\"",
    commonMistakes: [
      {
        mistake: "The export has no space after the comma.",
        fix: '"Torres,Ana" with the +2 chops the A off. Use +1 instead, or make it robust either way: =TRIM(MID(A2,FIND(",",A2)+1,99))&" "&LEFT(A2,FIND(",",A2)-1).',
      },
      {
        mistake: "Some rows have no comma at all.",
        fix: 'FIND returns #VALUE! on "Ana Torres" rows that are already correct. Guard them: =IFERROR(MID(A2,FIND(",",A2)+2,99)&" "&LEFT(A2,FIND(",",A2)-1),A2).',
      },
      {
        mistake: "Deleting the original column while the formulas still point at it.",
        fix: "The results turn to #REF!. Convert the formula column to plain text first with Copy → Paste Special → Values.",
      },
    ],
    sampleInput: {
      columns: ["Name (Last, First)"],
      rows: [["Torres, Ana"], ["Okafor, Ben"], ["Lim, Cara"]],
    },
    sampleOutput: {
      columns: ["Name (Last, First)", "First Last"],
      rows: [["Torres, Ana", "Ana Torres"], ["Okafor, Ben", "Ben Okafor"], ["Lim, Cara", "Cara Lim"]],
      highlightColumn: 1,
    },
    related: ["extract-first-name", "extract-last-name", "combine-first-and-last-name"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Name", "Swapped"],
          ["Torres, Ana", '=MID(A2,FIND(",",A2)+2,99)&" "&LEFT(A2,FIND(",",A2)-1)'],
          ["Okafor, Ben", '=MID(A3,FIND(",",A3)+2,99)&" "&LEFT(A3,FIND(",",A3)-1)'],
        ],
      },
      expect: [
        { cell: "B2", value: "Ana Torres" },
        { cell: "B3", value: "Ben Okafor" },
      ],
    },
  },
  {
    slug: "remove-characters-from-text",
    kind: "formula",
    title: "Remove Characters from the Start, End, or Anywhere",
    seoTitle: "Remove Characters from Text (Excel & Sheets)",
    description:
      "Strip the first N characters with MID, the last N with LEFT and LEN, or every copy of a specific character with SUBSTITUTE.",
    category: "text-cleanup",
    difficulty: "beginner",
    functions: ["MID", "LEFT", "LEN", "SUBSTITUTE"],
    keywords: ["remove first characters", "remove last characters", "strip characters from cell", "delete prefix excel", "remove character from text"],
    problem:
      "Every cell carries junk you need gone — a 2-character prefix on order IDs, a trailing country code, or dashes scattered through SKUs.",
    quickFormula: "=MID(A2,3,999)",
    excelFormula: "=MID(A2,3,999)",
    sheetsFormula: null,
    explanation:
      "Three tools cover the three cases. To drop the first N characters, start MID at position N+1 and take a huge length — =MID(A2,3,999) skips 2 characters and 999 simply means \"the rest of the text.\" To drop the last N characters, keep everything except them: =LEFT(A2,LEN(A2)-2) measures the full length and keeps all but the final 2. To delete a specific character wherever it appears, replace it with nothing: =SUBSTITUTE(A2,\"-\",\"\"). These are safe on every row because they work from positions and lengths, not from what the characters actually are.",
    steps: [
      { part: "MID(A2,3,999)", meaning: "Remove the first 2 characters: start at the 3rd, take everything after. To remove N, start at N+1." },
      { part: "LEFT(A2,LEN(A2)-2)", meaning: "Remove the last 2 characters: keep the length minus 2. To remove N, subtract N." },
      { part: 'SUBSTITUTE(A2,"-","")', meaning: "Remove every dash, wherever it sits. Swap in any character or substring." },
    ],
    whenToUse:
      "Use it to strip system prefixes off order numbers, drop \"-US\" style suffixes before matching lists, or clean dashes and spaces out of phone numbers and SKUs before a lookup.",
    commonMistakes: [
      {
        mistake: "Using MID(A2,2,999) to remove 2 characters.",
        fix: "MID's second argument is where to START, not how many to skip. To remove 2 characters, start at 3: =MID(A2,3,999).",
      },
      {
        mistake: "LEFT(A2,LEN(A2)-2) on cells shorter than 2 characters.",
        fix: "A negative length returns #VALUE!. Guard short or blank cells: =LEFT(A2,MAX(LEN(A2)-2,0)).",
      },
      {
        mistake: "Expecting SUBSTITUTE to change the original cell.",
        fix: "Formulas never edit their source. Put the formula in a helper column, then Copy → Paste Special → Values over the original if you want it replaced.",
      },
    ],
    sampleInput: {
      columns: ["Raw"],
      rows: [["ID4821"], ["INV-2041-US"], ["555-0142"]],
    },
    sampleOutput: {
      columns: ["Raw", "Cleaned", "Method"],
      rows: [
        ["ID4821", "4821", "MID — first 2 off"],
        ["INV-2041-US", "INV-2041", "LEFT — last 3 off"],
        ["555-0142", "5550142", "SUBSTITUTE"],
      ],
      highlightColumn: 1,
    },
    related: ["substitute-find-and-replace", "remove-extra-spaces", "extract-numbers-from-text"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Raw", "Result"],
          ["ID4821", "=MID(A2,3,999)"],
          ["INV-2041-US", "=LEFT(A3,LEN(A3)-3)"],
          ["555-0142", '=SUBSTITUTE(A4,"-","")'],
        ],
      },
      expect: [
        { cell: "B2", value: "4821" },
        { cell: "B3", value: "INV-2041" },
        { cell: "B4", value: "5550142" },
      ],
    },
  },
  {
    slug: "lock-cell-reference-dollar-sign",
    kind: "formula",
    title: "Lock a Cell Reference with the Dollar Sign",
    seoTitle: "Lock Cell Reference with $ (Excel & Sheets)",
    description:
      "The $ sign stops a reference from shifting when you copy a formula — $E$1 stays pinned on every row while B2 moves with it.",
    category: "excel",
    difficulty: "beginner",
    functions: [],
    keywords: ["dollar sign in excel formula", "absolute reference", "lock cell reference", "f4 absolute reference", "keep cell constant when copying"],
    problem:
      "One cell holds a rate or constant, and every row must multiply by it — but when you copy the formula down, the reference slides off the rate cell and the answers go wrong.",
    quickFormula: "=B2*$E$1",
    excelFormula: "=B2*$E$1",
    sheetsFormula: null,
    explanation:
      "References are relative by default: copy =B2*E1 down one row and it silently becomes =B3*E2 — B3 is what you want, but E2 is an empty cell, so the result is 0. A $ freezes whatever it sits in front of: $E$1 locks both the column and the row, so the copied formulas read =B3*$E$1, =B4*$E$1 — the sales figure moves, the rate stays pinned. That mix of one moving reference and one locked reference is the pattern behind nearly every \"rate times each row\" calculation. The shortcut: click the reference in the formula bar and press F4 (Excel and Sheets on Windows, Cmd+T or fn+F4 on Mac) to cycle through $E$1 → E$1 → $E1 → E1.",
    steps: [
      { part: "B2", meaning: "Relative — shifts to B3, B4 as you copy down. That's what you want for the per-row value." },
      { part: "$E$1", meaning: "Absolute — the $ before the column AND the row pins it to E1 on every copy." },
      { part: "E$1 or $E1", meaning: "Mixed — locks only the row or only the column. Used when filling both across and down." },
    ],
    whenToUse:
      "Use it any time one cell feeds many formulas: a tax rate, a commission percentage, an exchange rate, a grand total you're dividing by — set it once at the top and lock every reference to it.",
    commonMistakes: [
      {
        mistake: "Copying =B2*E1 down without the $.",
        fix: "Row 3 becomes =B3*E2, multiplying by an empty cell — every row after the first shows 0. Lock the rate: =B2*$E$1.",
      },
      {
        mistake: "Locking only half: E$1 when you also fill across.",
        fix: "E$1 pins the row but the column still slides — filling right turns it into F$1. If the constant must never move in any direction, use both dollars: $E$1.",
      },
      {
        mistake: "Locking the wrong reference.",
        fix: "=$B$2*E1 freezes the sales figure and lets the rate wander — every row repeats row 2's answer. The $ belongs on the shared constant, not the per-row value.",
      },
    ],
    sampleInput: {
      columns: ["Rep", "Sales", "Rate (E1)"],
      rows: [["Ana Torres", "2000", "0.05"], ["Ben Okafor", "3000", ""], ["Cara Lim", "4500", ""]],
    },
    sampleOutput: {
      columns: ["Rep", "Sales", "Commission"],
      rows: [
        ["Ana Torres", "2000", "100"],
        ["Ben Okafor", "3000", "150"],
        ["Cara Lim", "4500", "225"],
      ],
      highlightColumn: 2,
    },
    related: ["calculate-percentage-of-total", "vlookup-exact-match", "fix-ref-error"],
    lastReviewed: "2026-07-09",
    published: true,
    // Column C holds the anchored formula exactly as it looks on each row after
    // copying down; D shows the unanchored version drifting onto empty E2.
    verification: {
      sheets: {
        Sheet1: [
          ["Rep", "Sales", "Locked", "Unlocked", 0.05],
          ["Ana Torres", 2000, "=B2*$E$1", "=B2*E1", null],
          ["Ben Okafor", 3000, "=B3*$E$1", "=B3*E2", null],
          ["Cara Lim", 4500, "=B4*$E$1", null, null],
        ],
      },
      expect: [
        { cell: "C2", value: 100 },
        { cell: "C3", value: 150 },
        { cell: "C4", value: 225 },
        { cell: "D3", value: 0 },
      ],
    },
  },
];
