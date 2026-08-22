'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiClient } from '@/lib/api';
import '@/styles/auth.css';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    email: searchParams.get('email') || '',
    token: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await apiClient.post('/auth/reset-password', {
        email: form.email,
        token: form.token,
        password: form.password,
      });
      if (res.data.success) {
        router.push('/login');
      } else {
        setError(res.data.message || 'Reset failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Reset failed.');
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
        <h1>Reset Password</h1>
        <p className="auth-card-tagline">
          Enter your email, reset token, and new password below.
        </p>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-field">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="token">Reset Token</label>
          <input
            id="token"
            name="token"
            type="text"
            placeholder="Reset token string..."
            value={form.token}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">New Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            minLength={8}
            pattern="(?=.*\d).{8,}"
            title="At least 8 characters and include a number"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span className="auth-hint">At least 8 characters, including a number.</span>
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <p className="auth-switch">
          Didn&apos;t get a code? <a href="/forgot-password">Resend</a>
        </p>
      </form>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
