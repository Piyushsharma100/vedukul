import { editProfileSchema } from './profile.schema';

describe('editProfileSchema', () => {
  it('should validate valid profile data', () => {
    const validData = {
      name: 'Piyush Sharma',
      phoneNumber: '9876543210',
      bio: 'Mobile App Architect',
    };

    const result = editProfileSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject name shorter than 2 characters', () => {
    const invalidData = {
      name: 'A',
    };

    const result = editProfileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Name must be at least 2 characters');
    }
  });

  it('should reject invalid phone number format', () => {
    const invalidData = {
      name: 'Piyush',
      phoneNumber: '12345',
    };

    const result = editProfileSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Please enter a valid 10-digit mobile number');
    }
  });

  it('should allow optional phone number and bio to be empty', () => {
    const data = {
      name: 'Piyush',
      phoneNumber: '',
      bio: '',
    };

    const result = editProfileSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

