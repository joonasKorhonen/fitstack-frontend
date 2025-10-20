'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Workout {
  id: number;
  exercise: string;
  reps: number;
  weight?: number;
  notes?: string;
  date: string;
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Use AbortController to cancel fetch requests if the component unmounts
    const controller = new AbortController();

    const fetchWorkouts = async () => {
      try {
        // Ensure we are in the browser environment
        if (typeof window === 'undefined') return;

        // Get token from localStorage
        const token = localStorage.getItem('token');

        // If token is missing, redirect to login page
        if (!token) {
          alert('Authentication information not found. Please log in.');
          router.push('/');
          return;
        }

        // Haetaan treeniliikkeet
        const res = await axios.get('http://localhost:3001/api/workouts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          // Use AbortController for fetch operation
          signal: controller.signal
        });
        
  setWorkouts(res.data);
      } catch (err: unknown) {
        // If request was aborted, do not show error
        if (axios.isAxiosError(err) && err.code === 'ERR_CANCELED') {
          return;
        }

        // Handle error
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);

          // 401 = unauthorized, token expired or invalid
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            alert('Your session has expired. Please log in again.');
            router.push('/');
          }
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
    
    // Cleanup function
    return () => {
      controller.abort(); // Cancel requests when component unmounts
    };
  }, [router]);

  if (loading) return <p className="p-8 text-center">Loading workouts...</p>;
  if (error) return <p className="p-8 text-center text-red-500">Error: {error}</p>;

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Your Workouts 💪</h1>
      {workouts.length === 0 ? (
        <p className="text-center">No workouts added yet.</p>
      ) : (
        <ul className="space-y-4">
          {workouts.map((w) => (
            <li key={w.id} className="border p-4 rounded shadow">
              <p><strong>Exercise:</strong> {w.exercise}</p>
              <p><strong>Reps:</strong> {w.reps}</p>
              {w.weight && <p><strong>Weight:</strong> {w.weight} kg</p>}
              {w.notes && <p><strong>Notes:</strong> {w.notes}</p>}
              <p><strong>Date:</strong> {new Date(w.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
