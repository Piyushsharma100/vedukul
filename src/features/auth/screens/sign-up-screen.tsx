import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Button, Input, ScreenWrapper, colors, spacing, typography } from '@/ui';
import { signUpSchema } from '../schemas/sign-up.schema';
import { authApi } from '../api/auth.api';
import { sessionManager } from '@/core';

export const SignUpScreen: React.FC = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSignUp = async () => {
    setErrors({});
    setServerError(null);

    const validation = signUpSchema.safeParse({
      name,
      email,
      phoneNumber,
      password,
      confirmPassword,
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

    setIsLoading(true);
    try {
      const response = await authApi.signUp({
        name,
        email,
        phoneNumber: phoneNumber || undefined,
        password,
      });
      await sessionManager.saveSession(response.tokens, response.user);
      router.replace('/');
    } catch (err: any) {
      setServerError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      {serverError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{serverError}</Text>
        </View>
      )}

      <Input
        label="Full Name"
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        error={errors.name}
      />

      <Input
        label="Email Address"
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
      />

      <Input
        label="Phone Number (Optional)"
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        error={errors.phoneNumber}
      />

      <Input
        label="Password"
        placeholder="Minimum 6 characters"
        isPassword
        value={password}
        onChangeText={setPassword}
        error={errors.password}
      />

      <Input
        label="Confirm Password"
        placeholder="Re-enter password"
        isPassword
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
      />

      <Button
        label="Sign Up"
        onPress={handleSignUp}
        isLoading={isLoading}
        style={styles.submitButton}
      />

      <View style={styles.footer}>
        <Text style={styles.captionText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.back()} accessibilityRole="button">
          <Text style={[styles.linkText, styles.boldLink]}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
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
  submitButton: {
    marginTop: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  captionText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  linkText: {
    ...typography.bodySmall,
    color: colors.primary[600],
  },
  boldLink: {
    fontWeight: '700',
  },
});

