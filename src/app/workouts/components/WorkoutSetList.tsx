'use client';

export default function WorkoutSetList({
  sets,
  onRemove,
}: {
  sets: any[];
  onRemove: (index: number) => void;
}) {
  if (sets.length === 0)
    return <p className="text-gray-500">Ei lisättyjä sarjoja vielä.</p>;

  return (
    <div className="space-y-2">
      {sets.map((set, i) => (
        <div key={i} className="border p-3 rounded flex justify-between">
          <div>
            <p className="font-medium">{set.exercise}</p>
            <p className="text-sm text-gray-600">
              {set.reps} x {set.weight ?? '-'} kg | Int: {set.intensity ?? '-'}
            </p>
            {set.notes && <p className="text-sm italic">{set.notes}</p>}
          </div>
          <button
            type="button"
            onClick={() => onRemove(i)}
            className="text-red-600 font-semibold"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
