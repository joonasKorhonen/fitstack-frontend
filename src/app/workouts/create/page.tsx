'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WorkoutForm, { WorkoutFormValues, emptyWorkoutFormValues } from '../components/WorkoutForm';
import { authFetch } from '../../../lib/authFetch';

export default function CreateWorkoutPage() {
  const router = useRouter();
  const [values, setValues] = useState<WorkoutFormValues>(emptyWorkoutFormValues);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    const transformedSets = values.sets.map((set) => ({
      movementId: set.movementId,
      reps: Number(set.reps),
      weight: set.weight !== '' ? Number(set.weight) : undefined,
      intensity: set.intensity !== '' ? Number(set.intensity) : undefined,
      notes: set.notes || undefined,
    }));

    const requestBody = { date: values.date, notes: values.notes, sets: transformedSets };

    const res = await authFetch('/api/workouts', router, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    setLoading(false);
    if (!res) return;

    if (res.ok) {
      router.push('/workouts');
    } else {
      const errorData = await res.json().catch(() => ({}));
      alert('Virhe tallennuksessa: ' + (errorData.message || errorData.error || 'Tuntematon virhe'));
    }
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
        loading={loading}
        requireSets
      />
    </div>
  );
}
