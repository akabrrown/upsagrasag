import supabaseAdmin from '@/lib/supabaseAdmin';
import { redis } from '@/lib/redis';

const CACHE_TTL = 3600; // 1 hour

export async function getPageData(slug: string) {
  const cacheKey = `page_data:${slug}`;

  try {
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
    }
  } catch (err) {
    console.error('Redis cache error:', err);
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('page_contents')
      .select('title, content, image_url')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    
    // Map database fields to the format expected by the frontend
    const pageData = {
      title: data.title,
      content: data.content,
      imageUrl: data.image_url || ''
    };

    try {
      await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(pageData));
    } catch (err) {
      console.error('Redis cache set error:', err);
    }

    return pageData;
  } catch (err) {
    console.error(`Error reading page_contents for slug ${slug}:`, err);
    return null;
  }
}
