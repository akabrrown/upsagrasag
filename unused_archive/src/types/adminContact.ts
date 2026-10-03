import { z } from "zod";

export const adminContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().min(1, "Role is required"),
  message: z.string().optional(),
});

export type AdminContact = z.infer<typeof adminContactSchema>;
