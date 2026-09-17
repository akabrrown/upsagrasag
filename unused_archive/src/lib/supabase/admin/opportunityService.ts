import { z } from 'zod';

export const opportunitySchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  company: z.string().min(1),
  type: z.enum(['Full-time', 'Contract', 'Internship', 'Part-time', 'Temporary']),
  category: z.string().min(1)
});

export type Opportunity = z.infer<typeof opportunitySchema>;
