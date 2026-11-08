import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";
import { isSameOrigin } from "@/lib/http";

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Admin API routes that must work without a session.
const PUBLIC_ADMIN_API = new Set(["/api/admin/login", "/api/admin/logout"]);

function extraHosts(): string[] {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL;
    return base ? [new URL(base).host] : [];
  } catch {
    return [];
  }
}

function deny(status: number, code: string) {
  return NextResponse.json({ ok: false, error: code }, { status });
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/");

  // 1) CSRF: reject cross-site state-changing API calls.
  if (isApi && UNSAFE_METHODS.has(req.method) && !isSameOrigin(req.headers, extraHosts())) {
    return deny(403, "bad_origin");
  }

  // 2) Authentication for the admin UI and the admin API.
  const isAdminPage =
    pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isAdminApi =
    pathname.startsWith("/api/admin") && !PUBLIC_ADMIN_API.has(pathname);

  if (isAdminPage || isAdminApi) {
    const claims = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);
    if (!claims) {
      if (isAdminApi) return deny(401, "unauthorized");
      const res = NextResponse.redirect(new URL("/admin/login", req.url));
      res.cookies.delete(SESSION_COOKIE);
      return res;
    }
  }

  const res = NextResponse.next();
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    res.headers.set("Cache-Control", "no-store");
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
