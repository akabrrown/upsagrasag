import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response('Unauthorized', { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const embedModel = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });

    const urlsToScrape = [
      'https://upsa.edu.gh/',
      'https://upsa.edu.gh/academics/programmes/',
      'https://upsa.edu.gh/admissions/',
      'https://upsa.edu.gh/about-us/'
    ];

    let totalChunks = 0;

    // Deletes all previous embeddings to keep it fresh
    await supabase.from('site_content').delete().neq('id', 0);

    for (const url of urlsToScrape) {
      const response = await fetch(url);
      if (!response.ok) continue;

      const html = await response.text();
      const $ = cheerio.load(html);

      $('script, style, nav, footer, header, .widget').remove();
      const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
      
      const chunkSize = 1000;
      const chunks = [];
      for (let i = 0; i < bodyText.length; i += chunkSize) {
        chunks.push(bodyText.slice(i, i + chunkSize));
      }

      for (const chunk of chunks) {
        if (chunk.length < 50) continue;
        
        // Generate embedding with Gemini
        const result = await embedModel.embedContent(chunk);

        // Insert into Supabase
        await supabase.from('site_content').insert({
          url,
          chunk,
          embedding: result.embedding.values
        });

        totalChunks++;
      }
    }

    return NextResponse.json({ success: true, message: `Scraped and embedded ${totalChunks} chunks using Gemini.` });
  } catch (error: any) {
    console.error('Scraping error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
