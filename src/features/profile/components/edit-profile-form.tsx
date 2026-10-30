import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Input, spacing } from '@/ui';
import { UserProfile } from '../types/profile.types';
import { editProfileSchema, EditProfileFormData } from '../schemas/profile.schema';

export interface EditProfileFormProps {
  initialData: UserProfile;
  onSubmit: (data: EditProfileFormData) => Promise<boolean | void>;
  isLoading?: boolean;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = useState(initialData.name);
  const [phoneNumber, setPhoneNumber] = useState(initialData.phoneNumber || '');
  const [bio, setBio] = useState(initialData.bio || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    setErrors({});
    const validation = editProfileSchema.safeParse({
      name,
      phoneNumber: phoneNumber || undefined,
      bio: bio || undefined,
    });

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (field && typeof field === 'string') {
          fieldErrors[field] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    await onSubmit(validation.data);
  };

  return (
    <View style={styles.container}>
      <Input
        label="Full Name"
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        error={errors.name}
        testID="profile-name-input"
      />

      <Input
        label="Phone Number"
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        error={errors.phoneNumber}
        testID="profile-phone-input"
      />

      <Input
        label="Bio / About Me"
        placeholder="Tell us about yourself"
        multiline
        numberOfLines={3}
        value={bio}
        onChangeText={setBio}
        error={errors.bio}
        testID="profile-bio-input"
      />

      <Button
        label="Save Changes"
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.button}
        testID="profile-save-button"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    marginTop: spacing.sm,
  },
});

