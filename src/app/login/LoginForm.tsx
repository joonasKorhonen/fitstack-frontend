'use client';

import { useState } from 'react';
import axios from 'axios';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        username,
        password,
      });
      alert('✅ Successful login! Token: ' + res.data.token);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert('❌ Login failed: ' + err.response?.data?.message || err.message);
      } else if (err instanceof Error) {
        alert('❌ Login failed: ' + err.message);
      } else {
        alert('❌ Login failed: unknown error');
      }
    }
  };

  return (
    <main className="p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">FitStack Login 💪</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </main>
  );
}
