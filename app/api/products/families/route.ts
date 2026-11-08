import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { safely } from "@/lib/api";

export const runtime = "nodejs";

export async function GET() {
  return safely("GET /api/products/families", async () => {
    const families = await prisma.cableFamily.findMany({
      include: {
        translations: true,
        products: {
          include: { translations: true },
          orderBy: { abbreviation: "asc" },
        },
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(families, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  });
}
