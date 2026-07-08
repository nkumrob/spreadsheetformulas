import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "AI Formula Generator — Join the Waitlist",
  description:
    "Describe a spreadsheet problem in plain English and get a tested, explained formula. Join the waitlist for the AI Formula Generator.",
};

export default function AiWaitlistPage() {
  return (
    <div className="mx-auto max-w-page px-5 pt-12">
      <div className="max-w-prose">
        <p className="font-mono text-[13px] font-medium tracking-wide text-ledger">=COMINGSOON()</p>
        <h1 className="mt-3 font-display text-[44px] leading-tight text-ink">
          AI that shows its work.
        </h1>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
          Most AI formula generators hand you a formula and hope. Ours will state its assumptions,
          run deterministic syntax checks before you ever see the output, show sample input and
          output so you can verify the logic, and link the tested tutorial for every function it
          uses.
        </p>
        <ul className="mt-6 space-y-2.5 text-[14.5px] text-ink-soft">
          {[
            "Plain-English request in, working formula out — for Excel and Google Sheets",
            "Assumptions stated up front: which columns, which conditions",
            "Sample data with every answer, so you verify before you paste",
            "Structural checks run on every output — no hallucinated functions",
          ].map((line) => (
            <li key={line} className="flex gap-2.5">
              <span aria-hidden="true" className="mt-0.5 font-mono text-[13px] font-bold text-ledger">✓</span>
              {line}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
