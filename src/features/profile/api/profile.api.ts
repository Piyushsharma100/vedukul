import { httpClient } from '@/core';
import { UserProfile } from '../types/profile.types';
import { EditProfileFormData } from '../schemas/profile.schema';

export const profileApi = {
  getProfile: async (): Promise<UserProfile> => {
    return httpClient.get<UserProfile>('/profile/me');
  },

  updateProfile: async (data: EditProfileFormData): Promise<UserProfile> => {
    return httpClient.put<UserProfile>('/profile/me', data);
  },
};

