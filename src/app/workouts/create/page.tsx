'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WorkoutForm, { WorkoutFormValues, emptyWorkoutFormValues } from '../components/WorkoutForm';
import { useCreateWorkout, CreateWorkoutInput } from '../../../hooks/workouts';

export default function CreateWorkoutPage() {
  const router = useRouter();
  const [values, setValues] = useState<WorkoutFormValues>(emptyWorkoutFormValues);
  const createWorkout = useCreateWorkout();

  const handleSubmit = () => {
    const input: CreateWorkoutInput = {
      date: values.date,
      notes: values.notes,
      sets: values.sets.map((set) => ({
        movementId: set.movementId,
        reps: Number(set.reps),
        weight: set.weight !== '' ? Number(set.weight) : undefined,
        intensity: set.intensity !== '' ? Number(set.intensity) : undefined,
        notes: set.notes || undefined,
      })),
    };

    createWorkout.mutate(input, {
      onSuccess: () => router.push('/workouts'),
      onError: (err) =>
        alert(
          'Virhe tallennuksessa: ' +
            (err instanceof Error ? err.message : 'Tuntematon virhe'),
        ),
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Uusi treeni</h1>

      <WorkoutForm
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        submitLabel="Tallenna treeni"
        submittingLabel="Tallennetaan..."
        loading={createWorkout.isPending}
        requireSets
      />
    </div>
  );
}
