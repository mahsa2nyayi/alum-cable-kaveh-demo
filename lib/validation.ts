/**
 * Input validation (zod). Every public/admin endpoint parses its body here.
 * Works with zod 3.25+ and 4.x.
 */
import { z } from "zod";

/** Remove NUL/control characters (Postgres rejects \u0000 -> 500 errors) and
 *  Unicode bidi-override characters (used to spoof text in the admin UI). */
export function stripUnsafe(input: string): string {
  return input.replace(
    // eslint-disable-next-line no-control-regex
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F‪-‮⁦-⁩]/g,
    "",
  );
}

const text = (max: number, min = 1) =>
  z
    .string()
    .transform(stripUnsafe)
    .pipe(z.string().trim().min(min).max(max));

const emptyToUndef = (v: unknown) => (v === "" || v === null ? undefined : v);

const optionalText = (max: number) =>
  z.preprocess(emptyToUndef, text(max).optional());

// digits (latin / persian / arabic-indic), + ( ) - . and spaces
const PHONE_RE = /^[+\d۰-۹٠-٩\s().-]{5,30}$/;

const phone = z.preprocess(
  emptyToUndef,
  z
    .string()
    .transform(stripUnsafe)
    .pipe(z.string().trim().regex(PHONE_RE))
    .optional(),
);

const email = z
  .string()
  .transform(stripUnsafe)
  .pipe(z.string().trim().toLowerCase().max(254).email());

export const langSchema = z
  .string()
  .transform((s) => s.toLowerCase())
  .pipe(z.enum(["fa", "en", "ar"]))
  .catch("fa");

const dbId = z.number().int().positive().max(2_147_483_647);

/** Honeypot: real users never see/fill this field; bots do. */
const honeypot = z.string().max(500).optional();

export const contactSchema = z.object({
  name: text(100),
  email,
  phone,
  message: text(5000),
  lang: langSchema,
  website: honeypot,
});

export const datasheetSchema = z.object({
  productId: z.coerce.number().int().positive().max(2_147_483_647),
  requestedSpec: text(200),
  name: text(100),
  company: optionalText(150),
  email,
  phone,
  message: optionalText(2000),
  lang: langSchema,
  website: honeypot,
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).email(),
  password: z.string().min(1).max(256),
});

export const messagePatchSchema = z.object({ id: dbId, read: z.boolean() });
export const messageDeleteSchema = z.object({ id: dbId });

export const messageListQuerySchema = z.object({
  take: z.coerce.number().int().min(1).max(100).catch(50),
  cursor: z.coerce.number().int().positive().max(2_147_483_647).optional().catch(undefined),
});

/** Single-line version of a user string, safe for mail subjects/headers. */
export const toSingleLine = (s: string, max = 120) =>
  stripUnsafe(s).replace(/[\r\n\t]+/g, " ").trim().slice(0, max);
