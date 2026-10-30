import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '@/test-utils';
import { LoginForm } from './login-form';

describe('LoginForm', () => {
  it('should render email and password inputs and submit button', async () => {
    const { getByTestId } = await renderWithProviders(
      <LoginForm onSubmit={jest.fn()} />
    );

    expect(getByTestId('login-email-input')).toBeTruthy();
    expect(getByTestId('login-password-input')).toBeTruthy();
    expect(getByTestId('login-submit-button')).toBeTruthy();
  });

  it('should show validation errors when submitted empty', async () => {
    const onSubmitMock = jest.fn();
    const { getByTestId, findByText } = await renderWithProviders(
      <LoginForm onSubmit={onSubmitMock} />
    );

    await act(async () => {
      fireEvent.press(getByTestId('login-submit-button'));
    });

    expect(await findByText('Email is required')).toBeTruthy();
    expect(await findByText('Password must be at least 6 characters')).toBeTruthy();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('should call onSubmit with valid credentials', async () => {
    const onSubmitMock = jest.fn().mockResolvedValue(true);
    const { getByTestId } = await renderWithProviders(
      <LoginForm onSubmit={onSubmitMock} />
    );

    await act(async () => {
      fireEvent.changeText(getByTestId('login-email-input'), 'admin@vedukul.com');
      fireEvent.changeText(getByTestId('login-password-input'), 'secret123');
    });

    await act(async () => {
      fireEvent.press(getByTestId('login-submit-button'));
    });

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith({
        email: 'admin@vedukul.com',
        password: 'secret123',
      });
    });
  });
});
