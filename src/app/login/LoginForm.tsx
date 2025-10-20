'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password
      });

  // Check that the token exists and is in the correct format
      const tokenValue = res.data.token || res.data.access_token;
      if (!tokenValue) {
        console.error('Server did not return token:', res.data);
        setError('Authentication failed: Server did not return a valid token');
        return;
      }
      
      console.log('Received token from server:', tokenValue);
      
  // Save the token and verify it was stored
      localStorage.setItem('token', tokenValue);
      const storedToken = localStorage.getItem('token');
      console.log('Stored token verification:', storedToken ? 'saved successfully' : 'failed to save');
      
      if (!storedToken) {
        setError('Failed to store authentication token. Please try again.');
        return;
      }

      alert('Login successful ✅');
      router.push('/workouts');

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto p-6 border rounded shadow">
      <h1 className="text-xl font-bold">Login</h1>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
}
