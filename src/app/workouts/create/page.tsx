'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WorkoutSetForm from '../components/WorkoutSetForm';
import WorkoutSetList from '../components/WorkoutSetList';

export default function CreateWorkoutPage() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addSet = (set: any) => setSets([...sets, set]);
  const removeSet = (index: number) => setSets(sets.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (sets.length === 0) {
      alert('Lisää vähintään yksi setti ennen tallennusta');
      return;
    }

    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Et ole kirjautunut sisään');
      router.push('/');
      return;
    }

    const requestBody = { date, notes, sets };
    console.log('Frontend - Sending request:');
    console.log('  Token:', token ? `${token.substring(0, 20)}...` : 'Missing');
    console.log('  Body:', JSON.stringify(requestBody, null, 2));

    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Frontend - Response status:', res.status);

    setLoading(false);
    if (res.ok) {
      console.log('Frontend - Success! Redirecting...');
      router.push('/workouts');
    } else {
      const errorData = await res.json().catch(() => ({}));
      console.error('Frontend - Error response:', errorData);
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

        <WorkoutSetForm onAdd={addSet} />
        <WorkoutSetList sets={sets} onRemove={removeSet} />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? 'Tallennetaan...' : 'Tallenna treeni'}
        </button>
      </form>
    </div>
  );
}
