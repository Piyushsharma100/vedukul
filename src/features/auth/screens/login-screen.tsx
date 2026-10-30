import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper, colors, spacing, typography } from '@/ui';
import { LoginForm } from '../components/login-form';
import { useLogin } from '../hooks/use-login';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login, isLoading, error } = useLogin();

  const handleLogin = async (data: { email: string; password: string }) => {
    const success = await login(data);
    if (success) {
      router.replace('/');
    }
  };

  return (
    <ScreenWrapper scrollable contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account to continue</Text>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

      <View style={styles.footerLinks}>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/forgot-password')}
          accessibilityRole="button"
        >
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.signUpRow}>
          <Text style={styles.captionText}>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/sign-up')}
            accessibilityRole="button"
          >
            <Text style={[styles.linkText, styles.boldLink]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  footerLinks: {
    marginTop: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  signUpRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  linkText: {
    ...typography.bodySmall,
    color: colors.primary[600],
    fontWeight: '500',
  },
  boldLink: {
    fontWeight: '700',
  },
});

