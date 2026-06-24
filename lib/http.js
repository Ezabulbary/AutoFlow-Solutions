import { NextResponse } from 'next/server';

/**
 * CSRF defense: for state-changing requests, require the browser-sent Origin
 * to match the request Host. Combined with SameSite=Lax cookies and JSON-only
 * bodies, this blocks cross-site forgery.
 */
export function sameOrigin(req) {
  const origin = req.headers.get('origin');
  if (!origin) return false; // browsers always send Origin on cross-origin POSTs
  try {
    const host = req.headers.get('host');
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function ok(data, init) {
  return NextResponse.json(data ?? { ok: true }, init);
}

export function fail(message, status = 400, extra) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

export function forbidden(message = 'Not allowed') {
  return fail(message, 403);
}
