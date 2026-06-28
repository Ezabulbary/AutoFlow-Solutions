// Google OAuth 2.0 helpers (no extra dependency — plain fetch).

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function getRedirectUri(origin) {
  // Always use the actual host the user is on (localhost in dev, your real
  // domain in production) so the redirect_uri matches what's registered in
  // Google Console. Fall back to NEXT_PUBLIC_SITE_URL only if origin is absent.
  const base = origin || process.env.NEXT_PUBLIC_SITE_URL;
  return `${String(base).replace(/\/$/, '')}/api/auth/google/callback`;
}

export function buildAuthUrl({ origin, state }) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: getRedirectUri(origin),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
    prompt: 'select_account',
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForProfile({ code, origin }) {
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: getRedirectUri(origin),
      grant_type: 'authorization_code',
    }),
  });
  if (!tokenRes.ok) throw new Error('Token exchange failed');
  const tokens = await tokenRes.json();

  const infoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  if (!infoRes.ok) throw new Error('Failed to fetch Google profile');
  const profile = await infoRes.json();

  if (!profile.email || !profile.verified_email) {
    throw new Error('Google account email is not verified');
  }
  return { email: profile.email, name: profile.name, googleId: profile.id };
}
