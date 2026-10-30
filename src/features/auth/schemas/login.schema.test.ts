import { loginSchema } from './login.schema';

describe('loginSchema', () => {
  it('should pass validation for valid credentials', () => {
    const validData = {
      email: 'user@vedukul.com',
      password: 'password123',
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation when email is invalid', () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'password123',
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid email address');
    }
  });

  it('should fail validation when password is too short', () => {
    const invalidData = {
      email: 'user@vedukul.com',
      password: '123',
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Password must be at least 6 characters');
    }
  });

  it('should trim email whitespace', () => {
    const dataWithWhitespace = {
      email: '  user@vedukul.com  ',
      password: 'password123',
    };

    const result = loginSchema.safeParse(dataWithWhitespace);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('user@vedukul.com');
    }
  });
});

