import { z } from 'zod';

export const memberSchema = z.object({
  first_name: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  last_name: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z.string()
    .email('Invalid email format'),
  phone: z.string()
    .optional(),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
});

export type MemberValidationSchema = z.infer<typeof memberSchema>;