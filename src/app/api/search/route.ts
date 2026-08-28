import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    const searchTerm = `%${query.trim()}%`;
    const supabase = await createServerSupabaseClient();

    // Fetch from News
    const { data: newsData } = await supabase
      .from('news_updates')
      .select('id, title, slug, content, created_at')
      .or(`title.ilike.${searchTerm},content.ilike.${searchTerm}`)
      .eq('status', 'published')
      .limit(5);

    // Fetch from Events
    const { data: eventsData } = await supabase
      .from('events_programmes')
      .select('id, title, description, start_date')
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .eq('display_on_page', true)
      .limit(5);

    // Fetch from Resources
    const { data: resourcesData } = await supabase
      .from('resources')
      .select('id, title, description, url')
      .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
      .limit(3);

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
        url: item.url || `/resources`,
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
