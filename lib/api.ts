import { NextResponse } from "next/server";
import { HttpError } from "./http";

export const jsonError = (
  status: number,
  code: string,
  headers?: Record<string, string>,
) => NextResponse.json({ ok: false, error: code }, { status, headers });

/** Wrap a route handler: maps HttpError / unexpected errors to safe JSON. */
export async function safely(
  tag: string,
  fn: () => Promise<Response>,
): Promise<Response> {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof HttpError) {
      return jsonError(err.status, err.code, err.headers);
    }
    // Log server-side only; never leak internals to the client.
    console.error(`[${tag}]`, err instanceof Error ? err.message : "unknown error");
    return jsonError(500, "server_error");
  }
}
