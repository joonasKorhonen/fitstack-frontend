'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import WorkoutCard from './components/WorkoutCard';
import LogoutButton from '../../components/LogoutButton';
import { authFetch } from '../../lib/authFetch';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await authFetch('http://localhost:3001/api/workouts', router);
        if (!res) return;

        if (!res.ok) {
          throw new Error('Virhe haettaessa treenejä');
        }

        const data = await res.json();
        setWorkouts(data);
      } catch (error: any) {
        setError(error.message || 'Tuntematon virhe');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [router]);

  if (loading) return <p className="p-6 text-center">Ladataan treenejä...</p>;
  if (error) return <p className="p-6 text-center text-red-500">{error}</p>;

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

      {workouts.length === 0 ? (
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
