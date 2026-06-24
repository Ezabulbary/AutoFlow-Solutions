import { getCurrentUser, hashPassword, verifyPassword, validatePassword } from '@/lib/auth';
import { getFullUserById, updateUserPassword } from '@/lib/users';
import { changePasswordSchema, safeParse } from '@/lib/validation';
import { sameOrigin, ok, fail, forbidden } from '@/lib/http';

export async function POST(req) {
  if (!sameOrigin(req)) return forbidden('Invalid origin');

  const current = await getCurrentUser();
  if (!current) return fail('Not authenticated', 401);

  let body;
  try {
    body = await req.json();
  } catch {
    return fail('Invalid request body');
  }

  const { data, error } = safeParse(changePasswordSchema, body);
  if (error) return fail(error);

  const policy = validatePassword(data.newPassword);
  if (!policy.valid) return fail(`Weak password. Needs: ${policy.errors.join(', ')}.`);

  const full = await getFullUserById(current.id);
  const valid = await verifyPassword(data.currentPassword, full.password_hash);
  if (!valid) return fail('Current password is incorrect.', 403);

  const newHash = await hashPassword(data.newPassword);
  await updateUserPassword(current.id, newHash);
  return ok({ ok: true });
}
