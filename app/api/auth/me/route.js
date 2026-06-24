import { getCurrentUser } from '@/lib/auth';
import { ok } from '@/lib/http';

export async function GET() {
  try {
    const user = await getCurrentUser();
    return ok({ user });
  } catch {
    // DB not configured yet, etc. — treat as logged out rather than erroring.
    return ok({ user: null });
  }
}
