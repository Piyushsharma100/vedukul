export interface SessionUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  phoneNumber?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

