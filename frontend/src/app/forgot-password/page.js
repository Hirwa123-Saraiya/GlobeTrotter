'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import '@/styles/auth.css';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand-logo">✈️</div>
        <div className="auth-brand-title">GlobeTrotter</div>
        <div className="auth-brand-subtitle">Empowering Personalized Travel Planning</div>
      </div>

      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Forgot password?</h1>
        <p className="auth-card-tagline">
          Enter your email and we&apos;ll send you a 6-digit code to reset it.
        </p>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Sending code...' : 'Send reset code'}
        </button>

        <p className="auth-switch">
          Remembered your password? <a href="/login">Login</a>
        </p>
      </form>
    </main>
  );
}
