'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MealCard from './components/MealCard';
import { authFetch } from '../../lib/authFetch';
import { Meal } from '../../types/meal';

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMeals = async () => {
      const res = await authFetch('/api/meals', router);
      if (!res) return;

      if (res.ok) {
        const data = await res.json();
        setMeals(data);
      }
      setLoading(false);
    };
    fetchMeals();
  }, [router]);

  if (loading) return <p className="p-6 text-center">Ladataan aterioita...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ateriat</h1>
        <div className="flex gap-2">
          <Link
            href="/workouts"
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Treenit
          </Link>
          <Link
            href="/profile"
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Profiili
          </Link>
          <Link
            href="/meals/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Uusi ateria
          </Link>
        </div>
      </div>

      {meals.length === 0 ? (
        <p className="text-gray-600 text-center">Ei vielä aterioita. Lisää ensimmäinen!</p>
      ) : (
        <div className="grid gap-3">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>
      )}
    </main>
  );
}