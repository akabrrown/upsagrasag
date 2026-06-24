import { supabaseClient } from '@/lib/supabaseClient';

export const GET = async () => {
  try {
    const { data, error } = await supabaseClient
      .from('leadership')
      .select('id, name, title:role, photo_url:image_url, type, display_order')
      .eq('type', 'executive')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Supabase leadership fetch error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Ensure we always return an array
    const execArray = Array.isArray(data) ? data : [];
    return new Response(JSON.stringify(execArray), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Leadership API error:', err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
