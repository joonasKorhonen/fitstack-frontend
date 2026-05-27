import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { authFetch } from './authFetch';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export class UnauthenticatedError extends Error {
  constructor() {
    super('Unauthenticated');
    this.name = 'UnauthenticatedError';
  }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  router: AppRouterInstance,
  options?: RequestInit,
): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const res = await authFetch(url, router, options);
  if (!res) throw new UnauthenticatedError();

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message = body.message || body.error || `Request failed: ${res.status}`;
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}
