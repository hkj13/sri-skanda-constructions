import { site } from "@content/site";

/**
 * Emails a copy of a website enquiry, when the client has set it up.
 *
 * Needs both:
 *   RESEND_API_KEY   an API key from resend.com (set in Vercel, never committed)
 *   site.email       the address to send to (content/site.ts)
 * Optional:
 *   RESEND_FROM      a sender on a domain verified in Resend,
 *                    e.g. "Website <enquiries@sriskandaconstructions.com>"
 *
 * Without them this does nothing and says so. WhatsApp is always the main
 * delivery path, so the form never waits on this.
 */
export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !site.email) {
    return Response.json({ sent: false, reason: "email not configured" }, { status: 202 });
  }

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return Response.json({ sent: false, reason: "bad request" }, { status: 400 });
  }

  // Keep only short text answers.
  const lines = Object.entries(data)
    .filter(([k, v]) => typeof v === "string" && k.length <= 60)
    .slice(0, 20)
    .map(([k, v]) => `${k}: ${(v as string).slice(0, 1000)}`);
  if (!lines.length) return Response.json({ sent: false, reason: "empty" }, { status: 400 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM || `${site.name} website <onboarding@resend.dev>`,
      to: [site.email],
      subject: `New enquiry from the website${typeof data.Name === "string" ? `: ${data.Name.slice(0, 80)}` : ""}`,
      text: `${lines.join("\n")}\n\nSent from ${site.url}/contact`,
    }),
  });

  return Response.json({ sent: res.ok }, { status: res.ok ? 200 : 502 });
}
