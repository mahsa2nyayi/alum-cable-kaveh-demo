import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, SESSION_TTL_SECONDS, passwordVersion, signSession } from "@/lib/session";
import { dummyHash, verifyPassword } from "@/lib/password";
import { cookieSecure } from "@/lib/env";
import { HttpError, getClientIp, readJson } from "@/lib/http";
import { safely } from "@/lib/api";
import { rateLimit, rateLimitReset } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";

const WINDOW = 15 * 60 * 1000;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return safely("POST /api/admin/login", async () => {
    const ip = getClientIp(req.headers);

    const byIp = rateLimit(`login:ip:${ip}`, 20, WINDOW);
    if (!byIp.ok) {
      throw new HttpError(429, "too_many_attempts", {
        "Retry-After": String(byIp.retryAfterSeconds),
      });
    }

    const parsed = loginSchema.safeParse(await readJson(req, 2048));
    if (!parsed.success) throw new HttpError(400, "invalid_input");
    const { email, password } = parsed.data;

    // Per-account limit: stops password guessing from many IPs.
    const acctKey = `login:acct:${email}`;
    const byAcct = rateLimit(acctKey, 8, WINDOW);
    if (!byAcct.ok) {
      throw new HttpError(429, "too_many_attempts", {
        "Retry-After": String(byAcct.retryAfterSeconds),
      });
    }

    const admin = await prisma.admin.findUnique({ where: { email } });

    // Always run one bcrypt comparison (real or dummy hash) so timing does
    // not reveal whether the e-mail exists.
    const hash = admin?.password ?? (await dummyHash());
    const match = await verifyPassword(password, hash);

    if (!admin || !match) {
      console.warn("[auth] failed login attempt");
      throw new HttpError(401, "invalid_credentials");
    }

    rateLimitReset(acctKey);

    const token = await signSession({
      sub: String(admin.id),
      email: admin.email,
      pv: await passwordVersion(admin.password),
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: cookieSecure(),
      sameSite: "strict",
      maxAge: SESSION_TTL_SECONDS,
      path: "/",
    });
    res.headers.set("Cache-Control", "no-store");
    return res;
  });
}
