import React, { useState } from 'react';
import { LogIn, X, Lock, Mail } from 'lucide-react';
import { apiClient } from '../lib/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, onSuccess }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.success) {
        onSuccess();
        onClose();
      } else {
        setErrorMsg(response.data.message || 'Login failed.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMsg(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '440px', padding: '2rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.85rem', borderBottom: '1px solid var(--border-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)' }}>
              <LogIn size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>Welcome Back</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sign in to access your travel itineraries</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Error Notice */}
        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: '0.75rem',
            padding: '0.65rem 0.9rem',
            marginBottom: '1.25rem',
            fontSize: '0.82rem',
            color: '#fda4af'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Mail size={14} color="var(--accent-teal)" /> Email Address *
            </label>
            <input 
              type="email" 
              className="form-input" 
              placeholder="user@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Lock size={14} color="var(--primary)" /> Password *
            </label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              {submitting ? 'Authenticating...' : 'Sign In Now'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
