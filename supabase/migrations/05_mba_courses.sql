-- 05_mba_courses.sql
CREATE TABLE IF NOT EXISTS mba_courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO mba_courses (name) VALUES
  ('Master of Business Administration in Accounting & Finance'),
  ('Master of Business Administration in Auditing'),
  ('Master of Business Administration in Internal Auditing'),
  ('Master of Business Administration in Corporate Governance'),
  ('Master of Business Administration in Marketing'),
  ('Master of Business Administration in Total Quality Management'),
  ('Master of Business Administration in Corporate Communications'),
  ('Master of Business Administration in Petroleum Accounting & Finance'),
  ('Master of Business Administration in Impact Entrepreneurship and Innovation'),
  ('Master of Business Administration in Business Management'),
  ('Master of Business Administration in Wealth and Asset Management'),
  ('Master of Business Administration in Management Information Systems'),
  ('Master of Business Administration in Human Resource Management');
