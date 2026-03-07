'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import WorkoutSetForm from '../../components/WorkoutSetForm';
import WorkoutSetList from '../../components/WorkoutSetList';
import { authFetch } from '../../../../lib/authFetch';

export default function EditWorkoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<any>(null);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [newSets, setNewSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWorkout = async () => {
      const res = await authFetch(`/api/workouts/${id}`, router);
      if (!res) return;

      if (res.ok) {
        const data = await res.json();
        setWorkout(data);
        setDate(data.date ? new Date(data.date).toISOString().split('T')[0] : '');
        setNotes(data.notes || '');
      }
    };
    fetchWorkout();
  }, [id, router]);

  const handleRemoveExistingSet = async (index: number) => {
    if (!confirm('Poistetaanko tämä sarja?')) return;

    const setToRemove = workout.sets[index];
    const res = await authFetch(`/api/workouts/${id}/sets/${setToRemove.id}`, router, {
      method: 'DELETE',
    });
    if (!res) return;

    if (res.ok) {
      const updatedSets = workout.sets.filter((_: any, i: number) => i !== index);
      setWorkout({ ...workout, sets: updatedSets });
    } else {
      alert('Virhe sarjan poistamisessa');
    }
  };

  const addNewSet = (set: any) => setNewSets([...newSets, set]);
  const removeNewSet = (index: number) => setNewSets(newSets.filter((_, i) => i !== index));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Update date and notes
    const updateRes = await authFetch(`/api/workouts/${id}`, router, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, notes }),
    });
    if (!updateRes) return;

    // 2. Add new sets if any
    if (newSets.length > 0) {
      const transformedSets = newSets.map(set => ({
        movementId: set.movementId,
        reps: set.reps,
        weight: set.weight,
        intensity: set.intensity,
        notes: set.notes,
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

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block font-medium">Päivämäärä</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Muistiinpanot</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Existing sets */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Nykyiset sarjat</h2>
          {workout.sets.length > 0 ? (
            <WorkoutSetList sets={workout.sets} onRemove={handleRemoveExistingSet} />
          ) : (
            <p className="text-gray-500">Ei sarjoja</p>
          )}
        </div>

        {/* Add new sets */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Lisää uusia sarjoja</h2>
          <WorkoutSetForm onAdd={addNewSet} />
          {newSets.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-1">Uudet sarjat ({newSets.length}):</p>
              <WorkoutSetList sets={newSets} onRemove={removeNewSet} />
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Tallennetaan...' : 'Tallenna muutokset'}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/workouts/${id}`)}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Peruuta
          </button>
        </div>
      </form>
    </div>
  );
}
