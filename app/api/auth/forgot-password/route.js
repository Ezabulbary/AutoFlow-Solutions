import { setPasswordReset } from '@/lib/users';
import { sendEmail, resetPasswordEmail } from '@/lib/email';
import { forgotPasswordSchema, safeParse } from '@/lib/validation';
import { rateLimit, getClientIp } from '@/lib/rateLimit';
import { sameOrigin, ok, fail, forbidden } from '@/lib/http';

export async function POST(req) {
  if (!sameOrigin(req)) return forbidden('Invalid origin');

  const ip = getClientIp(req);
  const limited = rateLimit(`forgot:${ip}`, { limit: 5, windowMs: 60 * 60 * 1000 });
  if (!limited.allowed) return fail('Too many requests. Please try again later.', 429);

  let body;
  try {
    body = await req.json();
  } catch {
    return fail('Invalid request body');
  }

  const { data, error } = safeParse(forgotPasswordSchema, body);
  if (error) return fail(error);

  // Always respond the same way — never reveal whether an email is registered.
  try {
    const result = await setPasswordReset(data.email);
    if (result) {
      const base = (process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin).replace(/\/$/, '');
      const url = `${base}/reset-password?token=${result.rawToken}`;
      const mail = resetPasswordEmail({ name: result.user.name, url });
      await sendEmail({ to: data.email, ...mail });
    }
  } catch (err) {
    console.error('forgot-password error:', err);
  }

  return ok({ message: 'If an account exists for that email, a reset link has been sent.' });
}
