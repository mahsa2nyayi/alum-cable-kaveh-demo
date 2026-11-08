/** Optional e-mail notification for new contact messages (Node runtime only). */
import nodemailer from "nodemailer";
import { toSingleLine } from "./validation";

export interface ContactMail {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function mailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_RECIPIENT,
  );
}

/** Best-effort: never throws (a mail outage must not lose the message,
 *  which is already stored in the database). */
export async function notifyContact(m: ContactMail): Promise<void> {
  if (!mailConfigured()) return;
  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      requireTLS: port !== 465, // refuse to send credentials in clear text
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 12_000,
      tls: { minVersion: "TLSv1.2" },
    });

    await transporter.sendMail({
      from: `"Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECIPIENT,
      replyTo: m.email, // already validated: no CR/LF possible
      subject: `New contact from ${toSingleLine(m.name, 80)}`,
      text: `${m.message}\n\nName: ${m.name}\nPhone: ${m.phone ?? "-"}\nEmail: ${m.email}`,
    });
  } catch (err) {
    console.error("[mailer] send failed:", err instanceof Error ? err.message : "unknown");
  }
}
