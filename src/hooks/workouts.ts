'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/apiFetch';
import { endpoints } from '../lib/endpoints';
import { Workout } from '../types/workout';

export const workoutKeys = {
  all: ['workouts'] as const,
  detail: (id: string | number) => ['workouts', String(id)] as const,
};

export type WorkoutSetInput = {
  movementId: number;
  reps: number;
  weight?: number;
  intensity?: number;
  notes?: string;
};

export type WorkoutMetaInput = {
  date?: string;
  notes?: string;
};

export type CreateWorkoutInput = WorkoutMetaInput & {
  sets: WorkoutSetInput[];
};

export function useWorkouts() {
  const router = useRouter();
  return useQuery({
    queryKey: workoutKeys.all,
    queryFn: () => apiFetch<Workout[]>(endpoints.workouts.list, router),
  });
}

export function useWorkout(id: string | number | undefined) {
  const router = useRouter();
  return useQuery({
    queryKey: workoutKeys.detail(id ?? ''),
    queryFn: () => apiFetch<Workout>(endpoints.workouts.detail(id!), router),
    enabled: id != null && id !== '',
  });
}

export function useCreateWorkout() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateWorkoutInput) =>
      apiFetch<Workout>(endpoints.workouts.list, router, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}

export function useDeleteWorkout() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string | number) =>
      apiFetch<void>(endpoints.workouts.detail(id), router, { method: 'DELETE' }),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: workoutKeys.all });
      qc.removeQueries({ queryKey: workoutKeys.detail(id) });
    },
  });
}

export function useDeleteWorkoutSet(workoutId: string | number) {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (setId: number) =>
      apiFetch<void>(endpoints.workouts.set(workoutId, setId), router, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workoutKeys.detail(workoutId) });
      qc.invalidateQueries({ queryKey: workoutKeys.all });
    },
  });
}

export type SaveWorkoutEditsInput = {
  meta: WorkoutMetaInput;
  setUpdates: Array<{ setId: number; data: Partial<WorkoutSetInput> }>;
  newSets: WorkoutSetInput[];
};

export function useSaveWorkoutEdits(id: string | number) {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ meta, setUpdates, newSets }: SaveWorkoutEditsInput) => {
      await apiFetch<Workout>(endpoints.workouts.detail(id), router, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(meta),
      });

      for (const { setId, data } of setUpdates) {
        await apiFetch<void>(endpoints.workouts.set(id, setId), router, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      if (newSets.length > 0) {
        await apiFetch<void>(endpoints.workouts.sets(id), router, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sets: newSets }),
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: workoutKeys.all });
      qc.invalidateQueries({ queryKey: workoutKeys.detail(id) });
    },
  });
}
