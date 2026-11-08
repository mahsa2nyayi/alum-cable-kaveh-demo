/**
 * Minimal fixed-window rate limiter (in-memory).
 *
 * Good enough for a single Node process (VPS / Docker / `next start`).
 * On serverless or multi-instance deployments each instance keeps its own
 * counters - swap this module for Redis / Upstash there (same signature).
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

function sweep(now: number) {
  for (const [k, b] of store) if (b.resetAt <= now) store.delete(k);
  // Hard cap so an attacker cannot grow the map without bound.
  if (store.size > MAX_KEYS) {
    const overflow = store.size - MAX_KEYS;
    let i = 0;
    for (const k of store.keys()) {
      store.delete(k);
      if (++i >= overflow) break;
    }
  }
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  if (store.size >= MAX_KEYS) sweep(now);

  const b = store.get(key);
  if (!b || b.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }
  b.count += 1;
  if (b.count > limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((b.resetAt - now) / 1000)),
    };
  }
  return { ok: true, remaining: limit - b.count, retryAfterSeconds: 0 };
}

export const rateLimitReset = (key: string) => void store.delete(key);

/** Test helper. */
export const __clearRateLimits = () => store.clear();
