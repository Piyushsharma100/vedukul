import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { IStorage } from './storage.interface';

// Fallback in-memory map for platforms without SecureStore (e.g., SSR or tests)
const memoryFallback = new Map<string, string>();

export class SecureStorage implements IStorage {
  private isAvailable: boolean | null = null;

  private async checkAvailability(): Promise<boolean> {
    if (this.isAvailable !== null) return this.isAvailable;
    if (Platform.OS === 'web') {
      this.isAvailable = false;
      return false;
    }
    try {
      this.isAvailable = await SecureStore.isAvailableAsync();
    } catch {
      this.isAvailable = false;
    }
    return this.isAvailable;
  }

  async getItem(key: string): Promise<string | null> {
    const available = await this.checkAvailability();
    if (!available) {
      return memoryFallback.get(key) ?? null;
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn(`[SecureStorage] Error getting key "${key}":`, error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    const available = await this.checkAvailability();
    if (!available) {
      memoryFallback.set(key, value);
      return;
    }
    try {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      console.error(`[SecureStorage] Error setting key "${key}":`, error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    const available = await this.checkAvailability();
    if (!available) {
      memoryFallback.delete(key);
      return;
    }
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn(`[SecureStorage] Error deleting key "${key}":`, error);
    }
  }
}

export const secureStorage = new SecureStorage();

