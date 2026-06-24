import {
  hashPassword,
  validatePassword,
  startSession,
  SUPER_ADMIN_EMAIL,
  ROLES,
} from '@/lib/auth';
import { createUser, getUserByEmail } from '@/lib/users';
import { registerSchema, safeParse } from '@/lib/validation';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { sameOrigin, ok, fail, forbidden } from '@/lib/http';

export async function POST(req) {
  if (!sameOrigin(req)) return forbidden('Invalid origin');

  const ip = getClientIp(req);
  const limited = rateLimit(`register:${ip}`, { limit: 8, windowMs: 60 * 60 * 1000 });
  if (!limited.allowed) return fail('Too many attempts. Please try again later.', 429);

  let body;
  try {
    body = await req.json();
  } catch {
    return fail('Invalid request body');
  }

  const { data, error } = safeParse(registerSchema, body);
  if (error) return fail(error);

  const policy = validatePassword(data.password);
  if (!policy.valid) return fail(`Weak password. Needs: ${policy.errors.join(', ')}.`);

  try {
    const existing = await getUserByEmail(data.email);
    if (existing) return fail('An account with this email already exists.', 409);

    const role = data.email === SUPER_ADMIN_EMAIL ? ROLES.SUPER_ADMIN : ROLES.USER;
    const passwordHash = await hashPassword(data.password);
    const user = await createUser({ name: data.name, email: data.email, passwordHash, role });
    await startSession(user);
    return ok({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    // Mongo duplicate-key race → treat as duplicate; otherwise generic.
    if (err?.code === 11000) return fail('An account with this email already exists.', 409);
    console.error('register error:', err);
    return fail('Could not create account. Please try again.', 500);
  }
}
