import { destroySession } from '@/lib/auth';
import { sameOrigin, ok, forbidden } from '@/lib/http';

export async function POST(req) {
  if (!sameOrigin(req)) return forbidden('Invalid origin');
  await destroySession();
  return ok({ ok: true });
}
