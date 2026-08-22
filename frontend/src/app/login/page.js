'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import { apiClient } from '@/lib/api';
import '@/styles/auth.css';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await apiClient.post('/auth/login', form);
      if (res.data.success) {
        router.push('/trips');
      } else {
        setError(res.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand-logo">
          <Compass size={32} />
        </div>
        <div className="auth-brand-title">GlobeTrotter</div>
        <div className="auth-brand-subtitle">Empowering Personalized Travel Planning</div>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        <p className="auth-card-tagline">Log in to manage your travel itineraries.</p>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span className="auth-hint">
            <a href="/forgot-password">Forgot password?</a>
          </span>
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>

        <p className="auth-switch">
          Don&apos;t have an account? <a href="/signup">Sign up</a>
        </p>
      </form>
    </main>
  );
}
