import { z } from "zod";

export const adminContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  slug: z.string().optional(),
});

export const presidentSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  speech: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional(),
  slug: z.string().optional(),
});
// Congress schema is defined later in the file
export const partnerSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  logo_url: z.union([z.literal(''), z.string().url()]).optional(),
  display_order: z.number().int().optional(),
  slug: z.string().optional(),
});
export const constitutionSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  version: z.string().optional(),
  file_url: z.union([z.literal(''), z.string().url()]).optional(),
  created_at: z.string().optional(),
  slug: z.string().optional(),
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
  contactInfo: z.any().optional(),
  slug: z.string().optional(),
});
export const executiveSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  bio: z.string().optional(),
  email: z.union([z.literal(''), z.string().email()]).optional(),
  photo_url: z.union([z.literal(''), z.string().url()]).optional(),
  display_order: z.number().int().default(0),
  slug: z.string().optional(),
});
export const opportunitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  type: z.string().optional().default("Full-time"),
  category: z.string().optional(),
  location: z.string().optional(),
  deadline: z.union([z.literal(''), z.string(), z.null()]).optional().transform(v => (v === '' ? null : v)),
  start_date: z.union([z.literal(''), z.string(), z.null()]).optional().transform(v => (v === '' ? null : v)),
  end_date: z.union([z.literal(''), z.string(), z.null()]).optional().transform(v => (v === '' ? null : v)),
  description: z.string().optional(),
  apply_url: z.union([z.literal(''), z.string().url()]).optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional()
});
export const resourceSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  file_url: z.union([z.literal(''), z.string().url()]).optional(),
  link_url: z.union([z.literal(''), z.string().url()]).optional(),
  slug: z.string().optional(),
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
  created_at: z.string().optional(),
  slug: z.string().optional(),
});
export const tutorialSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  video_url: z.union([z.literal(''), z.string().url()]).optional()
});
export const eventProgrammeSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  start_time: z.string().optional(),
  end_date: z.union([z.literal(''), z.string()]).nullish(),
  end_time: z.string().optional(),
  location: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional(),
  url: z.union([z.literal(''), z.string().url()]).optional(),
  is_featured: z.boolean().optional().default(false),
  type: z.enum(['Event', 'Programme', 'Congress']).optional().default('Event'),
  display_on_page: z.boolean().optional().default(true),
  theme: z.string().optional(),
  price: z.string().optional(),
  discount_code: z.string().optional(),
  discount_info: z.string().optional(),
  registration_deadline: z.string().optional(),
  speaker: z.string().optional(),
  slug: z.string().optional()
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

export const newsUpdateSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  category: z.enum(["news","articles","announcements","press","grasag-updates","events-recaps","student-stories"]).optional(),
  slug: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional(),
  published_at: z.string().optional(),
  created_at: z.string().optional()
});

export const eventSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  category: z.enum(['Academic','Career','Networking','Welfare','Social','Leadership','Conference','Other']),
  summary: z.string().min(1, "Summary is required"),
  full_description: z.string().optional(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime().optional(),
  time_label: z.string().optional(),
  location: z.string().optional(),
  price: z.string().optional(),
  discount_code: z.string().optional(),
  discount_info: z.string().optional(),
  registration_deadline: z.string().optional(),
  image_url: z.string().url().optional(),
  url: z.string().url().optional(),
  is_featured: z.boolean().optional(),
  display_order: z.number().int().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
export type Event = z.infer<typeof eventSchema>;



// Duplicate leadershipSchema removed
export const pageContentSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1, "Slug is required"),
  title: z.string().optional(),
  body: z.string().optional(),
  cta_text: z.string().optional(),
  cta_link: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional(),
});
export type PageContent = z.infer<typeof pageContentSchema>;

export type President = z.infer<typeof presidentSchema>;
export type Program = z.infer<typeof programSchema>;
export type PastQuestion = z.infer<typeof pastQuestionSchema>;
export type Partner = z.infer<typeof partnerSchema>;
export type Constitution = z.infer<typeof constitutionSchema>;
export type Leadership = z.infer<typeof leadershipSchema>;
export type Executive = z.infer<typeof executiveSchema>;
export type Opportunity = z.infer<typeof opportunitySchema>;

export type Resource = z.infer<typeof resourceSchema>;
export type WelfareService = {
  id: string;
  title: string;
  description: string;
  action_text: string;
  href: string;
  icon_name: string;
  display_order: number;
  created_at?: string;
  updated_at?: string;
};

export interface PresidentRecord {
  id: string;
  name: string;
  image_url: string;
  term: string;
  order_index?: number;
  created_at?: string;
  is_active?: boolean;
}

export interface AcademicCalendarRecord {
  id: string;
  title: string;
  event_date: string;
  description?: string;
  created_at?: string;
};

export const welfareStepSchema = z.object({
  id: z.string().uuid().optional(),
  step_number: z.number().int(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  display_order: z.number().int().default(0),
});
export type WelfareStep = z.infer<typeof welfareStepSchema>;

export const focusAreaSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional(),
  icon_name: z.string().optional(),
  display_order: z.number().int().default(0),
});
export type FocusArea = z.infer<typeof focusAreaSchema>;

export const objectiveSchema = z.object({
  id: z.string().uuid().optional(),
  description: z.string().min(1, "Description is required"),
  display_order: z.number().int().default(0),
});
export type Objective = z.infer<typeof objectiveSchema>;

export const heroSlideSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  cta_text: z.string().optional(),
  cta_link: z.string().optional(),
  image_url: z.union([z.literal(''), z.string().url()]).optional(),
  display_order: z.number().int().default(0),
});
export type HeroSlide = z.infer<typeof heroSlideSchema>;

// duplicate export removed
export type Tutorial = z.infer<typeof tutorialSchema>;
export type EventProgrammeRecord = EventProgramme & { id: string } & { subEvents?: SubEvent[] };

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



export const platformSettingsSchema = z.object({
  id: z.string().uuid().optional(),
  maintenance_mode: z.boolean().default(false),
  contact_email: z.string().optional(),
  contact_phone: z.string().optional(),
  contact_address: z.string().optional(),
  created_at: z.string().optional(),
});
export type PlatformSettings = z.infer<typeof platformSettingsSchema>;

export const membershipBenefitSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  display_order: z.number().int().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type MembershipBenefit = z.infer<typeof membershipBenefitSchema>;

export const academicSupportSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  icon: z.string().min(1, "Icon is required"),
  display_order: z.number().int().default(0),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});
export type AcademicSupport = z.infer<typeof academicSupportSchema>;

export const academicProgrammeSchema = z.object({
  id: z.string().uuid().optional(),
  category: z.enum(['LLM', 'MA', 'MSc', 'MBA', 'MPhil']),
  name: z.string().min(1, "Name is required"),
  display_order: z.number().int().default(0),
  created_at: z.string().optional(),
});
export type AcademicProgramme = z.infer<typeof academicProgrammeSchema>;
