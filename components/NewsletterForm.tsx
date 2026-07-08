"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

type Status = "idle" | "done" | "error";

/**
 * Newsletter capture (ticket SF-070). Posts to /api/subscribe, which will
 * proxy to the email provider once credentials are configured.
 */
export function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" }) {
  const [status, setStatus] = useState<Status>("idle");
  const dark = variant === "dark";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    if (typeof email !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus("error");
      return;
    }
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      track("newsletter_signup");
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <p
        role="status"
        className={`flex items-center gap-2 text-[14px] font-medium ${dark ? "text-ledger-tint" : "text-ledger-deep"}`}
      >
        <span aria-hidden="true">✓</span> You&apos;re on the list. One useful formula email, no noise.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-md">
      <div
        className={`flex items-center gap-2 rounded-lg border p-1.5 ${
          dark ? "border-white/15 bg-white/[0.06]" : "border-rule bg-white shadow-bar"
        }`}
      >
        <label htmlFor={`newsletter-${variant}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-${variant}`}
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          onFocus={() => setStatus("idle")}
          className={`min-w-0 flex-1 bg-transparent px-2.5 py-1.5 text-[14px] outline-none ${
            dark ? "text-paper placeholder:text-paper/40" : "text-ink placeholder:text-ink-faint"
          }`}
        />
        <button
          type="submit"
          className="shrink-0 rounded-md bg-ledger px-4 py-2 text-[13px] font-semibold text-paper transition-colors hover:bg-ledger-deep"
        >
          Subscribe
        </button>
      </div>
      <p role={status === "error" ? "alert" : undefined} className={`mt-2 text-[12.5px] ${status === "error" ? "text-rust" : dark ? "text-paper/50" : "text-ink-faint"}`}>
        {status === "error"
          ? "That email doesn't look right — mind checking it?"
          : "New tested formulas and templates, about twice a month."}
      </p>
    </form>
  );
}
