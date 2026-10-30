import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { z } from 'zod';
import { Button, Input, ScreenWrapper, colors, spacing, typography } from '@/ui';
import { authApi } from '../api/auth.api';

const setPasswordSchema = z
  .object({
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const SetPasswordScreen: React.FC = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setErrors({});
    setServerError(null);

    const validation = setPasswordSchema.safeParse({ password, confirmPassword });
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

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        token: token || '',
        newPassword: password,
      });
      router.replace('/(auth)/login');
    } catch (err: any) {
      setServerError(err.message || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Set New Password</Text>
        <Text style={styles.subtitle}>Create a strong new password for your account</Text>
      </View>

      {serverError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{serverError}</Text>
        </View>
      )}

      <Input
        label="New Password"
        placeholder="Minimum 6 characters"
        isPassword
        value={password}
        onChangeText={setPassword}
        error={errors.password}
      />

      <Input
        label="Confirm New Password"
        placeholder="Re-enter password"
        isPassword
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
      />

      <Button
        label="Save Password"
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.button}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  errorBox: {
    backgroundColor: colors.feedback.errorLight,
    padding: spacing.md,
    borderRadius: spacing.radius.md,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.feedback.error,
  },
  button: {
    marginTop: spacing.md,
  },
});

