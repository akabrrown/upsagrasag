-- Migration: enable public read access to programs
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON programs
  FOR SELECT
  USING (true);
