import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, serviceName, reservationId } = await request.json();

    if (!amount || !serviceName || !reservationId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: serviceName,
              description: `Réservation #${reservationId}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://voisin-proche.vercel.app'}/reservation-confirmee`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://voisin-proche.vercel.app'}/reserver`,
      metadata: {
        reservationId: reservationId.toString(),
        serviceName: serviceName,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
