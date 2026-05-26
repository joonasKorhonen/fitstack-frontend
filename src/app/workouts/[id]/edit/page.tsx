'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WorkoutForm, { WorkoutFormValues, emptyWorkoutFormValues } from '../../components/WorkoutForm';
import { SetData } from '../../components/MovementGroupEditor';
import { authFetch } from '../../../../lib/authFetch';
import { Workout, WorkoutSet } from '../../../../types/workout';

export default function EditWorkoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [values, setValues] = useState<WorkoutFormValues>(emptyWorkoutFormValues);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      const res = await authFetch(`/api/workouts/${id}`, router);
      if (!res) return;

      if (res.ok) {
        const data: Workout = await res.json();
        setWorkout(data);
        setValues({
          date: data.date ? new Date(data.date).toISOString().split('T')[0] : '',
          notes: data.notes || '',
          sets: data.sets.map((s: WorkoutSet) => ({
            id: s.id,
            movementId: s.movementId ?? s.movement?.id ?? 0,
            movementName: s.movement?.name || s.exercise || 'Tuntematon liike',
            reps: s.reps,
            weight: s.weight ?? '',
            intensity: s.intensity ?? '',
            notes: s.notes ?? '',
          })),
        });
      }
    };
    fetchWorkout();
  }, [id, router]);

  const handleRemoveSet = async (set: SetData) => {
    if (set.id) {
      if (!confirm('Poistetaanko tämä sarja?')) return;
      const res = await authFetch(`/api/workouts/${id}/sets/${set.id}`, router, {
        method: 'DELETE',
      });
      if (!res) return;
      if (!res.ok) {
        alert('Virhe sarjan poistamisessa');
        return;
      }
    }
    setValues((prev) => ({ ...prev, sets: prev.sets.filter((s) => s !== set) }));
  };

  const handleSave = async () => {
    setLoading(true);

    // 1. Update date and notes
    const updateRes = await authFetch(`/api/workouts/${id}`, router, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: values.date, notes: values.notes }),
    });
    if (!updateRes) return;

    // 2. Update existing sets (those with id)
    const existingSets = values.sets.filter((s) => s.id);
    for (const set of existingSets) {
      await authFetch(`/api/workouts/${id}/sets/${set.id}`, router, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reps: Number(set.reps),
          weight: set.weight !== '' ? Number(set.weight) : undefined,
          intensity: set.intensity !== '' ? Number(set.intensity) : undefined,
          notes: set.notes || undefined,
        }),
      });
    }

    // 3. Create new sets (those without id)
    const newSets = values.sets.filter((s) => !s.id);
    if (newSets.length > 0) {
      const transformedSets = newSets.map((set) => ({
        movementId: set.movementId,
        reps: Number(set.reps),
        weight: set.weight !== '' ? Number(set.weight) : undefined,
        intensity: set.intensity !== '' ? Number(set.intensity) : undefined,
        notes: set.notes || undefined,
      }));

      await authFetch(`/api/workouts/${id}/sets`, router, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sets: transformedSets }),
      });
    }

    setLoading(false);
    router.push(`/workouts/${id}`);
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
        loading={loading}
      />
    </div>
  );
}
