'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/apiFetch';
import { endpoints } from '../lib/endpoints';

export type UserProfile = {
  id: string;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
};

export const profileKeys = {
  current: ['profile'] as const,
};

export function useProfile() {
  const router = useRouter();
  return useQuery({
    queryKey: profileKeys.current,
    queryFn: () => apiFetch<UserProfile>(endpoints.users.profile, router),
  });
}

export function useUploadAvatar() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiFetch<UserProfile>(endpoints.users.avatar, router, {
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
      apiFetch<UserProfile>(endpoints.users.avatar, router, { method: 'DELETE' }),
    onSuccess: (updated) => {
      qc.setQueryData(profileKeys.current, updated);
    },
  });
}
