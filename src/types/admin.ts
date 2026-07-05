import { z } from "zod";

export const adminContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
});

export const presidentSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  speech: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional()
});
// Congress schema is defined later in the file
export const partnerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  logo_url: z.union([z.literal(''), z.string().url()]).optional(),
  display_order: z.number().int().optional()
});
export const constitutionSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  version: z.string().optional(),
  file_url: z.union([z.literal(''), z.string().url()]).optional(),
  created_at: z.string().optional(),
});
export const leadershipSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  email: z.string().email("Invalid email address").optional(),
  phone: z.string().optional(),
  type: z.enum(["executive","advisor","authority","patron"]).default("executive"),
  bio: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional(),
  display_order: z.number().int().min(0).optional(),
  contactInfo: z.any().optional()
});
export const executiveSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().optional(),
  photo_url: z.union([z.literal(''), z.string().url()]).optional(),
  display_order: z.number().int().default(0)
});
export const opportunitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  type: z.enum(["Full-time","Part-time","Internship","Contract"]).optional().default("Full-time"),
  category: z.string().optional(),
  location: z.string().optional(),
  deadline: z.string().optional(),
  description: z.string().optional(),
  apply_url: z.union([z.literal(''), z.string().url()]).optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional()
});
export const resourceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  file_url: z.union([z.literal(''), z.string().url()]).optional(),
  link_url: z.union([z.literal(''), z.string().url()]).optional()
});
export const programSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required")
});

export const pastQuestionSchema = z.object({
  id: z.string().uuid().optional(),
  programSlug: z.string().min(1, "Program is required"),
  course_code: z.string().min(1, "Course code is required"),
  course_title: z.string().min(1, "Course title is required"),
  year: z.string().min(1, "Year is required"),
  title: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(["exam", "assignment"]).optional(),
  exam_date: z.string().optional(),
  file_url: z.union([z.literal(''), z.string().url()]).optional(),
  created_at: z.string().optional()
});
export const tutorialSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  video_url: z.union([z.literal(''), z.string().url()]).optional()
});
export const eventProgrammeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  event_date: z.string().min(1, "Event date is required"),
  location: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional(),
  url: z.union([z.literal(''), z.string().url()]).optional(),
  is_featured: z.boolean().optional().default(false)
});

// Sub‑event schema
export const subEventSchema = z.object({
  id: z.string().uuid().optional(),
  event_id: z.string().uuid(),
  title: z.string().min(1, "Sub‑event title is required"),
  start_at: z.string().min(1, "Start time is required"),
  end_at: z.string().optional(),
  description: z.string().optional()
});

export type SubEvent = z.infer<typeof subEventSchema>;

export type EventProgramme = z.infer<typeof eventProgrammeSchema>;
export const researchOpportunitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  sub_type: z.enum(["scholarships", "calls", "publications", "careers"]).optional(),
  link_url: z.union([z.literal(''), z.string().url()]).optional(),
  deadline: z.string().optional()
});
export const newsUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  category: z.enum(["news","articles","announcements","press"]).optional(),
  slug: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional(),
  published_at: z.string().optional(),
  created_at: z.string().optional()
});

export type President = z.infer<typeof presidentSchema>;
export type Program = z.infer<typeof programSchema>;
export type PastQuestion = z.infer<typeof pastQuestionSchema>;
export type Partner = z.infer<typeof partnerSchema>;
export type Constitution = z.infer<typeof constitutionSchema>;
export type Leadership = z.infer<typeof leadershipSchema>;
export type Executive = z.infer<typeof executiveSchema>;
export type Opportunity = z.infer<typeof opportunitySchema>;
export type Congress = z.infer<typeof congressSchema>;
export type Resource = z.infer<typeof resourceSchema>;
// duplicate export removed
export type Tutorial = z.infer<typeof tutorialSchema>;
export type EventProgrammeRecord = EventProgramme & { id: string } & { subEvents?: SubEvent[] };
export type ResearchOpportunity = z.infer<typeof researchOpportunitySchema>;
export type NewsUpdate = z.infer<typeof newsUpdateSchema>;

export const adminUserSchema = z.object({
  id: z.string().uuid().optional(),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
  must_change_password: z.boolean().default(false).optional(),
  created_at: z.string().optional(),
});
export type AdminUser = z.infer<typeof adminUserSchema>;
export type ConstitutionFile = z.infer<typeof constitutionSchema>;

export const congressSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  event_date: z.string().min(1, "Event date is required"),
  location: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional(),
  url: z.union([z.literal(''), z.string().url()]).optional(),
  is_featured: z.boolean().default(false),
  created_at: z.string().optional()
});
export type CongressEvent = z.infer<typeof congressSchema>;

export const platformSettingsSchema = z.object({
  id: z.string().uuid().optional(),
  maintenance_mode: z.boolean().default(false),
  created_at: z.string().optional(),
});
export type PlatformSettings = z.infer<typeof platformSettingsSchema>;


