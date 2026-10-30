import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button, Input, ScreenWrapper, colors, spacing, typography } from '@/ui';
import { otpSchema } from '../schemas/otp.schema';
import { authApi } from '../api/auth.api';
import { sessionManager } from '@/core';

export const OtpScreen: React.FC = () => {
  const router = useRouter();
  const { identifier } = useLocalSearchParams<{ identifier?: string }>();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    setError(null);
    const validation = otpSchema.safeParse({ otp });

    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Invalid OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.verifyOtp({
        emailOrPhone: identifier || '',
        otp,
      });
      await sessionManager.saveSession(response.tokens, response.user);
      router.replace('/');
    } catch (err: any) {
      setError(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to {identifier || 'your account'}
        </Text>
      </View>

      <Input
        label="OTP Code"
        placeholder="Enter 6-digit code"
        keyboardType="number-pad"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
        error={error || undefined}
      />

      <Button
        label="Verify & Continue"
        onPress={handleVerify}
        isLoading={isLoading}
        style={styles.button}
      />

      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        accessibilityRole="button"
      >
        <Text style={styles.backText}>Back to Sign In</Text>
      </TouchableOpacity>
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
    marginTop: spacing.md,
  },
  backButton: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  backText: {
    ...typography.bodySmall,
    color: colors.neutral[600],
  },
});

