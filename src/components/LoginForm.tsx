'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import axiosInstance from '@/utils/axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Only clear error when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await axiosInstance.post('/api/auth/login', formData);
      console.log('Login response:', data);

      if (data.token && data.user) {
        await login(data.token, data.user); // Wait for login to complete
        router.push('/');
      } else {
        setError('Invalid response from server');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.response?.data?.error || 'Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
        />
      </div>

      {error && (
        <div className="text-red-500 text-sm py-2 px-3 bg-red-50 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>

      <div className="text-center text-sm mt-4">
        Don't have an account?{' '}
        <Link href="/register" className="text-blue-500 hover:text-blue-600">
          Register here
        </Link>
      </div>
    </form>
  );
} 