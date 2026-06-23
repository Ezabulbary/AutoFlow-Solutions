import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req) {
  try {
    const { plan, amount, email } = await req.json();

    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const hasRealKey = secretKey && !secretKey.includes('REPLACE_WITH');

    if (isDemo || !hasRealKey) {
      // Demo Mode: redirect directly to our local success page
      const successUrl = `${req.nextUrl.origin}/success?method=stripe&plan=${encodeURIComponent(plan)}&amount=${amount}`;
      return NextResponse.json({ url: successUrl });
    }

    const stripe = new Stripe(secretKey, {
      apiVersion: '2023-10-16', // or latest
    });

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
      customer_email: email || undefined,
      success_url: `${req.nextUrl.origin}/success?method=stripe&plan=${encodeURIComponent(plan)}&amount=${amount}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create Stripe session.' }, { status: 500 });
  }
}
