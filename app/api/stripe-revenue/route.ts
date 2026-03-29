import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    // Get today's start and end timestamps
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    // Get this month's start
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    
    // Fetch today's successful payments
    const todayPayments = await stripe.paymentIntents.list({
      created: {
        gte: Math.floor(todayStart.getTime() / 1000),
        lte: Math.floor(todayEnd.getTime() / 1000),
      },
      limit: 100,
    });
    
    // Fetch this month's successful payments
    const monthPayments = await stripe.paymentIntents.list({
      created: {
        gte: Math.floor(monthStart.getTime() / 1000),
      },
      limit: 100,
    });
    
    const todayRevenue = todayPayments.data
      .filter((p: any) => p.status === 'succeeded')
      .reduce((sum: number, p: any) => sum + p.amount, 0) / 100;
      
    const monthRevenue = monthPayments.data
      .filter((p: any) => p.status === 'succeeded')
      .reduce((sum: number, p: any) => sum + p.amount, 0) / 100;
    
    return NextResponse.json({ todayRevenue, monthRevenue });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
