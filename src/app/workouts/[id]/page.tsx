'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WorkoutSetList from '../components/WorkoutSetList';

export default function WorkoutDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<any>(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      const res = await fetch(`/api/workouts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setWorkout(await res.json());
      }
    };
    fetchWorkout();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('Poistetaanko tämä treeni?')) return;

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    await fetch(`/api/workouts/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    router.push('/workouts');
  };

  if (!workout) return <p>Ladataan...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {new Date(workout.date).toLocaleDateString('fi-FI')}
        </h1>
        <button
          onClick={handleDelete}
          className="text-red-600 font-semibold border border-red-600 px-3 py-1 rounded"
        >
          Poista
        </button>
      </div>

      {workout.notes && (
        <p className="text-gray-700 italic">{workout.notes}</p>
      )}

      <WorkoutSetList sets={workout.sets} onRemove={() => {}} />
    </div>
  );
}
