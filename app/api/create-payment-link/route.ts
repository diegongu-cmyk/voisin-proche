import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: NextRequest) {
  try {
    const { reservationId, amount, serviceName } = await request.json();
    
    if (!reservationId || !amount || !serviceName) {
      return NextResponse.json(
        { error: 'Paramètres manquants: reservationId, amount, serviceName' },
        { status: 400 }
      );
    }
    
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      return NextResponse.json(
        { error: 'STRIPE_SECRET_KEY non configurée' },
        { status: 500 }
      );
    }
    
    // Detectar modo Stripe
    const isLiveMode = stripeKey.startsWith('sk_live_');
    
    if (!isLiveMode) {
      return NextResponse.json(
        { error: 'Mode test actif. Activez Stripe en mode réel pour générer des liens de paiement.' },
        { status: 403 }
      );
    }
    
    // Modo real: crear el Payment Link
    const stripe = require('stripe')(stripeKey);
    
    // 1. Crear producto temporal
    const product = await stripe.products.create({
      name: `${serviceName} - Réservation ${reservationId.slice(0, 8)}`,
    });
    
    // 2. Crear precio asociado
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(amount * 100), // Convertir euros a céntimos
      currency: 'eur',
    });
    
    // 3. Crear Payment Link
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: 'https://voisin-proche.vercel.app/reservation-confirmee',
        },
      },
    });
    
    // 4. Actualizar la reserva en Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // Obtener details actuales para hacer merge
    const { data: existing, error: fetchError } = await supabase
      .from('reservations')
      .select('details')
      .eq('id', reservationId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching reservation:', fetchError);
      return NextResponse.json(
        { error: 'Réservation non trouvée' },
        { status: 404 }
      );
    }
    
    const updatedDetails = {
      ...(existing.details || {}),
      paymentLink: paymentLink.url,
    };
    
    const { error: updateError } = await supabase
      .from('reservations')
      .update({
        prix: amount,
        details: updatedDetails,
      })
      .eq('id', reservationId);
    
    if (updateError) {
      console.error('Error updating reservation:', updateError);
      return NextResponse.json(
        { error: 'Erreur lors de la mise à jour' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      paymentLink: paymentLink.url 
    });
    
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
