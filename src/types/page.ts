// src/types/page.ts
import { z } from "zod";

export const pageSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1, "Slug is required").regex(/^[-a-z0-9]+$/i, "Invalid slug"),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  image_url: z.string().url().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
export type Page = z.infer<typeof pageSchema>;

export const adminUserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email("Invalid email"),
  role: z.enum(["admin"]).default("admin"),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
export type AdminUser = z.infer<typeof adminUserSchema>;
