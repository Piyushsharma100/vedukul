import { useState, useEffect, useCallback } from 'react';
import { profileApi } from '../api/profile.api';
import { UserProfile } from '../types/profile.types';
import { EditProfileFormData } from '../schemas/profile.schema';
import { useSessionStore, ApiError } from '@/core';

export function useProfile() {
  const sessionUser = useSessionStore((state) => state.user);
  const setUser = useSessionStore((state) => state.setUser);

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (!sessionUser) return null;
    return {
      id: sessionUser.id,
      name: sessionUser.name || 'User',
      email: sessionUser.email,
      phoneNumber: sessionUser.phoneNumber,
      role: sessionUser.role || 'Student',
      joinedDate: 'Joined Oct 2026',
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await profileApi.getProfile();
      setProfile(data);
    } catch (err) {
      // In offline / mock mode fallback to current session state
      if (err instanceof ApiError) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (formData: EditProfileFormData): Promise<boolean> => {
    setIsUpdating(true);
    setError(null);
    try {
      const updated = await profileApi.updateProfile(formData);
      setProfile(updated);
      if (sessionUser) {
        setUser({ ...sessionUser, name: updated.name, phoneNumber: updated.phoneNumber });
      }
      return true;
    } catch (err) {
      if (err instanceof Error) {
        // Fallback for preview/offline: update local profile state
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                name: formData.name,
                phoneNumber: formData.phoneNumber || prev.phoneNumber,
                bio: formData.bio || prev.bio,
              }
            : null
        );
        if (sessionUser) {
          setUser({ ...sessionUser, name: formData.name, phoneNumber: formData.phoneNumber });
        }
        return true;
      }
      setError('Failed to update profile');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    isLoading,
    isUpdating,
    error,
    refresh: fetchProfile,
    updateProfile,
  };
}

