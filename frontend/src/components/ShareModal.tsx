import React, { useState } from 'react';
import { X, Share2, Copy, Check, Globe } from 'lucide-react';
import { Trip } from '../types/trip';

interface ShareModalProps {
  isOpen: boolean;
  trip: Trip | null;
  onClose: () => void;
}

export default function ShareModal({ isOpen, trip, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !trip) return null;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/shared/${trip.share_token || 'goa-escape-8f72'}`
    : `http://localhost:3000/shared/${trip.share_token || 'goa-escape-8f72'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Share Trip</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Anyone with this public link can view your travel itinerary and copy it into their own GlobeTrotter account.
        </p>

        {/* Public Link Box */}
        <div className="form-group">
          <label>Public Share URL</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="form-input" 
              readOnly 
              value={shareUrl} 
              style={{ flex: 1, fontSize: '0.85rem' }} 
            />
            <button onClick={handleCopy} className="btn-primary" style={{ padding: '0.65rem 1rem' }}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
}
