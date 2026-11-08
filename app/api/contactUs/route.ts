import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyContact } from "@/lib/mailer";
import { HttpError, getClientIp, readJson } from "@/lib/http";
import { safely } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return safely("POST /api/contactUs", async () => {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.ok) {
      throw new HttpError(429, "too_many_requests", {
        "Retry-After": String(rl.retryAfterSeconds),
      });
    }

    const parsed = contactSchema.safeParse(await readJson(req));
    if (!parsed.success) throw new HttpError(400, "invalid_input");
    const d = parsed.data;

    // Honeypot filled => bot. Pretend success, store nothing.
    if (d.website && d.website.trim() !== "") {
      return NextResponse.json({ ok: true });
    }

    const saved = await prisma.contactMessage.create({
      data: {
        name: d.name,
        email: d.email,
        phone: d.phone ?? null,
        message: d.message,
        lang: d.lang,
      },
      select: { id: true },
    });

    await notifyContact({
      name: d.name,
      email: d.email,
      phone: d.phone,
      message: d.message,
    });

    return NextResponse.json({ ok: true, id: saved.id });
  });
}
