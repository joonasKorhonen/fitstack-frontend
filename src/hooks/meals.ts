'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/apiFetch';
import { endpoints } from '../lib/endpoints';
import { Meal } from '../types/meal';

export const mealKeys = {
  all: ['meals'] as const,
  detail: (id: string | number) => ['meals', String(id)] as const,
};

export type MealInput = {
  title: string;
  calories: number;
  date?: string;
  protein?: number;
  carbs?: number;
  fat?: number;
  notes?: string | null;
};

export function useMeals() {
  const router = useRouter();
  return useQuery({
    queryKey: mealKeys.all,
    queryFn: () => apiFetch<Meal[]>(endpoints.meals.list, router),
  });
}

export function useMeal(id: string | number | undefined) {
  const router = useRouter();
  return useQuery({
    queryKey: mealKeys.detail(id ?? ''),
    queryFn: () => apiFetch<Meal>(endpoints.meals.detail(id!), router),
    enabled: id != null && id !== '',
  });
}

export function useCreateMeal() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MealInput) =>
      apiFetch<Meal>(endpoints.meals.list, router, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: mealKeys.all });
    },
  });
}

export function useUpdateMeal(id: string | number) {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: MealInput) =>
      apiFetch<Meal>(endpoints.meals.detail(id), router, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: mealKeys.all });
      qc.invalidateQueries({ queryKey: mealKeys.detail(id) });
    },
  });
}

export function useDeleteMeal() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      apiFetch<void>(endpoints.meals.detail(id), router, { method: 'DELETE' }),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: mealKeys.all });
      qc.removeQueries({ queryKey: mealKeys.detail(id) });
    },
  });
}
