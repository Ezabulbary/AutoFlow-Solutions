import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { plan, amount, email } = await req.json();

    const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
    const apiKey = process.env.COINBASE_COMMERCE_API_KEY;
    const hasRealKey = apiKey && !apiKey.includes('REPLACE_WITH');

    if (isDemo || !hasRealKey) {
      // Demo Mode: redirect directly to our local success page
      const successUrl = `${req.nextUrl.origin}/success?method=crypto&plan=${encodeURIComponent(plan)}&amount=${amount}`;
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
        name: plan,
        description: `AutoFlow Solutions — ${plan} plan crypto payment`,
        pricing_type: 'fixed_price',
        local_price: {
          amount: amount.toString(),
          currency: 'USD',
        },
        metadata: {
          customer_email: email,
        },
        redirect_url: `${req.nextUrl.origin}/success?method=crypto&plan=${encodeURIComponent(plan)}&amount=${amount}`,
        cancel_url: `${req.nextUrl.origin}/`,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || 'Coinbase Commerce API returned an error.');
    }

    return NextResponse.json({ url: data.data.hosted_url });
  } catch (error) {
    console.error('Coinbase Commerce API error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create Coinbase charge.' }, { status: 500 });
  }
}
