'use client';

import Link from 'next/link';
import MealCard from './components/MealCard';
import { useMeals } from '../../hooks/meals';

export default function MealsPage() {
  const { data: meals, isLoading, error } = useMeals();

  if (isLoading) return <p className="p-6 text-center">Ladataan aterioita...</p>;
  if (error) return <p className="p-6 text-center text-red-500">Virhe aterioiden haussa</p>;

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

      {!meals || meals.length === 0 ? (
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
