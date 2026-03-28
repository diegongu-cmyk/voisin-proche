import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { amount, serviceName, reservationId } = await request.json();

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: serviceName,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://voisin-proche.vercel.app/reservation-confirmee',
      cancel_url: 'https://voisin-proche.vercel.app/reserver',
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
