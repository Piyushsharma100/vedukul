import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const initialMetrics = {
  frame: { x: 0, y: 0, width: 375, height: 812 },
  insets: { top: 44, left: 0, right: 0, bottom: 34 },
};

export async function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <SafeAreaProvider initialMetrics={initialMetrics}>
        {children}
      </SafeAreaProvider>
    );
  };

  return await render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react-native';
