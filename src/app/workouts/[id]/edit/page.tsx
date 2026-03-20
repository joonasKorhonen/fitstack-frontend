'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MovementGroupEditor, { SetData } from '../../components/MovementGroupEditor';
import { authFetch } from '../../../../lib/authFetch';

export default function EditWorkoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const [workout, setWorkout] = useState<any>(null);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [editedSets, setEditedSets] = useState<SetData[]>([]);
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
        setEditedSets(data.sets.map((s: any) => ({
          id: s.id,
          movementId: s.movementId || s.movement?.id,
          movementName: s.movement?.name || s.exercise || 'Tuntematon liike',
          reps: s.reps,
          weight: s.weight ?? '',
          intensity: s.intensity ?? '',
          notes: s.notes ?? '',
        })));
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
    setEditedSets(prev => prev.filter(s => s !== set));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const incompleteSets = editedSets.filter(s => !s.reps);
    if (incompleteSets.length > 0) {
      alert('Täytä toistot kaikille sarjoille');
      return;
    }

    setLoading(true);

    // 1. Update date and notes
    const updateRes = await authFetch(`/api/workouts/${id}`, router, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, notes }),
    });
    if (!updateRes) return;

    // 2. Update existing sets (those with id)
    const existingSets = editedSets.filter(s => s.id);
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
    const newSets = editedSets.filter(s => !s.id);
    if (newSets.length > 0) {
      const transformedSets = newSets.map(set => ({
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

        <MovementGroupEditor
          sets={editedSets}
          onChange={setEditedSets}
          onRemove={(set) => handleRemoveSet(set)}
        />

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
