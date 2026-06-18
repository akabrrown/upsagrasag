import { z } from "zod";

export const adminUserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email("Invalid email address"),
  role: z.string().default("admin"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type AdminUser = z.infer<typeof adminUserSchema>;

export const presidentSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  speech: z.string().min(1, "Speech is required"),
  image_url: z.string().min(1, "Image is required").url("Must be a valid URL"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type President = z.infer<typeof presidentSchema>;

export const congressSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  event_date: z.string().min(1, "Date is required"),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type CongressEvent = z.infer<typeof congressSchema>;

export const partnerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  logo_url: z.string().min(1, "Logo is required").url("Must be a valid URL"),
  display_order: z.number().int().nonnegative().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Partner = z.infer<typeof partnerSchema>;

export const constitutionSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  file_url: z.string().min(1, "File is required").url("Must be a valid URL"),
  version: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type ConstitutionFile = z.infer<typeof constitutionSchema>;

export const leadershipSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  type: z.enum(["patron", "authority"]),
  bio: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  display_order: z.number().int().nonnegative().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Leadership = z.infer<typeof leadershipSchema>;

export const executiveSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().optional(),
  photo_url: z.string().min(1, "Photo is required").url("Must be a valid URL"),
  display_order: z.number().int().nonnegative().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Executive = z.infer<typeof executiveSchema>;

export const opportunitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  type: z.string().min(1, "Type is required"),
  category: z.string().min(1, "Category is required"),
  apply_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Opportunity = z.infer<typeof opportunitySchema>;

export const resourceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  file_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  link_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Resource = z.infer<typeof resourceSchema>;

export const pastQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  course_code: z.string().min(1, "Course code is required"),
  course_title: z.string().min(1, "Course title is required"),
  year: z.string().min(1, "Year is required"),
  file_url: z.string().min(1, "File is required").url("Must be a valid URL"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type PastQuestion = z.infer<typeof pastQuestionSchema>;

export const tutorialSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  video_url: z.string().min(1, "Video URL is required").url("Must be a valid URL"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type Tutorial = z.infer<typeof tutorialSchema>;

export const eventProgrammeSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  event_date: z.string().min(1, "Date is required"),
  location: z.string().optional(),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type EventProgramme = z.infer<typeof eventProgrammeSchema>;

export const researchOpportunitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  sub_type: z.enum(["scholarships", "calls", "publications", "careers"]),
  link_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  deadline: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type ResearchOpportunity = z.infer<typeof researchOpportunitySchema>;

export const newsUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.enum(["notices", "press", "reports", "accountability", "gallery"]),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  published_at: z.string().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type NewsUpdate = z.infer<typeof newsUpdateSchema>;

export const platformSettingsSchema = z.object({
  id: z.string().uuid().optional(),
  maintenance_mode: z.boolean().default(false),
  updated_at: z.string().optional(),
});
export type PlatformSettings = z.infer<typeof platformSettingsSchema>;
