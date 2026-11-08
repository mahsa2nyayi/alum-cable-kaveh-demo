import test from "node:test";
import assert from "node:assert/strict";
import { HttpError, getClientIp, isSameOrigin, readJson } from "../lib/http";
import { __clearRateLimits, rateLimit, rateLimitReset } from "../lib/rate-limit";

const h = (o: Record<string, string>) => new Headers(o);

test("isSameOrigin: matching Origin passes", () => {
  assert.ok(isSameOrigin(h({ host: "site.com", origin: "https://site.com" })));
});

test("isSameOrigin: foreign Origin blocked", () => {
  assert.equal(isSameOrigin(h({ host: "site.com", origin: "https://evil.com" })), false);
  assert.equal(isSameOrigin(h({ host: "site.com", origin: "null" })), false);
  assert.equal(isSameOrigin(h({ host: "site.com", origin: "https://site.com.evil.com" })), false);
});

test("isSameOrigin: falls back to Sec-Fetch-Site", () => {
  assert.equal(isSameOrigin(h({ host: "site.com", "sec-fetch-site": "cross-site" })), false);
  assert.equal(isSameOrigin(h({ host: "site.com", "sec-fetch-site": "same-site" })), false);
  assert.ok(isSameOrigin(h({ host: "site.com", "sec-fetch-site": "same-origin" })));
});

test("isSameOrigin: non-browser clients (no headers) allowed", () => {
  assert.ok(isSameOrigin(h({ host: "site.com" })));
});

test("isSameOrigin: honours x-forwarded-host and extra hosts", () => {
  assert.ok(isSameOrigin(h({ host: "127.0.0.1:3000", "x-forwarded-host": "site.com", origin: "https://site.com" })));
  assert.ok(isSameOrigin(h({ host: "internal", origin: "https://pub.com" }), ["pub.com"]));
});

test("getClientIp", () => {
  assert.equal(getClientIp(h({ "x-forwarded-for": "1.2.3.4, 10.0.0.1" })), "1.2.3.4");
  assert.equal(getClientIp(h({ "x-real-ip": "5.6.7.8" })), "5.6.7.8");
  assert.equal(getClientIp(h({})), "unknown");
  assert.ok(getClientIp(h({ "x-forwarded-for": "9".repeat(500) })).length <= 64);
});

const post = (body: string, headers: Record<string, string> = {}) =>
  new Request("http://x/api", {
    method: "POST",
    body,
    headers: { "content-type": "application/json", ...headers },
  });

test("readJson: parses valid JSON", async () => {
  assert.deepEqual(await readJson(post('{"a":1}')), { a: 1 });
});

test("readJson: rejects wrong content-type (415)", async () => {
  await assert.rejects(
    () => readJson(post("{}", { "content-type": "text/plain" })),
    (e: unknown) => e instanceof HttpError && e.status === 415,
  );
});

test("readJson: rejects oversized bodies (413)", async () => {
  await assert.rejects(
    () => readJson(post(JSON.stringify({ m: "x".repeat(200) })), 100),
    (e: unknown) => e instanceof HttpError && e.status === 413,
  );
});

test("readJson: rejects oversized declared content-length (413)", async () => {
  await assert.rejects(
    () => readJson(post("{}", { "content-length": "999999" }), 100),
    (e: unknown) => e instanceof HttpError && e.status === 413,
  );
});

test("readJson: rejects malformed JSON (400)", async () => {
  await assert.rejects(
    () => readJson(post("{not json")),
    (e: unknown) => e instanceof HttpError && e.status === 400,
  );
});

test("rateLimit: allows N then blocks, then resets after the window", () => {
  __clearRateLimits();
  const t0 = 1_000_000;
  for (let i = 0; i < 3; i++) assert.ok(rateLimit("k", 3, 1000, t0).ok);
  const blocked = rateLimit("k", 3, 1000, t0 + 10);
  assert.equal(blocked.ok, false);
  assert.ok(blocked.retryAfterSeconds >= 1);
  assert.ok(rateLimit("k", 3, 1000, t0 + 1001).ok);
});

test("rateLimit: keys are independent; reset works", () => {
  __clearRateLimits();
  rateLimit("a", 1, 1000, 0);
  assert.equal(rateLimit("a", 1, 1000, 1).ok, false);
  assert.ok(rateLimit("b", 1, 1000, 1).ok);
  rateLimitReset("a");
  assert.ok(rateLimit("a", 1, 1000, 2).ok);
});
