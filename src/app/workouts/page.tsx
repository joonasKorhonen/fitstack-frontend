'use client';

import Link from 'next/link';
import WorkoutCard from './components/WorkoutCard';
import LogoutButton from '../../components/LogoutButton';
import { useWorkouts } from '../../hooks/workouts';

export default function WorkoutsPage() {
  const { data: workouts, isLoading, error } = useWorkouts();

  if (isLoading) return <p className="p-6 text-center">Ladataan treenejä...</p>;
  if (error) {
    return (
      <p className="p-6 text-center text-red-500">
        {error instanceof Error ? error.message : 'Virhe haettaessa treenejä'}
      </p>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6 relative">
      {/* LogoutButton oikeaan yläkulmaan */}
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      <div className="flex justify-between items-center mt-10">
        <h1 className="text-3xl font-bold">Treenit</h1>
        <div className="flex gap-2">
          <Link
            href="/meals"
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Ateriat
          </Link>
          <Link
            href="/profile"
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Profiili
          </Link>
          <Link
            href="/workouts/create"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Uusi treeni
          </Link>
        </div>
      </div>

      {!workouts || workouts.length === 0 ? (
        <p className="text-gray-600 text-center">Ei vielä treenejä. Luo ensimmäinen!</p>
      ) : (
        <div className="grid gap-3">
          {workouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}
    </main>
  );
}
