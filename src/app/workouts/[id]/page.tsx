'use client';

import { useParams, useRouter } from 'next/navigation';
import { WorkoutSet } from '../../../types/workout';
import { useWorkout, useDeleteWorkout, useDeleteWorkoutSet } from '../../../hooks/workouts';

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: workout } = useWorkout(id);
  const deleteWorkout = useDeleteWorkout();
  const deleteSet = useDeleteWorkoutSet(id);

  const handleDelete = () => {
    if (!confirm('Poistetaanko tämä treeni?')) return;
    deleteWorkout.mutate(id, {
      onSuccess: () => router.push('/workouts'),
      onError: (err) =>
        alert(
          'Virhe treenin poistamisessa: ' +
            (err instanceof Error ? err.message : 'Tuntematon virhe'),
        ),
    });
  };

  const handleRemoveSet = (setId: number) => {
    if (!confirm('Poistetaanko tämä setti?')) return;
    deleteSet.mutate(setId, {
      onError: () => alert('Virhe setin poistamisessa'),
    });
  };

  if (!workout) return <p>Ladataan...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <button
        onClick={() => router.push('/workouts')}
        className="text-blue-600 font-semibold mb-4 hover:underline"
      >
        ← Takaisin
      </button>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          {new Date(workout.date).toLocaleDateString('fi-FI')}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/workouts/${id}/edit`)}
            className="text-blue-600 font-semibold border border-blue-600 px-3 py-1 rounded"
          >
            Muokkaa
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteWorkout.isPending}
            className="text-red-600 font-semibold border border-red-600 px-3 py-1 rounded disabled:opacity-50"
          >
            Poista
          </button>
        </div>
      </div>

      {workout.notes && (
        <p className="text-gray-700 italic">{workout.notes}</p>
      )}

      {/* Grouped sets by movement */}
      {(() => {
        const groups = new Map<number, { name: string; sets: WorkoutSet[] }>();
        for (const set of workout.sets) {
          const movementId = set.movementId ?? set.movement?.id ?? 0;
          const movementName = set.movement?.name || set.exercise || 'Tuntematon liike';
          if (!groups.has(movementId)) {
            groups.set(movementId, { name: movementName, sets: [] });
          }
          groups.get(movementId)!.sets.push(set);
        }

        return Array.from(groups.entries()).map(([movementId, group]) => (
          <div key={movementId} className="border rounded p-4 space-y-2">
            <h3 className="font-semibold text-lg">{group.name}</h3>
            {group.sets.map((set) => (
              <div key={set.id} className="flex justify-between items-center pl-2">
                <p className="text-sm text-gray-600">
                  {set.reps} x {set.weight ?? '-'} kg | Int: {set.intensity ?? '-'}
                  {set.notes && <span className="italic ml-2">— {set.notes}</span>}
                </p>
                <button
                  type="button"
                  onClick={() => handleRemoveSet(set.id)}
                  className="text-red-600 font-semibold text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ));
      })()}
    </div>
  );
}
