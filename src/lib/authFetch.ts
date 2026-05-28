import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { tokenStore, refreshAccessToken } from './tokenStore';

async function performFetch(url: string, token: string, options?: RequestInit) {
  return fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function authFetch(
  url: string,
  router: AppRouterInstance,
  options?: RequestInit,
): Promise<Response | null> {
  let token = tokenStore.get();
  if (!token) {
    token = await refreshAccessToken();
    if (!token) {
      router.push('/');
      return null;
    }
  }

  let res = await performFetch(url, token, options);

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      tokenStore.clear();
      router.push('/');
      return null;
    }
    res = await performFetch(url, newToken, options);
    if (res.status === 401) {
      tokenStore.clear();
      router.push('/');
      return null;
    }
  }

  return res;
}
