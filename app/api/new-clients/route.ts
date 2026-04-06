import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const { data: newClients, error } = await supabase
      .from('auth.users')
      .select('*')
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lte('created_at', `${today}T23:59:59.999Z`);

    if (error) {
      console.error('Error counting new clients:', error);
      return Response.json({ error: 'Failed to count new clients' }, { status: 500 });
    }

    console.log('NEW CLIENTS FROM API:', newClients);

    return Response.json({ 
      count: newClients?.length || 0,
      clients: newClients || []
    });
  } catch (error) {
    console.error('API Error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
