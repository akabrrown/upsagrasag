-- 05_mba_courses.sql
CREATE TABLE IF NOT EXISTS mba_courses (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO mba_courses (name) VALUES
  ('Master of Arts in Peace, Security and Intelligence Management'),
  ('Master of Arts in Brands and Communications Management'),
  ('Master of Arts in Digital and Strategic Marketing Management'),
  ('Master of Arts in Media & Digital Communication Management'),
  ('Master of Philosophy in Media & Digital Communication Management'),
  ('Master of Philosophy in Information Systems'),
  ('Master of Philosophy in Leadership'),
  ('Master of Philosophy in Management'),
  ('Master of Philosophy in Finance'),
  ('Master of Philosophy in Accounting'),
  ('Master of Philosophy in Marketing'),
  ('Master of Philosophy in Applied Statistics'),
  ('Master of Laws in Competition and Consumer Protection Law'),
  ('Master of Laws in International Business and Commercial Law'),
  ('Master of Laws in Natural Resources and Climate Change Law'),
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
  ('Master of Business Administration in Human Resource Management')
ON CONFLICT (name) DO NOTHING;
