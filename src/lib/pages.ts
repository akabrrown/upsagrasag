import supabaseAdmin from '@/lib/supabaseAdmin';

export async function getPageData(slug: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('page_contents')
      .select('title, content, image_url')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    
    // Map database fields to the format expected by the frontend
    return {
      title: data.title,
      content: data.content,
      imageUrl: data.image_url || ''
    };
  } catch (err) {
    console.error(`Error reading page_contents for slug ${slug}:`, err);
    return null;
  }
}
