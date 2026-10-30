import { envSchema, validateEnv } from './env';

describe('validateEnv', () => {
  it('should validate and return default environment variables when empty', () => {
    const parsed = validateEnv({});
    expect(parsed.EXPO_PUBLIC_API_URL).toBe('https://api.vedukul.com/v1');
    expect(parsed.NODE_ENV).toBe('development');
    expect(parsed.EXPO_PUBLIC_APP_ENV).toBe('development');
  });

  it('should accept valid custom values', () => {
    const custom = {
      EXPO_PUBLIC_API_URL: 'https://staging.api.vedukul.com/v1',
      NODE_ENV: 'production',
      EXPO_PUBLIC_APP_ENV: 'staging',
    };
    const parsed = validateEnv(custom);
    expect(parsed.EXPO_PUBLIC_API_URL).toBe('https://staging.api.vedukul.com/v1');
    expect(parsed.EXPO_PUBLIC_APP_ENV).toBe('staging');
  });

  it('should throw an error on invalid URL', () => {
    const invalid = {
      EXPO_PUBLIC_API_URL: 'not-a-valid-url',
    };
    expect(() => validateEnv(invalid)).toThrow('Environment validation failed');
  });
});

