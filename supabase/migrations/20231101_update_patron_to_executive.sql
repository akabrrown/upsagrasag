/* Migration: rename patron type to executive */

-- 1. Drop the old constraint
ALTER TABLE leadership DROP CONSTRAINT IF EXISTS leadership_type_check;

-- 2. Update the existing records from patron to executive
UPDATE leadership
  SET type = 'executive'
  WHERE type = 'patron';

-- 3. Add the new constraint allowing 'executive' (and 'authority')
ALTER TABLE leadership ADD CONSTRAINT leadership_type_check CHECK (type IN ('executive', 'authority'));
