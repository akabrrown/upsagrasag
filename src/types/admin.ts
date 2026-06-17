// src/types/admin.ts
import { z } from "zod";

export const executiveSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().optional(),
  photo_url: z.string().url("Must be a valid URL"),
  display_order: z.number().int().nonnegative().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Executive = z.infer<typeof executiveSchema>;

export const opportunitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["internship", "full-time", "contract"]),
  location: z.string().optional(),
  apply_url: z.string().url().optional(),
  image_url: z.string().url().optional(),
  deadline: z.string().optional(),
  is_active: z.boolean().default(true),
  display_order: z.number().int().nonnegative().default(0),
  slug: z.string().min(1, "Slug required").optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Opportunity = z.infer<typeof opportunitySchema>;

export const pastQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  question: z.string().min(1, "Question required"),
  answer: z.string().min(1, "Answer required"),
  display_order: z.number().int().nonnegative().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type PastQuestion = z.infer<typeof pastQuestionSchema>;

export const resourceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  file_url: z.string().url().optional(),
  file_type: z.enum(["pdf", "docx", "pptx", "xlsx"]),
  thumbnail_url: z.string().url().optional(),
  display_order: z.number().int().nonnegative().default(0),
  is_featured: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Resource = z.infer<typeof resourceSchema>;

export const partnerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name required"),
  website_url: z.string().url().optional(),
  logo_url: z.string().url().min(1, "Logo URL required"),
  description: z.string().optional(),
  display_order: z.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Partner = z.infer<typeof partnerSchema>;

export const chatbotLogSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
  session_id: z.string().uuid(),
  message_role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1),
  token_usage: z.record(z.string(), z.any()).optional(),
  created_at: z.string().optional(),
});
export type ChatbotLog = z.infer<typeof chatbotLogSchema>;

export const siteSettingSchema = z.object({
  id: z.string().uuid().optional(),
  key: z.string().min(1),
  value_text: z.string().optional(),
  value_jsonb: z.union([z.object({}).passthrough(), z.array(z.any()), z.string()]).optional(),
  updated_at: z.string().optional(),
});
export type SiteSetting = z.infer<typeof siteSettingSchema>;

export const newsSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title required"),
  slug: z.string().min(1, "Slug required"),
  content: z.any().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type News = z.infer<typeof newsSchema>;

export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title required"),
  description: z.string().optional(),
  startDt: z.string(),
  endDt: z.string(),
  cover_image_url: z.string().optional(),
  featured: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Event = z.infer<typeof eventSchema>;

export type AdminEntity =
  | Executive
  | Opportunity
  | PastQuestion
  | Resource
  | Partner
  | ChatbotLog
  | SiteSetting
  | News
  | Event;

export interface ColumnConfig<T> {
  key: keyof T | string;
  label: string;
}
