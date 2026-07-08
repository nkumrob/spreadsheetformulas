import { NextResponse } from "next/server";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Newsletter capture endpoint (ticket SF-070). Validates and acknowledges;
 * forwards to the email provider when NEWSLETTER_WEBHOOK_URL is configured
 * (ConvertKit/Beehiiv/Buttondown all accept a simple POST webhook).
 */
export async function POST(request: Request) {
  let email: unknown;
  try {
    ({ email } = await request.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (typeof email !== "string" || !EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      return NextResponse.json({ error: "Subscription service unavailable." }, { status: 502 });
    }
  }

  return NextResponse.json({ ok: true });
}
