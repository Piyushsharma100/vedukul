import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, colors, spacing, typography } from '@/ui';
import { useProfile } from '../hooks/use-profile';
import { ProfileHeader } from '../components/profile-header';
import { EditProfileForm } from '../components/edit-profile-form';
import { EditProfileFormData } from '../schemas/profile.schema';

export const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const { profile, isUpdating, updateProfile } = useProfile();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSave = async (data: EditProfileFormData) => {
    setSuccessMessage(null);
    const success = await updateProfile(data);
    if (success) {
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>My Profile</Text>
        <View style={styles.placeholder} />
      </View>

      {successMessage && (
        <View style={styles.successBox}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      )}

      {profile && (
        <>
          <ProfileHeader profile={profile} />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Edit Information</Text>
            <EditProfileForm
              initialData={profile}
              onSubmit={handleSave}
              isLoading={isUpdating}
            />
          </View>
        </>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingRight: spacing.sm,
  },
  backText: {
    ...typography.body,
    color: colors.primary[600],
    fontWeight: '600',
  },
  screenTitle: {
    ...typography.h3,
    color: colors.text,
  },
  placeholder: {
    width: 48,
  },
  successBox: {
    backgroundColor: colors.primary[50],
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary[100],
  },
  successText: {
    ...typography.bodySmall,
    color: colors.primary[700],
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.md,
  },
});

