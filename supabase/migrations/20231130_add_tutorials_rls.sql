-- Migration: enable public read access to tutorials
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON tutorials
  FOR SELECT
  USING (true);
