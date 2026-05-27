'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WorkoutForm, { WorkoutFormValues, emptyWorkoutFormValues } from '../../components/WorkoutForm';
import { SetData } from '../../components/MovementGroupEditor';
import {
  useWorkout,
  useSaveWorkoutEdits,
  useDeleteWorkoutSet,
} from '../../../../hooks/workouts';
import { WorkoutSet } from '../../../../types/workout';

export default function EditWorkoutPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: workout } = useWorkout(id);
  const saveEdits = useSaveWorkoutEdits(id);
  const deleteSet = useDeleteWorkoutSet(id);

  const [values, setValues] = useState<WorkoutFormValues>(emptyWorkoutFormValues);

  useEffect(() => {
    if (!workout) return;
    setValues({
      date: workout.date ? new Date(workout.date).toISOString().split('T')[0] : '',
      notes: workout.notes || '',
      sets: workout.sets.map((s: WorkoutSet) => ({
        id: s.id,
        movementId: s.movementId ?? s.movement?.id ?? 0,
        movementName: s.movement?.name || s.exercise || 'Tuntematon liike',
        reps: s.reps,
        weight: s.weight ?? '',
        intensity: s.intensity ?? '',
        notes: s.notes ?? '',
      })),
    });
  }, [workout]);

  const handleRemoveSet = async (set: SetData) => {
    if (set.id) {
      if (!confirm('Poistetaanko tämä sarja?')) return;
      try {
        await deleteSet.mutateAsync(set.id);
      } catch {
        alert('Virhe sarjan poistamisessa');
        return;
      }
    }
    setValues((prev) => ({ ...prev, sets: prev.sets.filter((s) => s !== set) }));
  };

  const handleSave = () => {
    const setUpdates = values.sets
      .filter((s) => s.id)
      .map((set) => ({
        setId: set.id!,
        data: {
          reps: Number(set.reps),
          weight: set.weight !== '' ? Number(set.weight) : undefined,
          intensity: set.intensity !== '' ? Number(set.intensity) : undefined,
          notes: set.notes || undefined,
        },
      }));

    const newSets = values.sets
      .filter((s) => !s.id)
      .map((set) => ({
        movementId: set.movementId,
        reps: Number(set.reps),
        weight: set.weight !== '' ? Number(set.weight) : undefined,
        intensity: set.intensity !== '' ? Number(set.intensity) : undefined,
        notes: set.notes || undefined,
      }));

    saveEdits.mutate(
      { meta: { date: values.date, notes: values.notes }, setUpdates, newSets },
      {
        onSuccess: () => router.push(`/workouts/${id}`),
        onError: (err) =>
          alert(
            'Virhe tallennuksessa: ' +
              (err instanceof Error ? err.message : 'Tuntematon virhe'),
          ),
      },
    );
  };

  if (!workout) return <p className="p-6">Ladataan...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.push(`/workouts/${id}`)}
        className="text-blue-600 font-semibold mb-4 hover:underline"
      >
        ← Takaisin
      </button>

      <h1 className="text-2xl font-bold mb-6">Muokkaa treeniä</h1>

      <WorkoutForm
        values={values}
        onChange={setValues}
        onSubmit={handleSave}
        onCancel={() => router.push(`/workouts/${id}`)}
        onRemoveSet={handleRemoveSet}
        submitLabel="Tallenna muutokset"
        submittingLabel="Tallennetaan..."
        loading={saveEdits.isPending}
      />
    </div>
  );
}
