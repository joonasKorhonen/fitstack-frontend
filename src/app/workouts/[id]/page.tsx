'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WorkoutSetList from '../components/WorkoutSetList';
import { authFetch } from '../../../lib/authFetch';

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<any>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      const res = await authFetch(`/api/workouts/${id}`, router);
      if (!res) return;

      if (res.ok) {
        setWorkout(await res.json());
      }
    };
    fetchWorkout();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('Poistetaanko tämä treeni?')) return;

    const res = await authFetch(`/api/workouts/${id}`, router, { method: 'DELETE' });
    if (!res) return;

    if (res.ok) {
      router.push('/workouts');
    } else {
      const errorData = await res.json().catch(() => ({}));
      alert('Virhe treenin poistamisessa: ' + (errorData.error || errorData.message || 'Tuntematon virhe'));
    }
  };

  const handleRemoveSet = async (index: number) => {
    if (!confirm('Poistetaanko tämä setti?')) return;

    const setToRemove = workout.sets[index];
    const setId = setToRemove.id;

    const res = await authFetch(`/api/workouts/${id}/sets/${setId}`, router, { method: 'DELETE' });
    if (!res) return;

    if (res.ok) {
      const updatedSets = workout.sets.filter((_: any, i: number) => i !== index);
      setWorkout({ ...workout, sets: updatedSets });
    } else {
      alert('Virhe setin poistamisessa');
    }
  };

  if (!workout) return <p>Ladataan...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <button
        onClick={() => router.push('/workouts')}
        className="text-blue-600 font-semibold mb-4 hover:underline"
      >
        ← Takaisin
      </button>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {new Date(workout.date).toLocaleDateString('fi-FI')}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/workouts/${id}/edit`)}
            className="text-blue-600 font-semibold border border-blue-600 px-3 py-1 rounded"
          >
            Muokkaa
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 font-semibold border border-red-600 px-3 py-1 rounded"
          >
            Poista
          </button>
        </div>
      </div>

      {workout.notes && (
        <p className="text-gray-700 italic">{workout.notes}</p>
      )}

      <WorkoutSetList sets={workout.sets} onRemove={handleRemoveSet} />
    </div>
  );
}
