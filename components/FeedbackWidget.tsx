"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";

const OPTIONS = [
  { value: "worked", label: "This worked" },
  { value: "did-not-work", label: "This didn't work" },
  { value: "need-help", label: "I need help adapting it" },
] as const;

/** Per-page helpfulness vote (ticket SF-014). One vote per page, guarded via localStorage. */
export function FeedbackWidget({ slug }: { slug: string }) {
  const [voted, setVoted] = useState<string | null>(null);
  const key = `sf-feedback-${slug}`;

  useEffect(() => {
    setVoted(window.localStorage.getItem(key));
  }, [key]);

  function vote(value: string) {
    window.localStorage.setItem(key, value);
    setVoted(value);
    track("feedback_vote", { slug, vote: value });
  }

  if (voted) {
    return (
      <p role="status" className="text-[14px] text-ink-soft">
        <span className="font-medium text-ledger-deep">Thanks — noted.</span>{" "}
        {voted === "need-help"
          ? "The formula's Common Mistakes section covers the usual adaptations."
          : "Feedback like this decides which formulas we improve next."}
      </p>
    );
  }

  return (
    <div>
      <p className="mb-3 text-[14px] font-medium text-ink">Did this formula help?</p>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => vote(option.value)}
            className="rounded-md border border-rule bg-white px-3.5 py-1.5 text-[13px] font-medium text-ink-soft shadow-bar transition-colors hover:border-ledger hover:text-ledger-deep"
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
