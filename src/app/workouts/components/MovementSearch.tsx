'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Movement } from '@/types/movement';
import { apiFetch, ApiError } from '@/lib/apiFetch';
import { endpoints } from '@/lib/endpoints';

interface MovementSearchProps {
  onSelect: (movement: Movement) => void;
}

export default function MovementSearch({ onSelect }: MovementSearchProps) {
  const router = useRouter();
  const [movements, setMovements] = useState<Movement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const data = await apiFetch<Movement[]>(endpoints.movements.list, router);
        setMovements(data);
      } catch (error) {
        console.error('Failed to fetch movements:', error);
      }
    };
    fetchMovements();
  }, [router]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleSelect = (movement: Movement) => {
    onSelect(movement);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleCreateAndSelect = async () => {
    if (!searchTerm.trim()) return;
    setIsCreatingNew(true);
    const newMovement = await createMovement(searchTerm.trim());
    setIsCreatingNew(false);
    if (newMovement) {
      handleSelect(newMovement);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        placeholder="Hae tai lisää liike..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        className="w-full border p-2 rounded"
      />

      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {filteredMovements.length > 0 ? (
            filteredMovements.map((movement) => (
              <div
                key={movement.id}
                onClick={() => handleSelect(movement)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {movement.name}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-500">Ei liikkeitä</div>
          )}

          {searchTerm && !exactMatch && (
            <div
              onClick={handleCreateAndSelect}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 cursor-pointer border-t font-medium text-blue-600"
            >
              {isCreatingNew ? 'Luodaan...' : `+ Lisää "${searchTerm}"`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
