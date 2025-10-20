"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

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
    const fetchWorkouts = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await axios.get("http://localhost:3001/api/workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkouts(res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, [router]);

  if (loading) return <p className="p-8 text-center">Loading workouts...</p>;
  if (error) return <p className="p-8 text-center text-red-500">Error: {error}</p>;

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Workouts 💪</h1>
        <LogoutButton />
      </div>

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
