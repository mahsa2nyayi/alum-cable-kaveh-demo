/**
 * Small HTTP helpers shared by the API routes.
 * Pure functions only (no next/server import) so it is usable from
 * middleware and unit tests.
 */

export class HttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    public headers?: Record<string, string>,
  ) {
    super(code);
  }
}

export const MAX_JSON_BYTES = 16 * 1024;

/** Read a JSON body with a hard size cap and content-type check. */
export async function readJson(
  req: Request,
  maxBytes: number = MAX_JSON_BYTES,
): Promise<unknown> {
  const type = req.headers.get("content-type") ?? "";
  if (!type.toLowerCase().includes("application/json")) {
    throw new HttpError(415, "unsupported_media_type");
  }
  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > maxBytes) {
    throw new HttpError(413, "payload_too_large");
  }
  const text = await req.text();
  if (new TextEncoder().encode(text).length > maxBytes) {
    throw new HttpError(413, "payload_too_large");
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(400, "invalid_json");
  }
}

/**
 * Client IP, taken from the first X-Forwarded-For hop.
 * Only trustworthy when the app runs behind a reverse proxy that OVERWRITES
 * the header (nginx: `proxy_set_header X-Forwarded-For $remote_addr;`,
 * Vercel / Cloudflare do this for you). See docs/DEPLOYMENT.md.
 */
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  const first = xff?.split(",")[0]?.trim();
  const ip = first || headers.get("x-real-ip")?.trim() || "unknown";
  return ip.slice(0, 64);
}

/**
 * CSRF defence for cookie-authenticated, state-changing requests:
 * a browser always sends Origin (or at least Sec-Fetch-Site) on such requests.
 */
export function isSameOrigin(headers: Headers, extraHosts: string[] = []): boolean {
  const allowed = new Set(
    [headers.get("x-forwarded-host"), headers.get("host"), ...extraHosts]
      .filter((h): h is string => !!h)
      .map((h) => h.toLowerCase()),
  );
  const origin = headers.get("origin");
  if (origin) {
    try {
      return allowed.has(new URL(origin).host.toLowerCase());
    } catch {
      return false;
    }
  }
  const site = headers.get("sec-fetch-site");
  if (site) return site === "same-origin" || site === "none";
  // No Origin / Fetch-Metadata => not a browser (curl, server-to-server).
  // Such clients have no ambient cookies for an attacker to ride on.
  return true;
}
