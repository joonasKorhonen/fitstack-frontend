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
  const [editedSets, setEditedSets] = useState<any[]>([]);
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
        setEditedSets(data.sets.map((s: any) => ({
          id: s.id,
          reps: s.reps,
          weight: s.weight ?? '',
          intensity: s.intensity ?? '',
          notes: s.notes ?? '',
          movementName: s.movement?.name || s.exercise || 'Tuntematon liike',
        })));
      }
    };
    fetchWorkout();
  }, [id, router]);

  const handleEditSet = (index: number, field: string, value: string) => {
    const updated = [...editedSets];
    updated[index] = { ...updated[index], [field]: value };
    setEditedSets(updated);
  };

  const handleRemoveExistingSet = async (index: number) => {
    if (!confirm('Poistetaanko tämä sarja?')) return;

    const setToRemove = editedSets[index];
    const res = await authFetch(`/api/workouts/${id}/sets/${setToRemove.id}`, router, {
      method: 'DELETE',
    });
    if (!res) return;

    if (res.ok) {
      setEditedSets(editedSets.filter((_, i) => i !== index));
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

    // 2. Update edited existing sets
    for (const set of editedSets) {
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

    // 3. Add new sets if any
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

        {/* Existing sets - editable */}
        <div>
          <h2 className="font-semibold text-lg mb-2">Nykyiset sarjat</h2>
          {editedSets.length > 0 ? (
            <div className="space-y-2">
              {editedSets.map((set, i) => (
                <div key={set.id} className="border p-3 rounded space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{set.movementName}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingSet(i)}
                      className="text-red-600 font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="text-xs text-gray-500">Toistot</label>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleEditSet(i, 'reps', e.target.value)}
                        className="w-full border p-1 rounded text-sm"
                        min={1}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Paino (kg)</label>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => handleEditSet(i, 'weight', e.target.value)}
                        className="w-full border p-1 rounded text-sm"
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Intensiteetti</label>
                      <input
                        type="number"
                        value={set.intensity}
                        onChange={(e) => handleEditSet(i, 'intensity', e.target.value)}
                        className="w-full border p-1 rounded text-sm"
                        min={1}
                        max={10}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Muistiinpanot</label>
                      <input
                        type="text"
                        value={set.notes}
                        onChange={(e) => handleEditSet(i, 'notes', e.target.value)}
                        className="w-full border p-1 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
