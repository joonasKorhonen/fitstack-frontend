'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MovementGroupEditor, { SetData } from '../components/MovementGroupEditor';
import { authFetch } from '../../../lib/authFetch';

export default function CreateWorkoutPage() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState<SetData[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sets.length === 0) {
      alert('Lisää vähintään yksi sarja ennen tallennusta');
      return;
    }

    const incompleteSets = sets.filter(s => !s.reps);
    if (incompleteSets.length > 0) {
      alert('Täytä toistot kaikille sarjoille');
      return;
    }

    setLoading(true);

    const transformedSets = sets.map(set => ({
      movementId: set.movementId,
      reps: Number(set.reps),
      weight: set.weight !== '' ? Number(set.weight) : undefined,
      intensity: set.intensity !== '' ? Number(set.intensity) : undefined,
      notes: set.notes || undefined,
    }));

    const requestBody = { date, notes, sets: transformedSets };

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

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <MovementGroupEditor sets={sets} onChange={setSets} />

        <button
          type="submit"
          disabled={loading || sets.length === 0}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Tallennetaan...' : 'Tallenna treeni'}
        </button>
      </form>
    </div>
  );
}
