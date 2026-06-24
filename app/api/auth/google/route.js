import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';
import { googleConfigured, buildAuthUrl } from '@/lib/google';

export async function GET(req) {
  const origin = req.nextUrl.origin;

  if (!googleConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=google_not_configured`);
  }

  // CSRF protection: random state echoed back and verified in the callback.
  const state = randomBytes(16).toString('hex');
  const next = req.nextUrl.searchParams.get('next') || '/dashboard';

  const res = NextResponse.redirect(buildAuthUrl({ origin, state }));
  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600,
  };
  res.cookies.set('g_state', state, cookieOpts);
  res.cookies.set('g_next', next, cookieOpts);
  return res;
}
