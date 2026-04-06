import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) {
      return Response.json({ error: 'Failed to count new clients' }, { status: 500 });
    }
    const newClients = data.users.filter(user => 
      user.created_at.startsWith(today)
    );
    return Response.json({ count: newClients.length });
  } catch (error) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}