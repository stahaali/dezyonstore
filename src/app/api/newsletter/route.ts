import { NextResponse } from "next/server";
import { z } from "zod";
import type { RowDataPacket } from "mysql2";
import { newId, queryExec, queryRows } from "@/lib/db";
import { sendNewsletterWelcomeEmail } from "@/lib/mail";

const schema = z.object({
  email: z.string().trim().email().max(255),
});

type SubscriberRow = RowDataPacket & {
  id: string;
  status: "ACTIVE" | "UNSUBSCRIBED";
  welcome_email_sent: number;
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);
    const normalized = email.toLowerCase();

    const existing = await queryRows<SubscriberRow[]>(
      `SELECT id, status, welcome_email_sent
       FROM newsletter_subscribers
       WHERE email = ?
       LIMIT 1`,
      [normalized],
    );

    let subscriberId = existing[0]?.id;
    let alreadyActive = existing[0]?.status === "ACTIVE";

    if (!existing[0]) {
      subscriberId = newId();
      await queryExec(
        `INSERT INTO newsletter_subscribers
          (id, email, status, source, welcome_email_sent)
         VALUES (?, ?, 'ACTIVE', 'website', 0)`,
        [subscriberId, normalized],
      );
    } else if (existing[0].status === "UNSUBSCRIBED") {
      await queryExec(
        `UPDATE newsletter_subscribers
         SET status = 'ACTIVE',
             unsubscribed_at = NULL,
             subscribed_at = CURRENT_TIMESTAMP,
             welcome_email_sent = 0
         WHERE id = ?`,
        [subscriberId!],
      );
      alreadyActive = false;
    }

    if (alreadyActive) {
      return NextResponse.json({
        ok: true,
        message: "You are already subscribed.",
        alreadySubscribed: true,
      });
    }

    let previewUrl: string | null = null;
    try {
      const mailed = await sendNewsletterWelcomeEmail(normalized);
      previewUrl = mailed.previewUrl;
      await queryExec(
        `UPDATE newsletter_subscribers
         SET welcome_email_sent = 1
         WHERE id = ?`,
        [subscriberId!],
      );
    } catch (mailError) {
      console.error("Newsletter welcome email failed:", mailError);
      // Subscriber is saved even if SMTP fails
    }

    return NextResponse.json({
      ok: true,
      message: "Subscribed successfully! Check your email.",
      alreadySubscribed: false,
      previewUrl,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: "Please enter a valid email address." },
        { status: 400 },
      );
    }
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { ok: false, message: "Could not subscribe. Please try again." },
      { status: 500 },
    );
  }
}
