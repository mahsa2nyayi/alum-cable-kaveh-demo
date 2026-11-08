import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { HttpError, readJson } from "@/lib/http";
import { safely } from "@/lib/api";
import {
  messageDeleteSchema,
  messageListQuerySchema,
  messagePatchSchema,
} from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET -> list messages (cursor pagination, newest first)
export async function GET(req: Request) {
  return safely("GET /api/admin/messages", async () => {
    await requireAdmin();
    const sp = new URL(req.url).searchParams;
    const q = messageListQuerySchema.parse({
      take: sp.get("take") ?? undefined,
      cursor: sp.get("cursor") ?? undefined,
    });

    const rows = await prisma.contactMessage.findMany({
      orderBy: { id: "desc" },
      take: q.take + 1,
      ...(q.cursor ? { cursor: { id: q.cursor }, skip: 1 } : {}),
    });
    const hasMore = rows.length > q.take;
    const data = hasMore ? rows.slice(0, q.take) : rows;

    return NextResponse.json({
      ok: true,
      data,
      nextCursor: hasMore ? data[data.length - 1].id : null,
    });
  });
}

// PATCH -> mark read / unread
export async function PATCH(req: Request) {
  return safely("PATCH /api/admin/messages", async () => {
    await requireAdmin();
    const parsed = messagePatchSchema.safeParse(await readJson(req, 1024));
    if (!parsed.success) throw new HttpError(400, "invalid_input");

    const { count } = await prisma.contactMessage.updateMany({
      where: { id: parsed.data.id },
      data: { read: parsed.data.read },
    });
    if (count === 0) throw new HttpError(404, "not_found");
    return NextResponse.json({ ok: true });
  });
}

// DELETE -> remove a message
export async function DELETE(req: Request) {
  return safely("DELETE /api/admin/messages", async () => {
    await requireAdmin();
    const parsed = messageDeleteSchema.safeParse(await readJson(req, 1024));
    if (!parsed.success) throw new HttpError(400, "invalid_input");

    const { count } = await prisma.contactMessage.deleteMany({
      where: { id: parsed.data.id },
    });
    if (count === 0) throw new HttpError(404, "not_found");
    return NextResponse.json({ ok: true });
  });
}
