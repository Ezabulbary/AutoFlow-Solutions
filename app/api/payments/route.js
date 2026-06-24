import { getCurrentUser } from '@/lib/auth';
import { resolvePlanAmount } from '@/lib/pricing';
import { createPayment, listPaymentsByUser } from '@/lib/payments';
import { paymentSchema, safeParse } from '@/lib/validation';
import { sameOrigin, ok, fail, forbidden } from '@/lib/http';

// Records PayPal / bank-transfer payments (methods that don't redirect through
// the Stripe/Coinbase routes). Auth-gated and price-derived server-side.
export async function POST(req) {
  if (!sameOrigin(req)) return forbidden('Invalid origin');

  const user = await getCurrentUser();
  if (!user) return fail('Please log in to continue.', 401);

  let body;
  try {
    body = await req.json();
  } catch {
    return fail('Invalid request body');
  }

  const { data, error } = safeParse(paymentSchema, body);
  if (error) return fail(error);

  const amount = resolvePlanAmount(data.plan);
  if (amount === null) return fail('Unknown plan selected.');

  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
  // Bank transfers are always pending manual verification; others settle in demo.
  const status = data.method === 'bank' ? 'PENDING' : isDemo ? 'PAID' : 'PENDING';

  const payment = await createPayment({
    userId: user.id,
    plan: data.plan,
    amount,
    method: data.method,
    status,
    reference: isDemo ? 'demo' : null,
  });

  return ok({ payment: { id: String(payment.id), status: payment.status } });
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail('Not authenticated', 401);
  const payments = await listPaymentsByUser(user.id);
  return ok({
    payments: payments.map((p) => ({
      id: String(p.id),
      plan: p.plan,
      amount: Number(p.amount),
      method: p.method,
      status: p.status,
      created_at: p.created_at,
    })),
  });
}
