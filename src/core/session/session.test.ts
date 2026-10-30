import { SessionManager } from './session-manager';
import { useSessionStore } from './session-store';
import { IStorage } from '../storage/storage.interface';

class MockStorage implements IStorage {
  private data = new Map<string, string>();

  async getItem(key: string): Promise<string | null> {
    return this.data.get(key) ?? null;
  }
  async setItem(key: string, value: string): Promise<void> {
    this.data.set(key, value);
  }
  async removeItem(key: string): Promise<void> {
    this.data.delete(key);
  }
}

describe('SessionManager', () => {
  let mockStorage: MockStorage;
  let manager: SessionManager;

  beforeEach(() => {
    mockStorage = new MockStorage();
    manager = new SessionManager(mockStorage);
    useSessionStore.getState().clearSession();
  });

  it('should save session, cache access token in memory, and update session store', async () => {
    const tokens = { accessToken: 'token_123', refreshToken: 'refresh_456' };
    const user = { id: 'u1', email: 'test@vedukul.com' };

    await manager.saveSession(tokens, user);

    expect(manager.getAccessToken()).toBe('token_123');
    expect(await mockStorage.getItem('auth_access_token')).toBe('token_123');
    expect(await mockStorage.getItem('auth_refresh_token')).toBe('refresh_456');

    const storeState = useSessionStore.getState();
    expect(storeState.isAuthenticated).toBe(true);
    expect(storeState.user).toEqual(user);
  });

  it('should restore session from storage on initSession', async () => {
    const user = { id: 'u2', email: 'restored@vedukul.com' };
    await mockStorage.setItem('auth_access_token', 'token_saved');
    await mockStorage.setItem('auth_refresh_token', 'refresh_saved');
    await mockStorage.setItem('auth_user_data', JSON.stringify(user));

    const restored = await manager.initSession();

    expect(restored).toBe(true);
    expect(manager.getAccessToken()).toBe('token_saved');
    expect(useSessionStore.getState().isAuthenticated).toBe(true);
    expect(useSessionStore.getState().user).toEqual(user);
  });

  it('should clear in-memory token, storage, and store on clearSession', async () => {
    await manager.saveSession(
      { accessToken: 'token_123', refreshToken: 'refresh_456' },
      { id: 'u1', email: 'test@vedukul.com' }
    );

    await manager.clearSession();

    expect(manager.getAccessToken()).toBeNull();
    expect(await mockStorage.getItem('auth_access_token')).toBeNull();
    expect(useSessionStore.getState().isAuthenticated).toBe(false);
    expect(useSessionStore.getState().user).toBeNull();
  });
});

