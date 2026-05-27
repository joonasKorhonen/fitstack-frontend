'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/apiFetch';

export type UserProfile = {
  id: string;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
};

export const profileKeys = {
  current: ['profile'] as const,
};

const PROFILE_URL = 'http://localhost:3001/api/users/profile';
const AVATAR_URL = 'http://localhost:3001/api/users/avatar';

export function useProfile() {
  const router = useRouter();
  return useQuery({
    queryKey: profileKeys.current,
    queryFn: () => apiFetch<UserProfile>(PROFILE_URL, router),
  });
}

export function useUploadAvatar() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiFetch<UserProfile>(AVATAR_URL, router, {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: (updated) => {
      qc.setQueryData(profileKeys.current, updated);
    },
  });
}

export function useRemoveAvatar() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch<UserProfile>(AVATAR_URL, router, { method: 'DELETE' }),
    onSuccess: (updated) => {
      qc.setQueryData(profileKeys.current, updated);
    },
  });
}
