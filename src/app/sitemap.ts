import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase/browser';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://grasag.upsa.edu.gh';

  const staticRoutes = [
    '',
    '/about',
    '/about/community',
    '/about/constitution',
    '/academics',
    '/leadership',
    '/gallery',
    '/contact',
    '/events',
    '/news-updates',
    '/resources',
    '/signin',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Dynamic events
    const { data: events } = await supabase
      .from('events_programmes')
      .select('id, start_date')
      .eq('display_on_page', true);

    const eventRoutes = (events || []).map((event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: event.start_date || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    // Dynamic news
    const { data: news } = await supabase
      .from('news_updates')
      .select('id, created_at, published_at');

    const newsRoutes = (news || []).map((item) => ({
      url: `${baseUrl}/news-updates/${item.id}`,
      lastModified: item.published_at || item.created_at || new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...eventRoutes, ...newsRoutes];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return staticRoutes;
  }
}
