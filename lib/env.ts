/**
 * Environment helpers.
 *
 * Everything is read lazily (at request time) so `next build` never fails
 * just because secrets are absent in the build environment.
 */

export const isProd = () => process.env.NODE_ENV === "production";

/** Dev-only secret. Never used when NODE_ENV === "production". */
const DEV_SECRET = "dev-only-insecure-secret-do-not-use-in-production-0123456789";

let cachedKey: Uint8Array | null = null;

export function getJwtSecret(): Uint8Array {
  if (cachedKey) return cachedKey;
  const raw = process.env.JWT_SECRET;

  if (raw && raw.length >= 32) {
    cachedKey = new TextEncoder().encode(raw);
    return cachedKey;
  }
  if (isProd()) {
    // Fail closed: refuse to sign/verify with a weak or missing secret.
    throw new Error(
      "JWT_SECRET is missing or shorter than 32 characters. " +
        "Generate one with: openssl rand -base64 48",
    );
  }
  cachedKey = new TextEncoder().encode(DEV_SECRET);
  return cachedKey;
}

/** Secure cookies are mandatory in production unless explicitly relaxed
 *  (only for testing `next start` over plain http://localhost). */
export const cookieSecure = () =>
  isProd() && process.env.ALLOW_INSECURE_COOKIES !== "true";

export const siteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
