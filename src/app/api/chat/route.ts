import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';
import { upsaKnowledge } from './knowledge';
import OpenAI from 'openai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey || openaiApiKey === 'REDACTED') {
      const errorMessage = "⚠️ **System Error**: I cannot connect to my brain. The `OPENAI_API_KEY` environment variable is missing from your Vercel project settings.\n\nPlease go to your Vercel Dashboard -> Project Settings -> Environment Variables, add your `OPENAI_API_KEY`, and redeploy.";
      
      const encoder = new TextEncoder();
      const customStream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(errorMessage));
          controller.close();
        }
      });
      
      return new Response(customStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
        },
      });
    }

    const openai = new OpenAI({ apiKey: openaiApiKey });

    // Get the latest user message for similarity search
    const userMessages = messages.filter((m: any) => m.role === 'user');
    const latestUserMessage = userMessages[userMessages.length - 1]?.content || '';

    let contextText = '';

    // Only perform RAG if we have a user message and Supabase keys
    if (latestUserMessage && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

        // 1. Generate embedding for user query using OpenAI
        const embeddingResponse = await openai.embeddings.create({
          model: 'text-embedding-3-small',
          input: latestUserMessage,
        });
        const query_embedding = embeddingResponse.data[0].embedding;

        // 2. Search Supabase for matching content
        const { data: matchedChunks, error } = await supabase.rpc('match_site_content', {
          query_embedding,
          match_threshold: 0.75, // 0 to 1 scale, 0.75 is a reasonable default
          match_count: 5 // Get top 5 chunks
        });

        if (error) {
          console.error('Supabase RPC Error:', error);
        } else if (matchedChunks && matchedChunks.length > 0) {
          contextText = matchedChunks.map((chunk: any) => chunk.chunk).join('\n\n');
        }
      } catch (ragError) {
        console.error('RAG Error (continuing without context):', ragError);
      }
    }

    // Custom Web Scraper Logic
    if (latestUserMessage) {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const urls = latestUserMessage.match(urlRegex) || [];
      
      for (const url of urls) {
        try {
          // Add a short timeout to prevent hanging the chat
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          
          const pageRes = await fetch(url, { signal: controller.signal });
          clearTimeout(timeoutId);
          
          if (pageRes.ok) {
            const html = await pageRes.text();
            const $ = cheerio.load(html);
            
            // Remove unnecessary elements
            $('script, style, nav, footer, header, iframe, noscript').remove();
            
            // Extract text and clean it
            let text = $('body').text().replace(/\s+/g, ' ').trim();
            // Truncate to roughly 2000 characters to prevent blowing up the context window
            if (text.length > 2000) text = text.substring(0, 2000) + '...';
            
            contextText += `\n\n--- SCRAPED CONTENT FROM URL (${url}) ---\n${text}\n----------------------------------\n`;
          }
        } catch (scrapeError) {
          console.error(`Failed to scrape URL ${url}:`, scrapeError);
        }
      }
    }

    // Ensure alternating or valid roles for OpenAI
    const cleanMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content || ' '
    }));

    // Build the system prompt
    let systemContent = 'You are the UPSA GRASAG Virtual Assistant, a helpful virtual assistant for the University of Professional Studies, Accra (UPSA).';
    systemContent += '\nYou must use the knowledge base provided below to answer user queries. Do NOT invent, guess, or hallucinate information about UPSA that is not explicitly in the knowledge base. If the answer is not in the knowledge base, politely inform the user that you do not have that specific information and direct them to https://upsa.edu.gh.\n\n';
    
    // Always inject the verified static knowledge
    systemContent += `--- VERIFIED UPSA KNOWLEDGE BASE ---\n${upsaKnowledge}\n----------------------------------\n\n`;

    if (contextText) {
      systemContent += `--- ADDITIONAL DATABASE CONTEXT ---\n${contextText}\n----------------------------------`;
    }

    const filteredMessages = cleanMessages.filter((m: any) => 
      m.content !== "👋 Hello! I'm your virtual assistant. I can help with admissions, programs, student life, and more at the University of Professional Studies, Accra. How can I assist you today?" && 
      m.content.indexOf("Smart UPSA") === -1
    );

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemContent },
        ...filteredMessages
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.choices[0]?.delta?.content || '';
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err: any) {
          console.error('OpenAI Stream Error:', err);
          const errorMsg = `\n\n⚠️ **System Error**: ${err.message || 'Error communicating with OpenAI'}`;
          controller.enqueue(encoder.encode(errorMsg));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    
    const errorMessage = `⚠️ **System Error**: ${error.message || 'Internal server error'}\n\nIf you are on Vercel, check your deployment logs or Environment Variables.`;
    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(errorMessage));
        controller.close();
      }
    });
    
    return new Response(customStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    });
  }
}
