/** Server-side admin check used inside route handlers (defence in depth on
 *  top of middleware). Node runtime only. */
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { HttpError } from "./http";
import { SESSION_COOKIE, passwordVersion, verifySession } from "./session";

export async function requireAdmin() {
  const store = await cookies();
  const claims = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!claims) throw new HttpError(401, "unauthorized");

  const id = Number(claims.sub);
  if (!Number.isSafeInteger(id)) throw new HttpError(401, "unauthorized");

  const admin = await prisma.admin.findUnique({
    where: { id },
    select: { id: true, email: true, password: true },
  });
  // Deleted admin or changed password => old tokens stop working at once.
  if (!admin || (await passwordVersion(admin.password)) !== claims.pv) {
    throw new HttpError(401, "unauthorized");
  }
  return { id: admin.id, email: admin.email };
}
