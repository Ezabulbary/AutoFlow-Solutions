import { NextResponse } from 'next/server';
import { googleConfigured, exchangeCodeForProfile } from '@/lib/google';
import { findOrCreateGoogleUser } from '@/lib/users';
import { buildSessionCookie, SUPER_ADMIN_EMAIL, ROLES } from '@/lib/auth';

function redirectTo(origin, path) {
  return NextResponse.redirect(`${origin}${path}`);
}

export async function GET(req) {
  const origin = req.nextUrl.origin;
  const url = req.nextUrl;

  if (!googleConfigured()) return redirectTo(origin, '/login?error=google_not_configured');

  const error = url.searchParams.get('error');
  if (error) return redirectTo(origin, '/login?error=google');

  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = req.cookies.get('g_state')?.value;
  const next = req.cookies.get('g_next')?.value || '/dashboard';

  // CSRF: state must match the value we set before redirecting to Google.
  if (!code || !state || !savedState || state !== savedState) {
    return redirectTo(origin, '/login?error=google');
  }

  try {
    const profile = await exchangeCodeForProfile({ code, origin });
    const role = profile.email.toLowerCase() === SUPER_ADMIN_EMAIL ? ROLES.SUPER_ADMIN : ROLES.USER;
    const user = await findOrCreateGoogleUser({
      email: profile.email,
      name: profile.name,
      googleId: profile.googleId,
      role,
    });

    if (user.status === 'SUSPENDED') return redirectTo(origin, '/login?error=suspended');

    const cookie = await buildSessionCookie(user);
    const res = redirectTo(origin, next.startsWith('/') ? next : '/dashboard');
    res.cookies.set(cookie.name, cookie.value, cookie.options);
    // Clear the one-time OAuth cookies.
    res.cookies.set('g_state', '', { path: '/', maxAge: 0 });
    res.cookies.set('g_next', '', { path: '/', maxAge: 0 });
    return res;
  } catch (err) {
    console.error('Google OAuth error:', err);
    return redirectTo(origin, '/login?error=google');
  }
}
