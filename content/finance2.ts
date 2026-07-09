import type { Formula } from "@/lib/schema";

export const finance2Formulas: Formula[] = [
  {
    slug: "calculate-cagr",
    kind: "formula",
    title: "Calculate CAGR (Compound Annual Growth Rate)",
    seoTitle: "CAGR Formula in Excel & Google Sheets",
    description:
      "One formula turns a start value, end value, and number of years into the steady annual growth rate — the honest way to compare growth.",
    category: "finance-business",
    difficulty: "intermediate",
    functions: [],
    keywords: ["cagr formula", "compound annual growth rate", "annualized growth", "growth rate over years", "average annual growth"],
    problem:
      "Revenue went from 1,000 to 1,728 over three years. Saying \"it grew 72.8%\" hides the timeline — you need the single yearly rate that compounds to that result.",
    quickFormula: "=(B2/A2)^(1/C2)-1",
    excelFormula: "=(B2/A2)^(1/C2)-1",
    sheetsFormula: null,
    explanation:
      "B2/A2 is the total growth multiple — 1,728 ÷ 1,000 = 1.728. Raising it to the power 1/C2 asks \"what number, multiplied by itself C2 times, gives that multiple?\" For 3 years that's the cube root: 1.728^(1/3) = 1.2. Subtracting 1 converts the multiple into a rate: 0.2, or 20% per year. That's the whole point of CAGR — it smooths lumpy year-to-year swings into one steady, compounding rate, which makes a 3-year investment directly comparable with a 10-year one. The result is a decimal, so format the cell as a percentage.",
    steps: [
      { part: "B2/A2", meaning: "Ending value divided by starting value — the total growth multiple (1728/1000 = 1.728)." },
      { part: "^(1/C2)", meaning: "The C2-th root: undoes C2 years of compounding to find one year's multiple (1.2)." },
      { part: "-1", meaning: "Turns the yearly multiple into a rate: 1.2 − 1 = 0.2 = 20% per year." },
    ],
    whenToUse:
      "Use it to report revenue or user growth over multi-year periods, compare fund or portfolio returns with different timespans, or set growth targets in a plan.",
    commonMistakes: [
      { mistake: "Using the number of data points instead of the number of periods.", fix: "Values for 2023–2026 span 3 years, not 4. C2 must be the count of gaps between the start and end values, or the rate comes out too low." },
      { mistake: "Dividing total growth by years instead of taking the root.", fix: "72.8% ÷ 3 = 24.3% ignores compounding and overstates the rate. The correct CAGR here is exactly 20% — always use the ^(1/years) root." },
      { mistake: "A negative or zero starting value.", fix: "CAGR is undefined when A2 ≤ 0 — the root of a negative multiple returns #NUM!. Start the measurement from the first positive period instead." },
    ],
    sampleInput: {
      columns: ["Metric", "Start", "End", "Years"],
      rows: [
        ["Revenue", "1000", "1728", "3"],
        ["Users", "50000", "72000", "2"],
      ],
    },
    sampleOutput: {
      columns: ["Metric", "CAGR"],
      rows: [
        ["Revenue", "20%"],
        ["Users", "20%"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-percentage-change", "calculate-profit-margin", "pmt-loan-payment"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Start", "End", "Years", "CAGR"],
          [1000, 1728, 3, "=(B2/A2)^(1/C2)-1"],
          [50000, 72000, 2, "=(B3/A3)^(1/C3)-1"],
        ],
      },
      expect: [
        { cell: "D2", value: 0.2 },
        { cell: "D3", value: 0.2 },
      ],
    },
  },
  {
    slug: "calculate-roi",
    kind: "formula",
    title: "Calculate Return on Investment (ROI)",
    seoTitle: "ROI Formula in Excel & Google Sheets",
    description:
      "Divide the gain by what you put in — (return − cost) / cost — to see how hard each dollar worked, as a clean percentage.",
    category: "finance-business",
    difficulty: "beginner",
    functions: [],
    keywords: ["roi formula", "return on investment", "roi percentage", "campaign roi", "investment return"],
    problem:
      "You spent money on a campaign, a tool, or a project, and it brought money back. You need one percentage that says whether it was worth it — and by how much.",
    quickFormula: "=(B2-A2)/A2",
    excelFormula: "=(B2-A2)/A2",
    sheetsFormula: null,
    explanation:
      "B2−A2 is the net gain: what came back minus what you put in. Dividing by A2 — the cost — expresses that gain relative to the investment, so a $5,000 spend returning $6,500 gives (6500−5000)/5000 = 0.3, or 30% ROI. A negative result means the investment lost money. Note the denominator: ROI divides by the cost, while profit margin divides by revenue — a 30% ROI and a 30% margin are different claims, so don't mix the two in one report. Format the result as a percentage.",
    steps: [
      { part: "B2-A2", meaning: "The net gain: total return minus the original cost." },
      { part: "/A2", meaning: "Divides by the cost, so the result reads \"gain per dollar invested.\"" },
      { part: "Format as %", meaning: "0.3 displays as 30% once the cell has percentage formatting." },
    ],
    whenToUse:
      "Use it to compare marketing campaigns, justify a software purchase, evaluate equipment upgrades, or rank projects competing for the same budget.",
    commonMistakes: [
      { mistake: "Dividing by revenue instead of cost.", fix: "That computes profit margin, not ROI. ROI's denominator is always what you invested: =(B2-A2)/A2, with cost in A2." },
      { mistake: "Using gross return without subtracting the cost.", fix: "=B2/A2 gives the return multiple (1.3×), not ROI. Subtract the cost first — otherwise everything looks 100 points better than it is." },
      { mistake: "Comparing ROIs over different timespans.", fix: "30% in one quarter beats 30% over three years. Annualize with CAGR, or compare only investments of similar duration." },
    ],
    sampleInput: {
      columns: ["Campaign", "Cost", "Return"],
      rows: [
        ["Spring email", "5000", "6500"],
        ["Trade show", "8000", "7200"],
      ],
    },
    sampleOutput: {
      columns: ["Campaign", "ROI"],
      rows: [
        ["Spring email", "30%"],
        ["Trade show", "-10%"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-profit-margin", "calculate-percentage-change", "calculate-break-even-point"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Campaign", "Cost", "Return", "ROI"],
          ["Spring email", 5000, 6500, "=(C2-B2)/B2"],
          ["Trade show", 8000, 7200, "=(C3-B3)/B3"],
        ],
      },
      expect: [
        { cell: "D2", value: 0.3 },
        { cell: "D3", value: -0.1 },
      ],
    },
  },
  {
    slug: "calculate-gross-profit",
    kind: "formula",
    title: "Calculate Gross Profit and Gross Margin",
    seoTitle: "Gross Profit Formula (Excel & Google Sheets)",
    description:
      "Revenue minus cost of goods gives gross profit in dollars; divide by revenue and you have the margin percentage in the next column.",
    category: "finance-business",
    difficulty: "beginner",
    functions: [],
    keywords: ["gross profit formula", "revenue minus cogs", "gross margin", "profit per product", "cost of goods sold"],
    problem:
      "You have what each product cost to make or buy, and what it sold for. You need the profit in dollars per line — and the margin percentage next to it so lines are comparable.",
    quickFormula: "=B2-A2",
    excelFormula: "=B2-A2",
    sheetsFormula: null,
    explanation:
      "With cost of goods in column A and revenue in column B, revenue minus cost is the gross profit — the dollars left after paying for the product itself, before rent, salaries, and marketing. Selling $10,000 of goods that cost $6,000 leaves $4,000. Dollars answer \"how much did we make?\", but they can't compare a $10,000 line against a $2,500 one — for that, add gross margin in the next column: =(B2-A2)/B2 divides the profit by revenue, giving 0.4 (40%) here. Together the pair shows which products earn the money and which earn it efficiently.",
    steps: [
      { part: "B2", meaning: "Revenue — what the product sold for." },
      { part: "-A2", meaning: "Minus cost of goods sold. The result is gross profit in dollars." },
      { part: "=(B2-A2)/B2", meaning: "Optional next column: gross margin as a decimal — profit divided by revenue." },
    ],
    whenToUse:
      "Use it on any product, SKU, or service-line table to spot loss-makers, rank products by profitability, or feed a pricing review with real per-line numbers.",
    commonMistakes: [
      { mistake: "Subtracting in the wrong order.", fix: "=A2-B2 with cost in A gives cost minus revenue — profitable lines show negative. Revenue comes first: =B2-A2." },
      { mistake: "Dividing margin by cost instead of revenue.", fix: "=(B2-A2)/A2 is markup (66.7% here), not gross margin (40%). Margin always divides by revenue — mixing them up overstates profitability." },
      { mistake: "Leaving shipping and payment fees out of cost.", fix: "If freight or card fees live in another column, the \"gross profit\" is inflated. Fold every direct cost into column A, or subtract each: =B2-A2-C2." },
    ],
    sampleInput: {
      columns: ["Product", "COGS", "Revenue"],
      rows: [
        ["Desk", "6000", "10000"],
        ["Chair", "1750", "2500"],
      ],
    },
    sampleOutput: {
      columns: ["Product", "Gross Profit", "Margin"],
      rows: [
        ["Desk", "4000", "40%"],
        ["Chair", "750", "30%"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-profit-margin", "calculate-budget-variance", "calculate-percentage-of-total"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["COGS", "Revenue", "Gross Profit", "Margin"],
          [6000, 10000, "=B2-A2", "=(B2-A2)/B2"],
          [1750, 2500, "=B3-A3", "=(B3-A3)/B3"],
        ],
      },
      expect: [
        { cell: "C2", value: 4000 },
        { cell: "D2", value: 0.4 },
        { cell: "C3", value: 750 },
        { cell: "D3", value: 0.3 },
      ],
    },
  },
  {
    slug: "calculate-simple-interest",
    kind: "formula",
    title: "Calculate Simple Interest on a Loan",
    seoTitle: "Simple Interest Formula (Excel & Sheets)",
    description:
      "Principal × rate × years gives the interest a simple-interest loan charges, and one more step gives the total you'll repay.",
    category: "finance-business",
    difficulty: "beginner",
    functions: [],
    keywords: ["simple interest formula", "principal rate time", "loan interest", "total repayment", "interest calculator"],
    problem:
      "You're borrowing or lending at a flat annual rate — a short-term business loan, a family loan, a deposit — and need the interest it earns and the total due at the end.",
    quickFormula: "=A2*B2*C2",
    excelFormula: "=A2*B2*C2",
    sheetsFormula: null,
    explanation:
      "Simple interest is charged only on the original principal — it never compounds. So the math is a straight multiplication: principal × annual rate × years. Borrowing $10,000 at 5% for 3 years costs 10000 × 0.05 × 3 = $1,500 in interest, and the total repayment is principal plus interest: =A2*(1+B2*C2) = $11,500. Enter the rate as a decimal or a percent-formatted cell (0.05 or 5%) — both store the same value. Compare that with compound interest, which would charge interest on the interest and come out higher over the same term.",
    steps: [
      { part: "A2", meaning: "The principal — the amount borrowed or deposited." },
      { part: "*B2", meaning: "Times the annual interest rate as a decimal (5% = 0.05)." },
      { part: "*C2", meaning: "Times the term in years. Use 0.5 for six months." },
      { part: "=A2*(1+B2*C2)", meaning: "Total repayment in one cell: principal plus all the interest." },
    ],
    whenToUse:
      "Use it for short-term business loans, invoice financing, bonds sold at a flat coupon, or checking a lender's quote before signing.",
    commonMistakes: [
      { mistake: "Entering the rate as 5 instead of 0.05.", fix: "=10000*5*3 charges 150,000 in interest. Type 0.05, or format the cell as a percent and type 5%." },
      { mistake: "Mismatched rate and time units.", fix: "An annual rate with a term in months multiplies interest by 12. Convert months to years (18 months = 1.5) or use a monthly rate with months." },
      { mistake: "Using simple interest for a compounding loan.", fix: "Credit cards and most bank loans compound — simple interest understates the true cost. For amortized monthly payments, use PMT instead." },
    ],
    sampleInput: {
      columns: ["Principal", "Rate", "Years"],
      rows: [["10000", "5%", "3"]],
    },
    sampleOutput: {
      columns: ["Interest", "Total Repayment"],
      rows: [["1500", "11500"]],
      highlightColumn: 0,
    },
    related: ["pmt-loan-payment", "calculate-percentage-change", "calculate-sales-tax"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Principal", "Rate", "Years", "Interest", "Total"],
          [10000, 0.05, 3, "=A2*B2*C2", "=A2*(1+B2*C2)"],
        ],
      },
      expect: [
        { cell: "D2", value: 1500 },
        { cell: "E2", value: 11500 },
      ],
    },
  },
  {
    slug: "calculate-average-order-value",
    kind: "formula",
    title: "Calculate Average Order Value (AOV)",
    seoTitle: "Average Order Value Formula (Excel & Sheets)",
    description:
      "Divide total revenue by the number of orders to get AOV — with an IF guard so months with zero orders don't blow up in #DIV/0!.",
    category: "finance-business",
    difficulty: "beginner",
    functions: ["IF"],
    keywords: ["average order value", "aov formula", "revenue per order", "ecommerce metrics", "average basket size"],
    problem:
      "Your sales report has total revenue and order counts per month or channel, and you need the average each order is worth — the number pricing and promo decisions hang on.",
    quickFormula: "=B2/C2",
    excelFormula: "=B2/C2",
    sheetsFormula: null,
    explanation:
      "Average order value is total revenue divided by the number of orders: $12,500 across 250 orders means the typical order is worth $50. It's the honest way to average — averaging per-order values by channel and then averaging the channels would let a 3-order channel count as much as a 300-order one. The one trap is a period with zero orders: dividing by zero returns #DIV/0! and pollutes every chart and average built on the column. Guard it with =IF(C2=0,0,B2/C2), which shows 0 for dead months instead of an error.",
    steps: [
      { part: "B2", meaning: "Total revenue for the period or channel." },
      { part: "/C2", meaning: "Divided by the number of orders in the same period." },
      { part: "IF(C2=0,0,…)", meaning: "The guard: when there are no orders, show 0 instead of #DIV/0!." },
    ],
    whenToUse:
      "Use it to track AOV by month, compare channels or customer segments, measure whether a free-shipping threshold or bundle promo actually lifted basket size.",
    commonMistakes: [
      { mistake: "#DIV/0! in periods with no orders.", fix: 'A new channel or a dead month has 0 orders, and the plain division errors out. Use =IF(C2=0,0,B2/C2) — or "" if you prefer a blank cell.' },
      { mistake: "Averaging the per-row AOVs to get an overall AOV.", fix: "AVERAGE of the AOV column ignores volume. Compute the overall figure from the totals: =SUM(B2:B13)/SUM(C2:C13)." },
      { mistake: "Mixing gross and net revenue between rows.", fix: "If some rows include refunds and shipping and others don't, AOVs aren't comparable. Pick one definition and apply it to every row." },
    ],
    sampleInput: {
      columns: ["Month", "Revenue", "Orders"],
      rows: [
        ["May", "12500", "250"],
        ["June", "9600", "0"],
      ],
    },
    sampleOutput: {
      columns: ["Month", "AOV"],
      rows: [
        ["May", "50"],
        ["June", "0"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-weighted-average", "calculate-percentage-of-total", "fix-div0-error"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Month", "Revenue", "Orders", "AOV"],
          ["May", 12500, 250, "=B2/C2"],
          ["June", 9600, 0, "=IF(C3=0,0,B3/C3)"],
        ],
      },
      expect: [
        { cell: "D2", value: 50 },
        { cell: "D3", value: 0 },
      ],
    },
  },
  {
    slug: "calculate-churn-rate",
    kind: "formula",
    title: "Calculate Customer Churn Rate",
    seoTitle: "Churn Rate Formula in Excel & Google Sheets",
    description:
      "Customers lost divided by customers at the start of the period gives your churn rate — and 1 minus churn gives retention.",
    category: "finance-business",
    difficulty: "beginner",
    functions: [],
    keywords: ["churn rate formula", "customer churn", "retention rate", "lost customers", "monthly churn"],
    problem:
      "You started the month with a customer list and some of them cancelled. You need the churn rate — what share you lost — tracked consistently month over month.",
    quickFormula: "=B2/A2",
    excelFormula: "=B2/A2",
    sheetsFormula: null,
    explanation:
      "Churn is the customers you lost during the period divided by the customers you started with. Losing 25 of 500 customers is 25/500 = 0.05 — a 5% monthly churn rate. The denominator matters: dividing by the period's starting count keeps the rate honest, because new customers signed this month haven't had a chance to churn yet. Retention is simply the complement — =1-B2/A2 gives 0.95, and churn plus retention always equals 100%, a quick sanity check on any dashboard. Format both as percentages.",
    steps: [
      { part: "B2", meaning: "Customers lost during the period — cancellations, non-renewals." },
      { part: "/A2", meaning: "Divided by customers at the START of the period, not the end." },
      { part: "=1-B2/A2", meaning: "Retention rate: the share you kept. Churn and retention sum to 100%." },
    ],
    whenToUse:
      "Use it for monthly SaaS subscriber tracking, membership and newsletter cancellations, or comparing churn across plans and cohorts to see where customers leak out.",
    commonMistakes: [
      { mistake: "Dividing by the end-of-period customer count.", fix: "New signups inflate the denominator and hide real churn. Divide by the starting count: =B2/A2 with A2 = customers on day one of the period." },
      { mistake: "Comparing monthly churn against annual churn.", fix: "5% monthly compounds to about 46% per year — not 5%. Keep every row on the same period length before comparing or charting." },
      { mistake: "Counting customers who both joined and left this month inconsistently.", fix: "Pick a rule — many teams exclude same-month joiners from both numbers — and apply it every month, or the trend line is noise." },
    ],
    sampleInput: {
      columns: ["Month", "Start", "Lost"],
      rows: [
        ["May", "500", "25"],
        ["June", "480", "48"],
      ],
    },
    sampleOutput: {
      columns: ["Month", "Churn", "Retention"],
      rows: [
        ["May", "5%", "95%"],
        ["June", "10%", "90%"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-percentage-change", "calculate-completion-percentage", "fix-div0-error"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Start", "Lost", "Churn", "Retention"],
          [500, 25, "=B2/A2", "=1-B2/A2"],
          [480, 48, "=B3/A3", "=1-B3/A3"],
        ],
      },
      expect: [
        { cell: "C2", value: 0.05 },
        { cell: "D2", value: 0.95 },
        { cell: "C3", value: 0.1 },
        { cell: "D3", value: 0.9 },
      ],
    },
  },
  {
    slug: "calculate-runway-months",
    kind: "formula",
    title: "Calculate Runway in Months From Cash and Burn",
    seoTitle: "Cash Runway Formula (Excel & Google Sheets)",
    description:
      "Cash in the bank divided by monthly burn tells you how many months you can operate — with a guard for the happy case of zero burn.",
    category: "finance-business",
    difficulty: "beginner",
    functions: ["IF"],
    keywords: ["runway formula", "cash runway", "burn rate", "months of cash", "startup runway"],
    problem:
      "You know how much cash the business has and how much it loses each month. You need the number every founder and finance lead watches: how many months until the money runs out.",
    quickFormula: "=A2/B2",
    excelFormula: "=A2/B2",
    sheetsFormula: null,
    explanation:
      "Runway is cash divided by net monthly burn — the amount by which expenses exceed revenue each month. $240,000 in the bank burning $20,000 a month is 240000/20000 = 12 months of runway. Use net burn (spend minus income), not gross spend, or you'll understate your runway. And handle the good problem: a break-even or profitable month has zero or negative burn, which makes the division return #DIV/0! or a meaningless negative. Guard it with =IF(B2<=0,\"Profitable\",A2/B2) so the model reads correctly in every scenario.",
    steps: [
      { part: "A2", meaning: "Cash on hand — the current bank balance." },
      { part: "/B2", meaning: "Divided by net monthly burn: monthly expenses minus monthly revenue." },
      { part: 'IF(B2<=0,"Profitable",…)', meaning: "The guard: zero or negative burn means you aren't burning — no runway math applies." },
    ],
    whenToUse:
      "Use it in board decks and fundraising models, monthly finance reviews, and hiring plans — anywhere \"when do we run out of money at this pace?\" drives the decision.",
    commonMistakes: [
      { mistake: "Dividing by gross spend instead of net burn.", fix: "If you spend 50k but collect 30k, burn is 20k. Using 50k cuts the runway figure by more than half and triggers false alarms. Burn = expenses − revenue." },
      { mistake: "#DIV/0! or negative months when burn hits zero.", fix: 'A break-even month makes the plain division fail. Use =IF(B2<=0,"Profitable",A2/B2) so the model stays readable.' },
      { mistake: "Using one lucky month's burn.", fix: "Burn is lumpy — an annual insurance bill or a big invoice skews any single month. Average the last 3 months: =A2/AVERAGE(B2:B4)." },
    ],
    sampleInput: {
      columns: ["Scenario", "Cash", "Monthly Burn"],
      rows: [
        ["Current", "240000", "20000"],
        ["Post break-even", "180000", "0"],
      ],
    },
    sampleOutput: {
      columns: ["Scenario", "Runway (months)"],
      rows: [
        ["Current", "12"],
        ["Post break-even", "Profitable"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-budget-variance", "calculate-break-even-point", "fix-div0-error"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["Cash", "Burn", "Runway"],
          [240000, 20000, "=A2/B2"],
          [180000, 0, '=IF(B3<=0,"Profitable",A3/B3)'],
        ],
      },
      expect: [
        { cell: "C2", value: 12 },
        { cell: "C3", value: "Profitable" },
      ],
    },
  },
  {
    slug: "calculate-currency-conversion",
    kind: "formula",
    title: "Convert Currency With a Fixed Exchange Rate",
    seoTitle: "Currency Conversion Formula (Excel & Sheets)",
    description:
      "Multiply each amount by an exchange rate stored in one $-anchored cell, so the whole column converts and updates from a single rate.",
    category: "finance-business",
    difficulty: "beginner",
    functions: [],
    keywords: ["currency conversion formula", "exchange rate excel", "convert usd to eur", "multiply by exchange rate", "absolute reference rate"],
    problem:
      "A column of amounts in one currency needs converting to another for an invoice, expense report, or budget — and the rate should live in one cell you can update.",
    quickFormula: "=A2*$E$1",
    excelFormula: "=A2*$E$1",
    sheetsFormula: null,
    explanation:
      "Put the exchange rate in a single cell — say 0.85 USD→EUR in E1 — and multiply each amount by it: 200 × 0.85 = 170. The dollar signs are what make it work at scale: $E$1 is an absolute reference, so when you copy the formula down the column, A2 becomes A3, A4, … while the rate stays locked on E1. Every row uses the same rate, and when the rate changes you edit one cell and the whole column updates. Without the anchors, the copied formulas slide onto E2, E3 — empty cells — and quietly multiply everything by zero.",
    steps: [
      { part: "A2", meaning: "The amount in the source currency — moves down as you copy." },
      { part: "*$E$1", meaning: "Times the rate cell. The $ signs lock both column and row so every copy points at E1." },
    ],
    whenToUse:
      "Use it for expense reports in a foreign currency, multi-currency price lists, invoices for overseas clients, or consolidating regional budgets into one reporting currency.",
    commonMistakes: [
      { mistake: "Forgetting the $ anchors on the rate cell.", fix: "=A2*E1 copied down becomes =A3*E2, =A4*E3 — empty cells, so every row after the first shows 0. Anchor it: =A2*$E$1." },
      { mistake: "Multiplying when you should divide.", fix: "A rate quoted as EUR→USD (1.18) converts the wrong way if you multiply USD amounts by it. Either divide, or store the inverse rate and keep multiplying." },
      { mistake: "Hardcoding the rate inside every formula.", fix: "=A2*0.85 scattered down a column means editing every cell when the rate moves. Keep the rate in one referenced cell so one edit updates everything." },
    ],
    sampleInput: {
      columns: ["Expense", "USD", "Rate (E1)"],
      rows: [
        ["Flights", "200", "0.85"],
        ["Hotel", "1000", ""],
      ],
    },
    sampleOutput: {
      columns: ["Expense", "EUR"],
      rows: [
        ["Flights", "170"],
        ["Hotel", "850"],
      ],
      highlightColumn: 1,
    },
    related: ["calculate-sales-tax", "calculate-discount-price", "calculate-percentage-of-total"],
    lastReviewed: "2026-07-09",
    published: true,
    verification: {
      sheets: {
        Sheet1: [
          ["USD", "EUR", null, null, 0.85],
          [200, "=A2*$E$1", null, null, null],
          [1000, "=A3*$E$1", null, null, null],
        ],
      },
      expect: [
        { cell: "B2", value: 170 },
        { cell: "B3", value: 850 },
      ],
    },
  },
];
