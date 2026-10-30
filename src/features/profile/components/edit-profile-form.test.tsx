import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react-native';
import { renderWithProviders } from '@/test-utils';
import { EditProfileForm } from './edit-profile-form';

describe('EditProfileForm', () => {
  const mockInitial = {
    id: '1',
    name: 'Piyush Sharma',
    email: 'piyush@vedukul.com',
    phoneNumber: '9876543210',
    bio: 'Mobile Engineer',
  };

  it('should render inputs with initial values', async () => {
    const { getByTestId } = await renderWithProviders(
      <EditProfileForm initialData={mockInitial} onSubmit={jest.fn()} />
    );

    expect(getByTestId('profile-name-input').props.value).toBe('Piyush Sharma');
    expect(getByTestId('profile-phone-input').props.value).toBe('9876543210');
    expect(getByTestId('profile-bio-input').props.value).toBe('Mobile Engineer');
  });

  it('should show error when name is shorter than 2 characters', async () => {
    const onSubmitMock = jest.fn();
    const { getByTestId, findByText } = await renderWithProviders(
      <EditProfileForm initialData={mockInitial} onSubmit={onSubmitMock} />
    );

    await act(async () => {
      fireEvent.changeText(getByTestId('profile-name-input'), 'A');
    });

    await act(async () => {
      fireEvent.press(getByTestId('profile-save-button'));
    });

    expect(await findByText('Name must be at least 2 characters')).toBeTruthy();
    expect(onSubmitMock).not.toHaveBeenCalled();
  });

  it('should submit valid updated data', async () => {
    const onSubmitMock = jest.fn().mockResolvedValue(true);
    const { getByTestId } = await renderWithProviders(
      <EditProfileForm initialData={mockInitial} onSubmit={onSubmitMock} />
    );

    await act(async () => {
      fireEvent.changeText(getByTestId('profile-name-input'), 'Piyush K Sharma');
    });

    await act(async () => {
      fireEvent.press(getByTestId('profile-save-button'));
    });

    await waitFor(() => {
      expect(onSubmitMock).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Piyush K Sharma',
        })
      );
    });
  });
});
