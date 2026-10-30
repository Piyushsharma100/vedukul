import { z } from 'zod';

export const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z
    .string()
    .url()
    .default('https://api.vedukul.com/v1'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  EXPO_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
});

export type AppEnv = z.infer<typeof envSchema>;

export function validateEnv(rawEnv: Record<string, unknown> = process.env): AppEnv {
  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    const formattedErrors = result.error.issues
      .map((issue) => ` - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');
    console.error(`❌ Invalid environment configuration:\n${formattedErrors}`);
    throw new Error(`Environment validation failed:\n${formattedErrors}`);
  }
  return result.data;
}

export const env = validateEnv(process.env);

