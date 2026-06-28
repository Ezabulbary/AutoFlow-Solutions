import { hashPassword, validatePassword, startSession } from '@/lib/auth';
import { resetPasswordWithToken } from '@/lib/users';
import { resetPasswordSchema, safeParse } from '@/lib/validation';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { sameOrigin, ok, fail, forbidden } from '@/lib/http';

export async function POST(req) {
  if (!sameOrigin(req)) return forbidden('Invalid origin');

  const ip = getClientIp(req);
  const limited = rateLimit(`reset:${ip}`, { limit: 10, windowMs: 60 * 60 * 1000 });
  if (!limited.allowed) return fail('Too many attempts. Please try again later.', 429);

  let body;
  try {
    body = await req.json();
  } catch {
    return fail('Invalid request body');
  }

  const { data, error } = safeParse(resetPasswordSchema, body);
  if (error) return fail(error);

  const policy = validatePassword(data.password);
  if (!policy.valid) return fail(`Weak password. Needs: ${policy.errors.join(', ')}.`);

  try {
    const passwordHash = await hashPassword(data.password);
    const user = await resetPasswordWithToken(data.token, passwordHash);
    if (!user) return fail('This reset link is invalid or has expired. Please request a new one.', 400);
    // Log the user straight in — they proved control of the account email.
    await startSession(user);
    return ok({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('reset-password error:', err);
    return fail('Could not reset password. Please try again.', 500);
  }
}
