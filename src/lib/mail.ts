import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let cachedTransporter: Transporter | null = null;
let etherealUser: string | null = null;

function siteName() {
  return process.env.NEXT_PUBLIC_SITE_NAME || "Dezyon Store";
}

function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

async function getTransporter(): Promise<Transporter> {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (host && user && pass) {
    cachedTransporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });
    return cachedTransporter;
  }

  // Dev fallback: Ethereal catch inbox (no real SMTP needed)
  const testAccount = await nodemailer.createTestAccount();
  etherealUser = testAccount.user;
  cachedTransporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  return cachedTransporter;
}

export async function sendNewsletterWelcomeEmail(email: string) {
  const transporter = await getTransporter();
  const name = siteName();
  const url = siteUrl();
  const from =
    process.env.SMTP_FROM?.trim() ||
    `"${name}" <${process.env.SMTP_USER || etherealUser || "noreply@dezyon.store"}>`;

  const info = await transporter.sendMail({
    from,
    to: email,
    subject: `Welcome to ${name} newsletter`,
    text: [
      `Thanks for subscribing to ${name}!`,
      "",
      "You'll get deals, new arrivals, and tech updates in your inbox.",
      "",
      `Visit the store: ${url}`,
      "",
      `— The ${name} team`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;background:#ffffff;color:#111827;">
        <div style="background:#0b213f;padding:24px 28px;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;">${name}</h1>
        </div>
        <div style="padding:28px;">
          <h2 style="margin:0 0 12px;font-size:20px;color:#0b213f;">You're subscribed!</h2>
          <p style="margin:0 0 16px;line-height:1.6;color:#374151;">
            Thanks for joining the ${name} newsletter. Watch your inbox for deals,
            new arrivals, and tech updates.
          </p>
          <p style="margin:0 0 24px;">
            <a href="${url}" style="display:inline-block;background:#ffc107;color:#111827;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:999px;">
              Shop now
            </a>
          </p>
          <p style="margin:0;font-size:12px;line-height:1.5;color:#6b7280;">
            You received this email because <strong>${email}</strong> subscribed on our website.
          </p>
        </div>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  return {
    messageId: info.messageId,
    previewUrl: typeof previewUrl === "string" ? previewUrl : null,
  };
}
