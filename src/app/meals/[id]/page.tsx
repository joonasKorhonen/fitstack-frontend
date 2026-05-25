'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { authFetch } from '../../../lib/authFetch';
import { Meal } from '../../../types/meal';

export default function MealDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meal, setMeal] = useState<Meal | null>(null);

  useEffect(() => {
    const fetchMeal = async () => {
      const res = await authFetch(`/api/meals/${id}`, router);
      if (!res) return;

      if (res.ok) {
        setMeal(await res.json());
      }
    };
    fetchMeal();
  }, [id, router]);

  const handleDelete = async () => {
    if (!confirm('Poistetaanko tämä ateria?')) return;

    const res = await authFetch(`/api/meals/${id}`, router, { method: 'DELETE' });
    if (!res) return;

    if (res.ok) {
      router.push('/meals');
    } else {
      alert('Virhe aterian poistamisessa');
    }
  };

  if (!meal) return <p className="p-6">Ladataan...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <button
        onClick={() => router.push('/meals')}
        className="text-blue-600 font-semibold mb-4 hover:underline"
      >
        ← Takaisin
      </button>

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{meal.title}</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/meals/${id}/edit`)}
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

      <p className="text-sm text-gray-500">
        {new Date(meal.date).toLocaleDateString('fi-FI')}
      </p>

      <div className="grid grid-cols-2 gap-4 border rounded p-4">
        <div>
          <p className="text-sm text-gray-500">Kalorit</p>
          <p className="text-xl font-bold">{meal.calories} kcal</p>
        </div>
        {meal.protein != null && (
          <div>
            <p className="text-sm text-gray-500">Proteiini</p>
            <p className="text-xl font-bold">{meal.protein} g</p>
          </div>
        )}
        {meal.carbs != null && (
          <div>
            <p className="text-sm text-gray-500">Hiilihydraatit</p>
            <p className="text-xl font-bold">{meal.carbs} g</p>
          </div>
        )}
        {meal.fat != null && (
          <div>
            <p className="text-sm text-gray-500">Rasva</p>
            <p className="text-xl font-bold">{meal.fat} g</p>
          </div>
        )}
      </div>

      {meal.notes && (
        <p className="text-gray-700 italic">{meal.notes}</p>
      )}
    </div>
  );
}