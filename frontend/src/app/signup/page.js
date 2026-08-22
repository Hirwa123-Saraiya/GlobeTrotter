'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass } from 'lucide-react';
import { apiClient } from '@/lib/api';
import '@/styles/auth.css';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
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
      const res = await apiClient.post('/auth/signup', form);
      if (res.data.success) {
        router.push('/trips');
      } else {
        setError(res.data.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Signup failed.');
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
        <h1>Create Your Account</h1>
        <p className="auth-card-tagline">Start planning your next multi-city adventure.</p>

        {error && <p className="auth-error">{error}</p>}

        <div className="auth-row">
          <div className="auth-field">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              maxLength={100}
              placeholder="Aarav"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              maxLength={100}
              placeholder="Shah"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

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
            minLength={8}
            pattern="(?=.*\d).{8,}"
            title="At least 8 characters and include a number"
            value={form.password}
            onChange={handleChange}
            required
          />
          <span className="auth-hint">At least 8 characters, including a number.</span>
        </div>

        <button className="auth-submit" type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>

        <p className="auth-switch">
          Already have an account? <a href="/login">Sign in</a>
        </p>
      </form>
    </main>
  );
}
