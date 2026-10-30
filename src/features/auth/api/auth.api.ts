import { httpClient } from '@/core';
import { AuthResponse } from '../types/auth.types';
import { LoginFormData } from '../schemas/login.schema';
import { SignUpFormData } from '../schemas/sign-up.schema';

export const authApi = {
  login: async (credentials: LoginFormData): Promise<AuthResponse> => {
    return httpClient.post<AuthResponse>('/auth/login', credentials, {
      requiresAuth: false,
    });
  },

  signUp: async (data: Omit<SignUpFormData, 'confirmPassword'>): Promise<AuthResponse> => {
    return httpClient.post<AuthResponse>('/auth/register', data, {
      requiresAuth: false,
    });
  },

  verifyOtp: async (data: { emailOrPhone: string; otp: string }): Promise<AuthResponse> => {
    return httpClient.post<AuthResponse>('/auth/verify-otp', data, {
      requiresAuth: false,
    });
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    return httpClient.post<{ message: string }>(
      '/auth/forgot-password',
      { email },
      { requiresAuth: false }
    );
  },

  resetPassword: async (data: { token: string; newPassword: string }): Promise<{ message: string }> => {
    return httpClient.post<{ message: string }>(
      '/auth/reset-password',
      data,
      { requiresAuth: false }
    );
  },
};

