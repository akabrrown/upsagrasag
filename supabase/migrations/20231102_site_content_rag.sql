/* Migration: Setup pgvector and site_content table for RAG */

-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Drop existing table if the schema is old
drop table if exists site_content cascade;

-- Create a table to store the website content and its embeddings
create table site_content (
  id bigserial primary key,
  url text not null,
  chunk text not null,
  embedding vector(768),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a function to similarity search for relevant content
create or replace function match_site_content (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  url text,
  chunk text,
  similarity float
)
language sql stable
as $$
  select
    site_content.id,
    site_content.url,
    site_content.chunk,
    1 - (site_content.embedding <=> query_embedding) as similarity
  from site_content
  where 1 - (site_content.embedding <=> query_embedding) > match_threshold
  order by site_content.embedding <=> query_embedding
  limit match_count;
$$;
