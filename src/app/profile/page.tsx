'use client';

import Link from 'next/link';
import LogoutButton from '../../components/LogoutButton';
import AvatarUploader from '../../components/AvatarUploader';
import { useProfile } from '../../hooks/profile';

export default function ProfilePage() {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) return <p className="p-6 text-center">Ladataan profiilia...</p>;
  if (!profile) {
    return (
      <p className="p-6 text-center text-red-500">
        {error instanceof Error ? error.message : 'Profiilia ei löytynyt'}
      </p>
    );
  }

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

      <AvatarUploader profile={profile} />
    </main>
  );
}
