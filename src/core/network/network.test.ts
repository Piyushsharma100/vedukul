import { HttpClient } from './http-client';
import { ApiError, NetworkError, UnauthorizedError } from './error-handler';
import { sessionManager } from '../session/session-manager';

describe('HttpClient', () => {
  let client: HttpClient;
  const mockBaseUrl = 'https://api.test.com';

  beforeEach(() => {
    client = new HttpClient(mockBaseUrl);
    jest.clearAllMocks();
    sessionManager.setAccessToken(null);
  });

  it('should include Authorization header when token is present and requiresAuth is true', async () => {
    sessionManager.setAccessToken('my-secret-token');

    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ success: true }),
    } as any);

    const result = await client.get('/profile');

    expect(result).toEqual({ success: true });
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://api.test.com/profile',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer my-secret-token',
        }),
      })
    );
  });

  it('should throw UnauthorizedError and clear session on 401', async () => {
    sessionManager.setAccessToken('expired-token');
    const clearSessionSpy = jest.spyOn(sessionManager, 'clearSession');

    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Unauthorized' }),
    } as any);

    await expect(client.get('/protected')).rejects.toThrow(UnauthorizedError);
    expect(clearSessionSpy).toHaveBeenCalled();
  });

  it('should throw ApiError with status and message on 400 bad request', async () => {
    globalThis.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      headers: { get: () => 'application/json' },
      json: async () => ({ message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' }),
    } as any);

    await expect(client.post('/auth/login', { email: 'wrong@test.com' })).rejects.toThrow(
      ApiError
    );
  });

  it('should throw NetworkError on network connection failure', async () => {
    globalThis.fetch = jest.fn().mockRejectedValue(new Error('Failed to fetch'));

    await expect(client.get('/health')).rejects.toThrow(NetworkError);
  });
});
