import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { Button, Input, ScreenWrapper, colors, spacing, typography } from '@/ui';
import { authApi } from '../api/auth.api';

const emailSchema = z.string().trim().email('Please enter a valid email address');

export const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    const validation = emailSchema.safeParse(email);

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Invalid email');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.requestPasswordReset(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered email to receive password reset instructions
        </Text>
      </View>

      {isSuccess ? (
        <View style={styles.successBox}>
          <Text style={styles.successTitle}>Check your email</Text>
          <Text style={styles.successSubtitle}>
            We have sent password reset instructions to {email}.
          </Text>
          <Button
            label="Back to Sign In"
            onPress={() => router.replace('/(auth)/login')}
            style={styles.backSignInBtn}
          />
        </View>
      ) : (
        <>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            error={error || undefined}
          />

          <Button
            label="Send Reset Link"
            onPress={handleSubmit}
            isLoading={isLoading}
            style={styles.button}
          />

          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityRole="button"
          >
            <Text style={styles.backText}>Cancel and return</Text>
          </TouchableOpacity>
        </>
      )}
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
  button: {
    marginTop: spacing.sm,
  },
  backButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  backText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
  successBox: {
    padding: spacing.lg,
    backgroundColor: colors.primary[50],
    borderRadius: spacing.radius.md,
    alignItems: 'center',
  },
  successTitle: {
    ...typography.h2,
    color: colors.primary[700],
    marginBottom: spacing.xs,
  },
  successSubtitle: {
    ...typography.body,
    color: colors.neutral[700],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  backSignInBtn: {
    width: '100%',
  },
});

