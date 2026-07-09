"use client";

type EventName =
  | "formula_copy"
  | "search_query"
  | "newsletter_signup"
  | "feedback_vote"
  | "related_click"
  | "tool_use"
  | "template_download"
  | "proof_download";

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string> }) => void;
    gtag?: (command: "event", name: string, params?: Record<string, string>) => void;
  }
}

/**
 * Single tracking funnel for the whole app (ticket SF-071).
 * Sends to GA4 (installed) and Plausible (if ever added); no-ops otherwise.
 */
export function track(event: EventName, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  window.gtag?.("event", event, props);
  window.plausible?.(event, props ? { props } : undefined);
  if (process.env.NODE_ENV === "development") {
    console.debug(`[analytics] ${event}`, props ?? {});
  }
}
