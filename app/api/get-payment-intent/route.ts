import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      return NextResponse.json({ error: 'Missing session_id parameter' }, { status: 400 });
    }

    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

    // Retrieve the checkout session to get the payment_intent_id
    const session = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json({ 
      payment_intent: session.payment_intent,
      status: session.status,
      payment_status: session.payment_status
    });

  } catch (error: any) {
    console.error('Error retrieving payment intent:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
