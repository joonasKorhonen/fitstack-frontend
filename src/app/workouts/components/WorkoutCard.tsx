'use client';

import Link from 'next/link';
import { Workout } from '../../../types/workout';

export default function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link
      href={`/workouts/${workout.id}`}
      className="block border rounded p-4 hover:bg-gray-50 transition"
    >
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">
          {new Date(workout.date).toLocaleDateString('fi-FI')}
        </h2>
        <span className="text-sm text-gray-500">
          {workout.sets.length} sarjaa
        </span>
      </div>
      {workout.notes && (
        <p className="text-gray-700 mt-1 text-sm">{workout.notes}</p>
      )}
    </Link>
  );
}
