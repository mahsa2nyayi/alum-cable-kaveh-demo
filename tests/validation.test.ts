import test from "node:test";
import assert from "node:assert/strict";
import {
  contactSchema,
  datasheetSchema,
  loginSchema,
  messageDeleteSchema,
  messageListQuerySchema,
  messagePatchSchema,
  stripUnsafe,
  toSingleLine,
} from "../lib/validation";

const okContact = {
  name: "  Ali Rezaei ",
  email: "Ali@Example.COM",
  phone: "+98 21 4022 8249",
  message: "Need a quote for NYY 4x16",
  lang: "FA",
};

test("contact: valid input is trimmed / normalised", () => {
  const r = contactSchema.safeParse(okContact);
  assert.ok(r.success);
  assert.equal(r.data.name, "Ali Rezaei");
  assert.equal(r.data.email, "ali@example.com");
  assert.equal(r.data.lang, "fa");
});

test("contact: persian digits in phone are accepted", () => {
  assert.ok(contactSchema.safeParse({ ...okContact, phone: "۰۲۱۴۰۲۲۸۲۴۹" }).success);
});

test("contact: empty phone becomes undefined, bad phone rejected", () => {
  const r = contactSchema.safeParse({ ...okContact, phone: "" });
  assert.ok(r.success);
  assert.equal(r.data.phone, undefined);
  assert.equal(contactSchema.safeParse({ ...okContact, phone: "abc; DROP" }).success, false);
});

test("contact: NUL bytes are stripped (would crash Postgres otherwise)", () => {
  const r = contactSchema.safeParse({ ...okContact, message: "hi\u0000there" });
  assert.ok(r.success);
  assert.equal(r.data.message, "hithere");
});

test("contact: only-NUL / whitespace message is rejected", () => {
  assert.equal(contactSchema.safeParse({ ...okContact, message: "\u0000\u0000  " }).success, false);
});

test("contact: bidi override characters are stripped", () => {
  const r = contactSchema.safeParse({ ...okContact, name: "Ali‮gpj.exe" });
  assert.ok(r.success);
  assert.ok(!r.data.name.includes("‮"));
});

test("contact: header injection through e-mail is rejected", () => {
  for (const email of [
    "a@b.com\r\nBcc: evil@x.com",
    "a@b.com\nSubject: x",
    "a b@c.com",
    "no-at-sign",
  ]) {
    assert.equal(contactSchema.safeParse({ ...okContact, email }).success, false, email);
  }
});

test("contact: length limits enforced", () => {
  assert.equal(contactSchema.safeParse({ ...okContact, message: "x".repeat(5001) }).success, false);
  assert.equal(contactSchema.safeParse({ ...okContact, name: "x".repeat(101) }).success, false);
  assert.ok(contactSchema.safeParse({ ...okContact, message: "x".repeat(5000) }).success);
});

test("contact: wrong types are rejected, not coerced", () => {
  assert.equal(contactSchema.safeParse({ ...okContact, name: 123 }).success, false);
  assert.equal(contactSchema.safeParse({ ...okContact, message: { $ne: 1 } }).success, false);
  assert.equal(contactSchema.safeParse(null).success, false);
  assert.equal(contactSchema.safeParse("string").success, false);
});

test("contact: unknown lang falls back to fa", () => {
  const r = contactSchema.safeParse({ ...okContact, lang: "zz" });
  assert.ok(r.success);
  assert.equal(r.data.lang, "fa");
});

test("contact: unknown fields are dropped (no mass assignment)", () => {
  const r = contactSchema.safeParse({ ...okContact, read: true, id: 5, isAdmin: true });
  assert.ok(r.success);
  assert.deepEqual(Object.keys(r.data).sort(), ["email", "lang", "message", "name", "phone"].sort());
});

const okSheet = {
  productId: 3,
  requestedSpec: "3x25+16 mm2",
  name: "Sara",
  email: "sara@corp.io",
};

test("datasheet: valid + coercion of numeric string id", () => {
  const r = datasheetSchema.safeParse({ ...okSheet, productId: "3" });
  assert.ok(r.success);
  assert.equal(r.data.productId, 3);
});

test("datasheet: bad product ids rejected", () => {
  for (const productId of [0, -1, 1.5, "abc", null, undefined, 2 ** 40, "1; DROP TABLE"]) {
    assert.equal(datasheetSchema.safeParse({ ...okSheet, productId }).success, false, String(productId));
  }
});

test("datasheet: required fields enforced", () => {
  assert.equal(datasheetSchema.safeParse({ ...okSheet, requestedSpec: "   " }).success, false);
  assert.equal(datasheetSchema.safeParse({ ...okSheet, name: "" }).success, false);
});

test("login: normalises e-mail and caps password length", () => {
  const r = loginSchema.safeParse({ email: " Admin@Example.com ", password: "x" });
  assert.ok(r.success);
  assert.equal(r.data.email, "admin@example.com");
  assert.equal(loginSchema.safeParse({ email: "a@b.co", password: "x".repeat(257) }).success, false);
  assert.equal(loginSchema.safeParse({ email: "a@b.co", password: "" }).success, false);
  assert.equal(loginSchema.safeParse({ email: { $gt: "" }, password: "x" }).success, false);
});

test("admin message schemas", () => {
  assert.ok(messagePatchSchema.safeParse({ id: 5, read: true }).success);
  assert.equal(messagePatchSchema.safeParse({ id: "5", read: true }).success, false);
  assert.equal(messagePatchSchema.safeParse({ id: 5, read: "yes" }).success, false);
  assert.equal(messagePatchSchema.safeParse({ id: -1, read: true }).success, false);
  assert.ok(messageDeleteSchema.safeParse({ id: 9 }).success);
  assert.equal(messageDeleteSchema.safeParse({ id: 1.2 }).success, false);
  assert.equal(messageDeleteSchema.safeParse({}).success, false);
});

test("pagination query: bad values fall back to safe defaults", () => {
  const empty = messageListQuerySchema.parse({});
  assert.equal(empty.take, 50);
  assert.equal(empty.cursor, undefined);
  assert.equal(messageListQuerySchema.parse({ take: "100000" }).take, 50);
  assert.equal(messageListQuerySchema.parse({ take: "-5" }).take, 50);
  assert.equal(messageListQuerySchema.parse({ take: "20", cursor: "abc" }).cursor, undefined);
  assert.equal(messageListQuerySchema.parse({ take: "20", cursor: "7" }).cursor, 7);
});

test("helpers", () => {
  assert.equal(stripUnsafe("a\u0000b\u0007c\td\n"), "abc\td\n");
  assert.equal(toSingleLine("a\r\nBcc: x\tb"), "a Bcc: x b");
  assert.equal(toSingleLine("x".repeat(500), 10).length, 10);
});
