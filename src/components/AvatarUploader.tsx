'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authFetch } from '../lib/authFetch';

export type UserProfile = {
  id: string;
  username: string;
  avatarUrl: string | null;
  createdAt: string;
};

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

type Props = {
  profile: UserProfile;
  onProfileUpdated: (profile: UserProfile) => void;
};

export default function AvatarUploader({ profile, onProfileUpdated }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Vain JPEG, PNG ja WebP -kuvat ovat sallittuja');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError('Kuva saa olla enintään 5 MB');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await authFetch('http://localhost:3001/api/users/avatar', router, {
        method: 'POST',
        body: formData,
      });
      if (!res) return;
      if (!res.ok) throw new Error('Kuvan lataus epäonnistui');
      const updated: UserProfile = await res.json();
      onProfileUpdated(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tuntematon virhe');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    setError(null);
    setRemoving(true);
    try {
      const res = await authFetch('http://localhost:3001/api/users/avatar', router, {
        method: 'DELETE',
      });
      if (!res) return;
      if (!res.ok) throw new Error('Kuvan poisto epäonnistui');
      const updated: UserProfile = await res.json();
      onProfileUpdated(updated);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Tuntematon virhe');
    } finally {
      setRemoving(false);
    }
  };

  const busy = uploading || removing;

  return (
    <section className="border rounded p-6 space-y-4">
      <div className="flex items-center gap-6">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={`${profile.username} avatar`}
            className="w-32 h-32 rounded-full object-cover border"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 border flex items-center justify-center text-4xl text-gray-500">
            {profile.username.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <p className="text-xl font-semibold">{profile.username}</p>
          <p className="text-sm text-gray-500">
            Liittynyt {new Date(profile.createdAt).toLocaleDateString('fi-FI')}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <label
          className={`px-4 py-2 rounded text-white cursor-pointer ${
            busy ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'Ladataan...' : profile.avatarUrl ? 'Vaihda kuva' : 'Lisää kuva'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            disabled={busy}
            className="hidden"
          />
        </label>
        {profile.avatarUrl && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={busy}
            className={`px-4 py-2 rounded text-white ${
              busy ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {removing ? 'Poistetaan...' : 'Poista kuva'}
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500">JPEG, PNG tai WebP, enintään 5 MB.</p>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </section>
  );
}
