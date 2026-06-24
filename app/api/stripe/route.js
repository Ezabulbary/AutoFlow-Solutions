import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { resolvePlanAmount } from '@/lib/pricing';
import { getCurrentUser } from '@/lib/auth';
import { createPayment } from '@/lib/payments';
import { sameOrigin } from '@/lib/http';

export async function POST(req) {
  try {
    if (!sameOrigin(req)) return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });

    // Payment requires an account (registration-before-payment).
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Please log in to continue.' }, { status: 401 });

    const { plan } = await req.json();
    // Security: derive the price server-side from the plan; never trust the client.
    const amount = resolvePlanAmount(plan);
    if (amount === null) return NextResponse.json({ error: 'Unknown plan selected.' }, { status: 400 });

    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE !== 'false';
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const hasRealKey = secretKey && !secretKey.includes('REPLACE_WITH');

    if (isDemo || !hasRealKey) {
      await createPayment({ userId: user.id, plan, amount, method: 'stripe', status: 'PAID', reference: 'demo' });
      const successUrl = `${req.nextUrl.origin}/success?method=stripe&plan=${encodeURIComponent(plan)}&amount=${amount}`;
      return NextResponse.json({ url: successUrl });
    }

    const stripe = new Stripe(secretKey, { apiVersion: '2023-10-16' });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan,
              description: `AutoFlow Solutions — ${plan} plan setup & automation workflow development.`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: user.email,
      success_url: `${req.nextUrl.origin}/success?method=stripe&plan=${encodeURIComponent(plan)}&amount=${amount}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/dashboard`,
    });

    // Record as pending; confirm via Stripe webhook in production.
    await createPayment({ userId: user.id, plan, amount, method: 'stripe', status: 'PENDING', reference: session.id });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe API error:', error);
    return NextResponse.json({ error: 'Failed to create Stripe session.' }, { status: 500 });
  }
}
