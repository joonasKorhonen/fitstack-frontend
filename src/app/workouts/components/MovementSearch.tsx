'use client';

import { useState, useEffect, useRef } from 'react';
import { Movement } from '@/types/movement';

interface MovementSearchProps {
  onSelect: (movement: Movement) => void;
}

export default function MovementSearch({ onSelect }: MovementSearchProps) {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMovements = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const res = await fetch('/api/movements', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setMovements(data);
        }
      } catch (error) {
        console.error('Failed to fetch movements:', error);
      }
    };
    fetchMovements();
  }, []);

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
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const res = await fetch('/api/movements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        const newMovement = await res.json();
        setMovements([...movements, newMovement]);
        return newMovement;
      } else {
        const error = await res.json();
        if (error.message?.includes('already exists')) {
          const existing = movements.find(m => m.name.toLowerCase() === name.toLowerCase());
          return existing || null;
        }
        alert('Virhe luotaessa liikettä: ' + (error.message || 'Tuntematon virhe'));
        return null;
      }
    } catch (error) {
      console.error('Failed to create movement:', error);
      alert('Virhe luotaessa liikettä');
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
