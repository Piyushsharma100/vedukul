import { env } from '../config/env';
import { sessionManager } from '../session/session-manager';
import { ApiError, NetworkError, UnauthorizedError } from './error-handler';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  requiresAuth?: boolean;
}

export class HttpClient {
  private baseUrl: string;

  constructor(baseUrl: string = env.EXPO_PUBLIC_API_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const {
      body,
      params,
      headers: customHeaders,
      requiresAuth = true,
      ...fetchOptions
    } = options;

    let url = `${this.baseUrl}/${endpoint.replace(/^\//, '')}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined) searchParams.append(key, String(val));
      });
      const queryStr = searchParams.toString();
      if (queryStr) {
        url += (url.includes('?') ? '&' : '?') + queryStr;
      }
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...((customHeaders as Record<string, string>) || {}),
    };

    if (requiresAuth) {
      const token = sessionManager.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    let response: Response;
    try {
      response = await fetch(url, {
        ...fetchOptions,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (networkErr) {
      throw new NetworkError(
        networkErr instanceof Error ? networkErr.message : undefined
      );
    }

    if (response.status === 401) {
      await sessionManager.clearSession();
      throw new UnauthorizedError();
    }

    let responseData: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (responseData && typeof responseData === 'object' && responseData.message) ||
        `HTTP Request failed with status ${response.status}`;
      const code = responseData?.code;
      const errors = responseData?.errors;
      throw new ApiError(response.status, errorMessage, code, errors);
    }

    return responseData as T;
  }

  get<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  post<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  delete<T>(endpoint: string, options?: Omit<RequestOptions, 'method'>): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();

