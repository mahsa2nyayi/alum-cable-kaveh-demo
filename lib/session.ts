/**
 * Admin session (JWT in an httpOnly cookie).
 *
 * Edge-safe: only depends on `jose` + Web Crypto, so it can be imported from
 * middleware.ts. Never import bcrypt / Prisma here.
 */
import { SignJWT, jwtVerify } from "jose";
import { getJwtSecret } from "./env";

export const SESSION_COOKIE = "session";
export const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const ISSUER = "alum-cable-kaveh";
const AUDIENCE = "admin";

export interface SessionClaims {
  sub: string; // admin id (string, per RFC 7519)
  email: string;
  /** password-version: changes whenever the password hash changes, which
   *  revokes every previously issued token. */
  pv: string;
}

/** Short, non-reversible fingerprint of the stored password hash. */
export async function passwordVersion(passwordHash: string): Promise<string> {
  const data = new TextEncoder().encode(passwordHash);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function signSession(claims: SessionClaims): Promise<string> {
  return new SignJWT({ email: claims.email, pv: claims.pv })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setSubject(claims.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_SECONDS}s`)
    .sign(getJwtSecret());
}

export async function verifySession(
  token: string | undefined | null,
): Promise<SessionClaims | null> {
  if (!token || token.length > 2048) return null;
  try {
    const { payload } = await jwtVerify(token, getJwtSecret(), {
      algorithms: ["HS256"], // pin the algorithm: blocks alg=none / confusion
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.pv !== "string"
    ) {
      return null;
    }
    return { sub: payload.sub, email: payload.email, pv: payload.pv };
  } catch {
    return null;
  }
}
