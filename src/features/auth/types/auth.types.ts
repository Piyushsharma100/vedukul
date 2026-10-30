import { SessionUser, AuthTokens } from '@/core';

export interface AuthResponse {
  tokens: AuthTokens;
  user: SessionUser;
}

export interface RequestOtpResponse {
  message: string;
  expiresInSeconds: number;
}

