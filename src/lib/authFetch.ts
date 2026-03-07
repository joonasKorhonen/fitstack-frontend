import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export async function authFetch(
  url: string,
  router: AppRouterInstance,
  options?: RequestInit
): Promise<Response | null> {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    router.push('/');
    return null;
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    router.push('/');
    return null;
  }

  return res;
}
