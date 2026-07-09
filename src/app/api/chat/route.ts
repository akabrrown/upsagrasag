import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL || 'mixtral-8x7b-32768';

    // Get the latest user message for similarity search
    const userMessages = messages.filter((m: any) => m.role === 'user');
    const latestUserMessage = userMessages[userMessages.length - 1]?.content || '';

    let contextText = '';

    // Only perform RAG if we have a user message and GEMINI_API_KEY is present
    if (latestUserMessage && process.env.GEMINI_API_KEY && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const embedModel = genAI.getGenerativeModel({ model: 'embedding-001' });
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');

        // 1. Generate embedding for user query
        const result = await embedModel.embedContent(latestUserMessage);
        const query_embedding = result.embedding.values;

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

    // Ensure alternating or valid roles for Groq/Gemini
    const cleanMessages = messages.map((m: any) => ({
      role: m.role,
      content: m.content || ' '
    }));

    // Build the system prompt
    let systemContent = 'You are the UPSA GRASAG Virtual Assistant, a helpful virtual assistant for the University of Professional Studies, Accra (UPSA).';
    systemContent += '\nYou must fetch all information strictly from the University of Professional Studies, Accra official website (https://upsa.edu.gh/). If you are unable to verify the answer from upsa.edu.gh or the provided context below, politely decline to answer and direct the user to visit https://upsa.edu.gh.';
    
    if (contextText) {
      systemContent += `\n\n--- CONTEXT FROM UPSA WEBSITE ---\n${contextText}\n----------------------------------`;
    }

    const useGemini = !groqApiKey || groqApiKey === 'REDACTED';

    if (useGemini) {
      if (!process.env.GEMINI_API_KEY) {
        // Return a readable error directly in the chat UI
        const errorMessage = "⚠️ **System Error**: I cannot connect to my brain. The `GEMINI_API_KEY` environment variable is missing from your Vercel project settings.\n\nPlease go to your Vercel Dashboard -> Project Settings -> Environment Variables, add your `GEMINI_API_KEY`, and redeploy.";
        
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
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const geminiModel = genAI.getGenerativeModel({
        model: 'gemini-1.5-pro-latest',
        systemInstruction: systemContent
      });

      const filteredMessages = cleanMessages.filter((m: any) => 
        m.content !== "👋 Hello! I'm your virtual assistant. I can help with admissions, programs, student life, and more at the University of Professional Studies, Accra. How can I assist you today?" && 
        m.content.indexOf("Smart UPSA") === -1
      );

      const contents = filteredMessages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const result = await geminiModel.generateContentStream({
        contents
      });

      const encoder = new TextEncoder();
      const customStream = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            }
          } catch (err) {
            console.error('Gemini Stream Error:', err);
            controller.error(err);
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
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemContent },
          ...cleanMessages.filter((m: any) => m.content !== "👋 Hello! I'm your virtual assistant. I can help with admissions, programs, student life, and more at the University of Professional Studies, Accra. How can I assist you today?" && m.content.indexOf("Smart UPSA") === -1)
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API Error:', response.status, errorText);
      
      const errorMessage = `⚠️ **System Error**: Groq service error - ${response.status}\n\n${errorText}`;
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

    // Set up a ReadableStream to stream the response back to the client
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const reader = response.body?.getReader();

    if (!reader) {
      return NextResponse.json({ error: 'Failed to read response stream from Groq' }, { status: 500 });
    }

    const customStream = new ReadableStream({
      async start(controller) {
        let buffer = '';
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith('data: ')) continue;
              
              const dataLine = trimmed.slice(6);
              if (dataLine === '[DONE]') continue;

              try {
                const parsed = JSON.parse(dataLine);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch (err) {
                // Ignore incomplete line parse issues
              }
            }
          }
        } catch (error) {
          controller.error(error);
        } finally {
          controller.close();
        }
      },
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
    
    // Instead of throwing 500, stream the error back so the user sees what went wrong in the chat window.
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
