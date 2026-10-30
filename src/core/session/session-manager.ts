import { secureStorage } from '../storage/secure-storage';
import { IStorage } from '../storage/storage.interface';
import { useSessionStore } from './session-store';
import { AuthTokens, SessionUser } from './session.types';

const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const USER_KEY = 'auth_user_data';

export class SessionManager {
  private inMemoryAccessToken: string | null = null;
  private storage: IStorage;

  constructor(storage: IStorage = secureStorage) {
    this.storage = storage;
  }

  getAccessToken(): string | null {
    return this.inMemoryAccessToken;
  }

  setAccessToken(token: string | null): void {
    this.inMemoryAccessToken = token;
  }

  async initSession(): Promise<boolean> {
    try {
      const [accessToken, refreshToken, userJson] = await Promise.all([
        this.storage.getItem(ACCESS_TOKEN_KEY),
        this.storage.getItem(REFRESH_TOKEN_KEY),
        this.storage.getItem(USER_KEY),
      ]);

      if (accessToken && userJson) {
        this.inMemoryAccessToken = accessToken;
        const user: SessionUser = JSON.parse(userJson);
        useSessionStore.getState().setSession(user);
        return true;
      }

      this.clearSession();
      return false;
    } catch (error) {
      console.warn('[SessionManager] Failed to restore session:', error);
      await this.clearSession();
      return false;
    } finally {
      useSessionStore.getState().setInitializing(false);
    }
  }

  async saveSession(tokens: AuthTokens, user: SessionUser): Promise<void> {
    this.inMemoryAccessToken = tokens.accessToken;

    await Promise.all([
      this.storage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken),
      this.storage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken),
      this.storage.setItem(USER_KEY, JSON.stringify(user)),
    ]);

    useSessionStore.getState().setSession(user);
  }

  async getRefreshToken(): Promise<string | null> {
    return this.storage.getItem(REFRESH_TOKEN_KEY);
  }

  async clearSession(): Promise<void> {
    this.inMemoryAccessToken = null;

    await Promise.all([
      this.storage.removeItem(ACCESS_TOKEN_KEY),
      this.storage.removeItem(REFRESH_TOKEN_KEY),
      this.storage.removeItem(USER_KEY),
    ]);

    useSessionStore.getState().clearSession();
  }
}

export const sessionManager = new SessionManager();

