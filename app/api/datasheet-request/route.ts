import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HttpError, getClientIp, readJson } from "@/lib/http";
import { safely } from "@/lib/api";
import { rateLimit } from "@/lib/rate-limit";
import { datasheetSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return safely("POST /api/datasheet-request", async () => {
    const ip = getClientIp(req.headers);
    const rl = rateLimit(`datasheet:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.ok) {
      throw new HttpError(429, "too_many_requests", {
        "Retry-After": String(rl.retryAfterSeconds),
      });
    }

    const parsed = datasheetSchema.safeParse(await readJson(req));
    if (!parsed.success) throw new HttpError(400, "invalid_input");
    const d = parsed.data;

    if (d.website && d.website.trim() !== "") {
      return NextResponse.json({ ok: true, success: true });
    }

    const product = await prisma.cableProduct.findUnique({
      where: { id: d.productId },
      select: { id: true },
    });
    if (!product) throw new HttpError(404, "product_not_found");

    const created = await prisma.datasheetRequest.create({
      data: {
        productId: d.productId,
        requestedSpec: d.requestedSpec,
        name: d.name,
        company: d.company ?? null,
        email: d.email,
        phone: d.phone ?? null,
        message: d.message ?? null,
        lang: d.lang,
        status: "PENDING",
      },
      select: { id: true },
    });

    // `success` kept for backward compatibility with older front-end code.
    return NextResponse.json({ ok: true, success: true, id: created.id });
  });
}
