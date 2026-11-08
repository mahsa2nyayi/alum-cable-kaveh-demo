import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { HttpError } from "@/lib/http";
import { safely } from "@/lib/api";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  return safely("GET /api/products/[id]", async () => {
    const { id: raw } = await context.params;
    // Strict: digits only (rejects "1e3", "0x10", " 5", "5abc", ...).
    if (!/^\d{1,9}$/.test(raw)) throw new HttpError(400, "invalid_id");
    const id = Number(raw);
    if (id < 1) throw new HttpError(400, "invalid_id");

    const product = await prisma.cableProduct.findUnique({
      where: { id },
      include: {
        translations: true,
        family: { include: { translations: true } },
      },
    });
    if (!product) throw new HttpError(404, "not_found");

    return NextResponse.json(product, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  });
}
