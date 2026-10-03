import { z } from 'zod';

// Executives
export const ExecutiveSchema = z.object({
  name: z.string().min(1, { message: 'Name required' }),
  title: z.string().min(1, { message: 'Title required' }),
  bio: z.string().optional(),
  photoUrl: z.string().url({ message: 'Valid Cloudinary URL required' }),
  displayOrder: z.number().int().nonnegative(),
});

// Opportunities
export const OpportunitySchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.enum(['internship', 'full-time', 'contract']),
  location: z.string().optional(),
  applyUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  deadline: z.string().optional().refine(val => !val || !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().nonnegative(),
  slug: z.string().optional(),
});

// Past Questions
export const PastQuestionSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  displayOrder: z.number().int().nonnegative(),
});

// Resources
export const ResourceSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  fileType: z.enum(['pdf', 'docx', 'pptx', 'xlsx']),
  thumbnailUrl: z.string().url().optional(),
  displayOrder: z.number().int().nonnegative(),
  isFeatured: z.boolean().default(false),
});

// Partners
export const PartnerSchema = z.object({
  name: z.string().min(1),
  websiteUrl: z.string().url().optional(),
  logoUrl: z.string().url(),
  description: z.string().optional(),
  displayOrder: z.number().int().nonnegative(),
  isActive: z.boolean().default(true),
});

// Chatbot Logs (admin only, no client create)
export const ChatbotLogSchema = z.object({
  sessionId: z.string().uuid(),
  messageRole: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1),
  tokenUsage: z.record(z.string(), z.number()).optional(),
});

// Site Settings
export const SiteSettingSchema = z.object({
  key: z.string().min(1),
  valueText: z.string().optional(),
  valueJsonb: z.object({}).passthrough().optional(),
});
