import { verifyPassword, startSession } from '@/lib/auth';
import {
  getUserByEmail,
  registerFailedLogin,
  resetFailedLogin,
  isLocked,
} from '@/lib/users';
import { loginSchema, safeParse } from '@/lib/validation';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { sameOrigin, ok, fail, forbidden } from '@/lib/http';

// Constant-ish dummy hash so a missing user costs about the same as a real one
// (mitigates user-enumeration via timing).
const DUMMY_HASH = '$2a$12$CwTycUXWue0Thq9StjUM0uJ8Dvf9j9j9j9j9j9j9j9j9j9j9j9j9C';
const GENERIC = 'Invalid email or password.';

export async function POST(req) {
  if (!sameOrigin(req)) return forbidden('Invalid origin');

  const ip = getClientIp(req);
  const limited = rateLimit(`login:${ip}`, { limit: 10, windowMs: 15 * 60 * 1000 });
  if (!limited.allowed) return fail('Too many attempts. Please try again later.', 429);

  let body;
  try {
    body = await req.json();
  } catch {
    return fail('Invalid request body');
  }

  const { data, error } = safeParse(loginSchema, body);
  if (error) return fail(GENERIC, 401);

  try {
    const user = await getUserByEmail(data.email);
    if (!user || !user.password_hash) {
      // Unknown user, or an OAuth-only account with no password set.
      await verifyPassword(data.password, DUMMY_HASH).catch(() => {});
      return fail(GENERIC, 401);
    }

    if (isLocked(user)) {
      return fail('Account temporarily locked due to failed attempts. Try again later.', 429);
    }

    const valid = await verifyPassword(data.password, user.password_hash);
    if (!valid) {
      await registerFailedLogin(user.id);
      return fail(GENERIC, 401);
    }

    if (user.status === 'SUSPENDED') {
      return fail('This account has been suspended. Contact support.', 403);
    }

    await resetFailedLogin(user.id);
    await startSession(user);
    return ok({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('login error:', err);
    return fail('Something went wrong. Please try again.', 500);
  }
}
