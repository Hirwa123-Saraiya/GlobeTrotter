'use client';

import React, { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import '@/styles/auth.css';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState({
    email: searchParams.get('email') || '',
    otp: '',
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
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          otp: form.otp,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Reset failed');
      }

      router.push('/login');
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
        <h1>Enter reset code</h1>
        <p className="auth-card-tagline">
          We&apos;ve emailed a 6-digit code to your address. Enter it below with your new password.
        </p>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-field">
          <label htmlFor="email">Email</label>
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
          <label htmlFor="otp">6-digit code</label>
          <input
            id="otp"
            name="otp"
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            placeholder="123456"
            value={form.otp}
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
          {loading ? 'Resetting...' : 'Reset password'}
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
