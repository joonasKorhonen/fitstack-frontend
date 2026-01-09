'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    // Username validation
    if (username.length < 3 || username.length > 20) {
      setError('Username must be 3-20 characters');
      return false;
    }

    // Password strength validation
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      setError('Password must contain uppercase, lowercase, and number');
      return false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', {
        username,
        password
      });

      // Check that the token exists and is in the correct format
      const tokenValue = res.data.token || res.data.access_token;
      if (!tokenValue) {
        console.error('Server did not return token:', res.data);
        setError('Registration failed: Server did not return a valid token');
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

      // Auto-login: redirect to workouts
      router.push('/workouts');

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        const message = err.response?.data?.message;

        if (status === 409) {
          setError('Username already taken. Please choose another.');
        } else if (status === 400) {
          setError(message || 'Invalid input. Please check your information.');
        } else {
          setError(message || 'Registration failed. Please try again.');
        }
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignup} className="space-y-4 max-w-sm mx-auto p-6 border rounded shadow">
      <h1 className="text-xl font-bold">Sign Up</h1>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      <div>
        <label>Confirm Password:</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
      <div className="text-center text-sm">
        Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
      </div>
    </form>
  );
}
