import { NextResponse } from 'next/server';
import { resolveAmount, paymentLabel } from '@/lib/pricing';
import { getCurrentUser } from '@/lib/auth';
import { createPayment } from '@/lib/payments';
import { sameOrigin } from '@/lib/http';

export async function POST(req) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Please log in to continue.' }, { status: 401 });

    const { plan, tier, amount: customAmount, label } = await req.json();
    // Security: derive the price server-side; never trust a client amount (custom is bounded).
    const amount = resolveAmount({ plan, tier, amount: customAmount });
    if (amount === null) return NextResponse.json({ error: 'Invalid plan or amount.' }, { status: 400 });
    const planLabel = paymentLabel({ plan, tier, label });

    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
    const hasRealKey = apiKey && !apiKey.includes('REPLACE_WITH');

    if (isDemo || !hasRealKey) {
      await createPayment({ userId: user.id, plan: planLabel, amount, method: 'crypto', status: 'PAID', reference: 'demo' });
      const successUrl = `${req.nextUrl.origin}/success?method=crypto&plan=${encodeURIComponent(planLabel)}&amount=${amount}`;
      return NextResponse.json({ url: successUrl });
    }

    const res = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': apiKey,
        'X-CC-Version': '2018-03-22',
      },
      body: JSON.stringify({
        name: planLabel,
        description: `AutoFlow Solutions ${planLabel} crypto payment`,
        pricing_type: 'fixed_price',
        local_price: { amount: amount.toString(), currency: 'USD' },
        metadata: { customer_email: user.email, user_id: String(user.id) },
        redirect_url: `${req.nextUrl.origin}/success?method=crypto&plan=${encodeURIComponent(planLabel)}&amount=${amount}`,
        cancel_url: `${req.nextUrl.origin}/dashboard`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'Coinbase Commerce API returned an error.');
    }

    await createPayment({
      userId: user.id, plan: planLabel, amount, method: 'crypto', status: 'PENDING', reference: data.data?.id || null,
    });
    return NextResponse.json({ url: data.data.hosted_url });
  } catch (error) {
    console.error('Coinbase Commerce API error:', error);
    return NextResponse.json({ error: 'Failed to create Coinbase charge.' }, { status: 500 });
  }
}
