import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { sessionManager } from '@/core';

export default function RootLayout() {
  useEffect(() => {
    sessionManager.initSession();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}
