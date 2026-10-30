import { z } from 'zod';

export const otpSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'Verification code must be 6 digits')
    .regex(/^\d+$/, 'Verification code must contain only numbers'),
});

export type OtpFormData = z.infer<typeof otpSchema>;

