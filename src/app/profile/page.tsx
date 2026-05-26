'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import LogoutButton from '../../components/LogoutButton';
import AvatarUploader, { UserProfile } from '../../components/AvatarUploader';
import { authFetch } from '../../lib/authFetch';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await authFetch('http://localhost:3001/api/users/profile', router);
        if (!res) return;
        if (!res.ok) throw new Error('Virhe haettaessa profiilia');
        const data: UserProfile = await res.json();
        setProfile(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Tuntematon virhe');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  if (loading) return <p className="p-6 text-center">Ladataan profiilia...</p>;
  if (!profile) return <p className="p-6 text-center text-red-500">{error ?? 'Profiilia ei löytynyt'}</p>;

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6 relative">
      <div className="absolute top-4 right-4">
        <LogoutButton />
      </div>

      <div className="flex justify-between items-center mt-10">
        <h1 className="text-3xl font-bold">Profiili</h1>
        <div className="flex gap-2">
          <Link
            href="/workouts"
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Treenit
          </Link>
          <Link
            href="/meals"
            className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
          >
            Ateriat
          </Link>
        </div>
      </div>

      <AvatarUploader profile={profile} onProfileUpdated={setProfile} />
    </main>
  );
}
