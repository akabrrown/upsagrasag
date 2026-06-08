-- 02_alter_admin_users.sql
-- Migration to change auth_uid from text to uuid
ALTER TABLE public.admin_users
  ALTER COLUMN auth_uid TYPE uuid USING auth_uid::uuid;
