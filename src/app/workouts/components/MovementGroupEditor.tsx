'use client';

import { useState } from 'react';
import { Movement } from '@/types/movement';
import MovementSearch from './MovementSearch';

export interface SetData {
  id?: number;
  movementId: number;
  movementName: string;
  reps: number | string;
  weight: number | string;
  intensity: number | string;
  notes: string;
}

interface MovementGroup {
  movement: { id: number; name: string };
  sets: SetData[];
}

interface MovementGroupEditorProps {
  sets: SetData[];
  onChange: (sets: SetData[]) => void;
  onRemove?: (set: SetData, index: number) => void;
}

export default function MovementGroupEditor({ sets, onChange, onRemove }: MovementGroupEditorProps) {
  const [expandedAdd, setExpandedAdd] = useState<number | null>(null);

  // Group sets by movementId
  const groups: MovementGroup[] = [];
  const groupMap = new Map<number, MovementGroup>();

  for (const set of sets) {
    const existing = groupMap.get(set.movementId);
    if (existing) {
      existing.sets.push(set);
    } else {
      const group: MovementGroup = {
        movement: { id: set.movementId, name: set.movementName },
        sets: [set],
      };
      groupMap.set(set.movementId, group);
      groups.push(group);
    }
  }

  const findSetIndex = (set: SetData) => sets.indexOf(set);

  const updateSet = (set: SetData, field: string, value: string) => {
    const idx = findSetIndex(set);
    if (idx === -1) return;
    const updated = [...sets];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange(updated);
  };

  const removeSet = (set: SetData) => {
    const idx = findSetIndex(set);
    if (idx === -1) return;
    if (onRemove) {
      onRemove(set, idx);
    } else {
      onChange(sets.filter((_, i) => i !== idx));
    }
  };

  const addSetToGroup = (movementId: number, movementName: string) => {
    const newSet: SetData = {
      movementId,
      movementName,
      reps: '',
      weight: '',
      intensity: '',
      notes: '',
    };
    onChange([...sets, newSet]);
    setExpandedAdd(null);
  };

  const addMovement = (movement: Movement) => {
    const newSet: SetData = {
      movementId: movement.id,
      movementName: movement.name,
      reps: '',
      weight: '',
      intensity: '',
      notes: '',
    };
    onChange([...sets, newSet]);
  };

  const removeGroup = (movementId: number) => {
    const groupSets = sets.filter(s => s.movementId === movementId);
    if (onRemove) {
      // For existing sets, call onRemove for each
      groupSets.forEach(set => {
        const idx = sets.indexOf(set);
        if (idx !== -1) onRemove(set, idx);
      });
    } else {
      onChange(sets.filter(s => s.movementId !== movementId));
    }
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.movement.id} className="border rounded p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{group.movement.name}</h3>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Poistetaanko kaikki "${group.movement.name}" sarjat?`)) {
                  removeGroup(group.movement.id);
                }
              }}
              className="text-red-500 text-sm hover:underline"
            >
              Poista liike
            </button>
          </div>

          {/* Sets table */}
          <div className="space-y-2">
            {group.sets.map((set, setIdx) => (
              <div key={set.id ?? `new-${setIdx}`} className="grid grid-cols-5 gap-2 items-end">
                <div>
                  <label className="text-xs text-gray-500">Toistot</label>
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) => updateSet(set, 'reps', e.target.value)}
                    className="w-full border p-1 rounded text-sm"
                    placeholder="Toistot"
                    min={1}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Paino (kg)</label>
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) => updateSet(set, 'weight', e.target.value)}
                    className="w-full border p-1 rounded text-sm"
                    placeholder="Paino"
                    min={0}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Int. (1-10)</label>
                  <input
                    type="number"
                    value={set.intensity}
                    onChange={(e) => updateSet(set, 'intensity', e.target.value)}
                    className="w-full border p-1 rounded text-sm"
                    placeholder="Int."
                    min={1}
                    max={10}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Muistiinpanot</label>
                  <input
                    type="text"
                    value={set.notes}
                    onChange={(e) => updateSet(set, 'notes', e.target.value)}
                    className="w-full border p-1 rounded text-sm"
                    placeholder="Muistiinpanot"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSet(set)}
                  className="text-red-600 font-semibold text-sm pb-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addSetToGroup(group.movement.id, group.movement.name)}
            className="text-blue-600 text-sm font-medium hover:underline"
          >
            + Lisää sarja
          </button>
        </div>
      ))}

      {/* Add new movement */}
      <div className="border border-dashed rounded p-4">
        <p className="text-sm text-gray-500 mb-2">Lisää liike</p>
        <MovementSearch onSelect={addMovement} />
      </div>
    </div>
  );
}
