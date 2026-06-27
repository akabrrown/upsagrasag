/*
  Migration: Drop unnecessary columns from opportunities table
  Date: 2026-08-02
*/

ALTER TABLE public.opportunities
  DROP COLUMN IF EXISTS type,
  DROP COLUMN IF EXISTS category;
