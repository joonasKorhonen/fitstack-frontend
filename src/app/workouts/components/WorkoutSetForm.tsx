'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Movement } from '@/types/movement';
import { apiFetch, ApiError } from '@/lib/apiFetch';
import { endpoints } from '@/lib/endpoints';

export interface NewWorkoutSet {
  movementId?: number;
  movementName: string;
  reps: number;
  weight?: number;
  intensity?: number;
  notes?: string;
}

export default function WorkoutSetForm({ onAdd }: { onAdd: (set: NewWorkoutSet) => void }) {
  const router = useRouter();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [intensity, setIntensity] = useState('');
  const [notes, setNotes] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch movements on mount
  useEffect(() => {
    fetchMovements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMovements = async () => {
    try {
      const data = await apiFetch<Movement[]>(endpoints.movements.list, router);
      setMovements(data);
    } catch (error) {
      console.error('Failed to fetch movements:', error);
    }
  };

  const createMovement = async (name: string): Promise<Movement | null> => {
    try {
      const newMovement = await apiFetch<Movement>(endpoints.movements.list, router, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      setMovements([...movements, newMovement]);
      return newMovement;
    } catch (error) {
      if (error instanceof ApiError && error.message.includes('already exists')) {
        const existing = movements.find(m => m.name.toLowerCase() === name.toLowerCase());
        return existing || null;
      }
      console.error('Failed to create movement:', error);
      alert('Virhe luotaessa liikettä: ' + (error instanceof Error ? error.message : 'Tuntematon virhe'));
      return null;
    }
  };

  const filteredMovements = movements.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exactMatch = movements.find(
    (m) => m.name.toLowerCase() === searchTerm.toLowerCase()
  );

  const handleSelectMovement = (movement: Movement) => {
    setSelectedMovement(movement);
    setSearchTerm(movement.name);
    setShowDropdown(false);
  };

  const handleCreateAndSelect = async () => {
    if (!searchTerm.trim()) return;

    setIsCreatingNew(true);
    const newMovement = await createMovement(searchTerm.trim());
    setIsCreatingNew(false);

    if (newMovement) {
      handleSelectMovement(newMovement);
    }
  };

  const handleAdd = () => {
    if (!selectedMovement && !searchTerm) {
      return alert('Valitse tai lisää liike');
    }
    if (!reps) {
      return alert('Lisää toistot');
    }

    const newSet: NewWorkoutSet = {
      movementId: selectedMovement?.id,
      movementName: selectedMovement?.name || searchTerm,
      reps: Number(reps),
    };

    if (weight) newSet.weight = Number(weight);
    if (intensity) {
      const intensityNum = Number(intensity);
      if (intensityNum < 1 || intensityNum > 10) {
        return alert('Intensiteetin pitää olla 1-10');
      }
      newSet.intensity = intensityNum;
    }
    if (notes) newSet.notes = notes;

    onAdd(newSet);

    // Reset form
    setSelectedMovement(null);
    setSearchTerm('');
    setReps('');
    setWeight('');
    setIntensity('');
    setNotes('');
  };

  return (
    <div className="border p-4 rounded space-y-3">
      <h2 className="font-semibold">Lisää sarja</h2>
      <div className="grid grid-cols-2 gap-2">
        {/* Movement Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Liike"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSelectedMovement(null);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            className="w-full border p-2 rounded"
          />

          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredMovements.length > 0 ? (
                <>
                  {filteredMovements.map((movement) => (
                    <div
                      key={movement.id}
                      onClick={() => handleSelectMovement(movement)}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {movement.name}
                    </div>
                  ))}
                </>
              ) : (
                <div className="px-3 py-2 text-gray-500">
                  Ei liikkeitä
                </div>
              )}

              {/* Add New Option */}
              {searchTerm && !exactMatch && (
                <div
                  onClick={handleCreateAndSelect}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 cursor-pointer border-t font-medium text-blue-600 flex items-center gap-2"
                >
                  {isCreatingNew ? (
                    <span>Luodaan...</span>
                  ) : (
                    <>
                      <span>+ Lisää &quot;{searchTerm}&quot;</span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <input
          placeholder="Toistot"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="border p-2 rounded"
          type="number"
        />
        <input
          placeholder="Paino (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border p-2 rounded"
          type="number"
        />
        <input
          placeholder="Intensiteetti (1-10)"
          value={intensity}
          onChange={(e) => setIntensity(e.target.value)}
          className="border p-2 rounded"
          type="number"
          min={1}
          max={10}
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
        className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
      >
        Lisää sarja
      </button>
    </div>
  );
}
