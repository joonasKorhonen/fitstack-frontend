'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authFetch } from '../../../../lib/authFetch';

export default function EditMealPage() {
  const { id } = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [calories, setCalories] = useState('');
  const [date, setDate] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMeal = async () => {
      const res = await authFetch(`/api/meals/${id}`, router);
      if (!res) return;

      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setCalories(String(data.calories));
        setDate(data.date ? new Date(data.date).toISOString().split('T')[0] : '');
        setProtein(data.protein != null ? String(data.protein) : '');
        setCarbs(data.carbs != null ? String(data.carbs) : '');
        setFat(data.fat != null ? String(data.fat) : '');
        setNotes(data.notes || '');
      }
    };
    fetchMeal();
  }, [id, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !calories) {
      alert('Nimi ja kalorit ovat pakollisia');
      return;
    }

    setLoading(true);

    const body: any = {
      title,
      calories: Number(calories),
    };
    if (date) body.date = date;
    if (protein) body.protein = Number(protein);
    if (carbs) body.carbs = Number(carbs);
    if (fat) body.fat = Number(fat);
    body.notes = notes || null;

    const res = await authFetch(`/api/meals/${id}`, router, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (res && res.ok) {
      router.push(`/meals/${id}`);
    } else {
      alert('Virhe aterian päivityksessä');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={() => router.push(`/meals/${id}`)}
        className="text-blue-600 font-semibold mb-4 hover:underline"
      >
        ← Takaisin
      </button>

      <h1 className="text-2xl font-bold mb-6">Muokkaa ateriaa</h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-medium">Nimi *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Kalorit (kcal) *</label>
          <input
            type="number"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full border p-2 rounded"
            min={0}
            required
          />
        </div>

        <div>
          <label className="block font-medium">Päivämäärä</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block font-medium">Proteiini (g)</label>
            <input
              type="number"
              value={protein}
              onChange={(e) => setProtein(e.target.value)}
              className="w-full border p-2 rounded"
              min={0}
            />
          </div>
          <div>
            <label className="block font-medium">Hiilihydraatit (g)</label>
            <input
              type="number"
              value={carbs}
              onChange={(e) => setCarbs(e.target.value)}
              className="w-full border p-2 rounded"
              min={0}
            />
          </div>
          <div>
            <label className="block font-medium">Rasva (g)</label>
            <input
              type="number"
              value={fat}
              onChange={(e) => setFat(e.target.value)}
              className="w-full border p-2 rounded"
              min={0}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium">Muistiinpanot</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded"
          />
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
            onClick={() => router.push(`/meals/${id}`)}
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Peruuta
          </button>
        </div>
      </form>
    </div>
  );
}