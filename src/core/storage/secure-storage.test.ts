import { SecureStorage } from './secure-storage';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store', () => ({
  isAvailableAsync: jest.fn().mockResolvedValue(true),
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 1,
}));

describe('SecureStorage', () => {
  let storage: SecureStorage;

  beforeEach(() => {
    jest.clearAllMocks();
    storage = new SecureStorage();
  });

  it('should call SecureStore.setItemAsync when setting an item', async () => {
    (SecureStore.setItemAsync as jest.Mock).mockResolvedValue(undefined);

    await storage.setItem('auth_token', 'test_token_123');

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      'auth_token',
      'test_token_123',
      expect.objectContaining({ keychainAccessible: 1 })
    );
  });

  it('should call SecureStore.getItemAsync when getting an item', async () => {
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('test_token_123');

    const result = await storage.getItem('auth_token');

    expect(result).toBe('test_token_123');
    expect(SecureStore.getItemAsync).toHaveBeenCalledWith('auth_token');
  });

  it('should call SecureStore.deleteItemAsync when removing an item', async () => {
    (SecureStore.deleteItemAsync as jest.Mock).mockResolvedValue(undefined);

    await storage.removeItem('auth_token');

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('auth_token');
  });
});

