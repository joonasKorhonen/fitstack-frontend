'use client';

import { useState } from 'react';

export default function WorkoutSetForm({ onAdd }: { onAdd: (set: any) => void }) {
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [intensity, setIntensity] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = () => {
    if (!exercise || !reps) return alert('Lisää vähintään liike ja toistot');

    const newSet: any = {
      exercise,
      reps: Number(reps),
    };

    if (weight) newSet.weight = Number(weight);
    if (intensity) newSet.intensity = Number(intensity);
    if (notes) newSet.notes = notes;

    onAdd(newSet);
    setExercise('');
    setReps('');
    setWeight('');
    setIntensity('');
    setNotes('');
  };

  return (
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-semibold">Lisää sarja</h2>
      <div className="grid grid-cols-2 gap-2">
        <input
          placeholder="Liike"
          value={exercise}
          onChange={(e) => setExercise(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Toistot"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Paino (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          placeholder="Intensiteetti"
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <textarea
        placeholder="Muistiinpanot (valinnainen)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full border p-2 rounded"
      />
      <button
        type="button"
        onClick={handleAdd}
        className="bg-green-600 text-white px-3 py-2 rounded"
      >
        Lisää sarja
      </button>
    </div>
  );
}
