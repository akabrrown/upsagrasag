import { NextResponse } from 'next/server';
import { supabaseAdminClient } from '@/lib/supabase/admin/index';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${query.trim()}%`;
    const supabase = supabaseAdminClient;

    // Fetch from News
    const { data: newsData, error: newsError } = await supabase
      .from('news_updates')
      .select('id, title, slug, content, created_at')
      .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
      .limit(5);

    if (newsError) console.error('News Error:', newsError);

    // Fetch from Events
    const { data: eventsData, error: eventsError } = await supabase
      .from('events_programmes')
      .select('id, title, description, start_date')
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .eq('display_on_page', true)
      .limit(5);

    if (eventsError) console.error('Events Error:', eventsError);

    // Fetch from Resources
    const { data: resourcesData, error: resourcesError } = await supabase
      .from('resources')
      .select('id, title, description, file_url, link_url')
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .limit(3);

    if (resourcesError) console.error('Resources Error:', resourcesError);

    // Format results
    const formattedResults = [
      ...(newsData || []).map((item) => ({
        id: `news-${item.id}`,
        title: item.title,
        description: item.content?.substring(0, 100).replace(/<[^>]+>/g, '') + '...',
        url: `/news-updates/${item.slug}`,
        type: 'News',
        date: item.created_at,
      })),
      ...(eventsData || []).map((item) => ({
        id: `event-${item.id}`,
        title: item.title,
        description: item.description?.substring(0, 100) + '...',
        url: `/events/${item.id}`,
        type: 'Event',
        date: item.start_date,
      })),
      ...(resourcesData || []).map((item) => ({
        id: `resource-${item.id}`,
        title: item.title,
        description: item.description?.substring(0, 100) + '...',
        url: item.link_url || item.file_url || `/resources`,
        type: 'Resource',
        date: null,
      }))
    ];

    // Sort by relevance / recency (very basic sort)
    formattedResults.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return NextResponse.json({ results: formattedResults.slice(0, 10) });

  } catch (error: any) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}
