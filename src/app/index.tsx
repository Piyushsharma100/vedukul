import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSessionStore, sessionManager } from '@/core';
import { Button, ScreenWrapper, colors, spacing, typography } from '@/ui';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isInitializing, user } = useSessionStore();

  if (isInitializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary[600]} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <ScreenWrapper contentContainerStyle={styles.container}>
        <View style={styles.heroSection}>
          <Text style={styles.brandTitle}>Vedukul</Text>
          <Text style={styles.brandSubtitle}>
            Enterprise-ready mobile platform
          </Text>
        </View>

        <View style={styles.buttonGroup}>
          <Button
            label="Sign In"
            onPress={() => router.push('/(auth)/login')}
            style={styles.actionButton}
          />
          <Button
            label="Create an Account"
            variant="outline"
            onPress={() => router.push('/(auth)/sign-up')}
            style={styles.actionButton}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper contentContainerStyle={styles.container}>
      <View style={styles.heroSection}>
        <Text style={styles.brandTitle}>Welcome, {user?.name || user?.email}!</Text>
        <Text style={styles.brandSubtitle}>
          You are securely authenticated.
        </Text>
      </View>

      <Button
        label="Sign Out"
        variant="outline"
        onPress={() => sessionManager.clearSession()}
        style={styles.actionButton}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.xl,
    justifyContent: 'space-between',
    paddingVertical: spacing.xxl,
  },
  heroSection: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
  brandTitle: {
    ...typography.h1,
    fontSize: 32,
    color: colors.primary[700],
    textAlign: 'center',
  },
  brandSubtitle: {
    ...typography.body,
    color: colors.neutral[600],
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  buttonGroup: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    width: '100%',
  },
});
