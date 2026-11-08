# Security audit & hardening report

Scope: back end (API routes, authentication, database access, configuration) and
the parts of the front end that talk to it. Method: manual code review of the
original project, then fixes verified with unit tests and a real PostgreSQL 16.

## Findings in the original code and what changed

| # | Severity | Finding | Fix |
|---|---|---|---|
| 1 | **Critical** | `GET/PATCH/DELETE /api/messages` had **no authentication**: anyone could read (names, e-mails, phones, messages) or delete every contact message. | Route and its duplicate admin page removed. |
| 2 | **Critical** | `/api/admin/messages` was also open: the middleware matcher only covered `/admin/*` pages, not `/api/admin/*`. | Middleware now protects `/admin/*` **and** `/api/admin/*` (401 JSON); every handler additionally calls `requireAdmin()` (defence in depth). |
| 3 | **High** | JWT secret fell back to the public string `change-this-secret-in-production` when the env var was missing, so anyone could forge an admin token. | Fails closed in production: `JWT_SECRET` must be ≥ 32 chars. |
| 4 | **High** | A real `.env` (database URL, SMTP password, JWT secret) was inside the project archive. | Excluded from the deliverable. **Rotate all three secrets.** |
| 5 | **High** | No brute-force protection on admin login. | Rate limits per IP (20 / 15 min) and per account (8 / 15 min). |
| 6 | Medium | Login timing revealed whether an e-mail exists (bcrypt only ran for known users). | A dummy bcrypt hash is compared for unknown users; identical error for both cases. |
| 7 | Medium | No validation / size limits on public forms. A `\u0000` byte or an unknown `productId` crashed with HTTP 500 (both reproduced on PostgreSQL: `invalid byte sequence 0x00`, FK violation). | zod schemas, 16 KB body cap, content-type check, control/bidi-character stripping, product existence check. |
| 8 | Medium | No CSRF defence beyond `SameSite=Lax`. | `SameSite=Strict` + Origin / Fetch-Metadata check on every state-changing `/api/*` request. |
| 9 | Medium | No security headers; `X-Powered-By` exposed. | CSP, HSTS (prod), `X-Frame-Options`, `nosniff`, Referrer-Policy, Permissions-Policy, COOP; `poweredByHeader: false`. |
| 10 | Medium | Public forms had no spam / flood protection. | Per-IP rate limits (5 / 10 min) + honeypot field. |
| 11 | Low | JWT: algorithm not pinned, no issuer/audience, 7-day lifetime, no way to revoke. | HS256 pinned, `iss`/`aud` checked, 12 h lifetime, password-version claim (changing a password or deleting an admin invalidates old tokens). |
| 12 | Low | Contact e-mails went to a hard-coded real mailbox, SMTP could fall back to plain text, subject not sanitised. | `CONTACT_RECIPIENT` env (empty = no mail), STARTTLS/TLS ≥ 1.2 enforced, timeouts, single-line subject, `replyTo` validated. A failing mail server no longer loses the message. |
| 13 | Low | Admin API returned all rows; PATCH/DELETE accepted any JSON type for `id`; missing rows threw 500. | Cursor pagination, typed `id`, `updateMany/deleteMany` → clean 404. |
| 14 | Low | Dependencies: `seed` listed as a dependency, unused `jsonwebtoken`/`cookie`/`dotenv`, `prisma` CLI missing (so `npx prisma` would fetch a newer major). | Cleaned; `prisma` pinned to 5.22 as a dev dependency. |
| 15 | Low | Production console logging of full Prisma queries in some modes. | Only `warn`/`error` in dev, `error` in prod. |

## Non-security bugs found and fixed

- Contact form posted to `/api/contact` (route is `/api/contactUs`) → **the form never worked**.
- Header logo `/Logo.png` vs file `logo.png` → broken on Linux hosts (works on Windows).
- Footer link `/costumers`, news links `/{lang}/news/...` and an empty menu link → 404s.
- Metadata icon / OG image paths started with `./public/`; hreflang pointed to non-existent `/en` and `/ar` routes.
- `globals.css`: `@import` was not the first statement and Tailwind v3 directives were left over.
- Prisma `binaryTargets` contained `windows`; OpenStreetMap attribution was disabled (required by its tile policy).

## Verification performed

- 31 unit tests (`npm test`): validation (injection-style payloads, header-injection e-mails, NUL bytes, oversized and mistyped input, mass assignment), rate limiter, Origin/CSRF logic, client-IP parsing, request-body caps. All pass.
- Strict TypeScript check of the pure modules (`validation`, `http`, `rate-limit`, tests): 0 errors.
- All 5 original migrations + the new index migration applied to a clean **PostgreSQL 16**; resulting columns match `schema.prisma`.
- Syntax check of all 58 source files; asset paths audited case-sensitively against `public/`.
- The 3D hero was rendered in headless Chromium (desktop and mobile viewports) with no console errors.

## Not verified here — please run before going live

- `next build`, the full app against a database, ESLint and `npm audit`: package installation was blocked in the sandbox. The included GitHub Actions workflow runs them on every push.
- `lib/session.ts` / `lib/admin-guard.ts` / the route handlers depend on `jose`, `bcrypt`, Prisma and Next, so they were reviewed but not executed.
- Dynamic scanning (OWASP ZAP, `nuclei`) and a manual login/CSRF walkthrough against a running instance.
- Docker image build and `docker-compose.yml` (YAML syntax validated only).

## Known limitations (by design for a demo)

- Rate limiting is in-memory (per process). Use Redis/Upstash for multiple instances.
- CSP allows `'unsafe-inline'` scripts because Next.js injects inline bootstrap code; a nonce-based CSP needs fully dynamic rendering.
- No 2FA or admin audit log; password rules are enforced only when the admin is created.
- Next.js 16 renamed `middleware` to `proxy`; `middleware.ts` still works but may print a deprecation notice.
