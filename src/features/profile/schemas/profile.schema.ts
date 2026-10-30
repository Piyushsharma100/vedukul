import { z } from 'zod';

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .trim()
    .max(200, 'Bio must be less than 200 characters')
    .optional()
    .or(z.literal('')),
});

export type EditProfileFormData = z.infer<typeof editProfileSchema>;

