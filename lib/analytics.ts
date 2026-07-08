"use client";

type EventName =
  | "formula_copy"
  | "search_query"
  | "newsletter_signup"
  | "feedback_vote"
  | "related_click";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
  }
}

/**
 * Single tracking funnel for the whole app (ticket SF-071).
 * Wired to Plausible when its script is present; no-ops otherwise.
 */
export function track(event: EventName, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  if (window.plausible) {
    window.plausible(event, props ? { props } : undefined);
  } else if (process.env.NODE_ENV === "development") {
    console.debug(`[analytics] ${event}`, props ?? {});
  }
}
