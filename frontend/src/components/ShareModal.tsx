import React, { useState, useEffect } from 'react';
import { X, Share2, Copy, Check, Globe, Lock, Eye, EyeOff } from 'lucide-react';
import { Trip } from '../types/trip';
import { shareTrip } from '../lib/api';

interface ShareModalProps {
  isOpen: boolean;
  trip: Trip | null;
  onClose: () => void;
  onTripUpdated?: (updatedTrip: Trip) => void;
}

export default function ShareModal({ isOpen, trip, onClose, onTripUpdated }: ShareModalProps) {
  const [isPublic, setIsPublic] = useState<boolean>(trip?.is_public ?? false);
  const [copied, setCopied] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (trip) {
      setIsPublic(trip.is_public ?? false);
    }
  }, [trip]);

  if (!isOpen || !trip) return null;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/shared/${trip.share_token || 'public-link'}`
    : `http://localhost:3000/shared/${trip.share_token || 'public-link'}`;

  const handleTogglePublic = async () => {
    setToggling(true);
    const targetState = !isPublic;
    try {
      const res = await shareTrip(trip.id, targetState);
      setIsPublic(res.is_public);
      if (onTripUpdated) {
        onTripUpdated({ ...trip, is_public: res.is_public, share_token: res.share_token });
      }
    } catch (err: any) {
      console.warn('API shareTrip toggle failed, updating local state:', err.message);
      setIsPublic(targetState);
    } finally {
      setToggling(false);
    }
  };

  const handleCopy = () => {
    if (!isPublic) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '1.75rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Share2 size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Share Trip Itinerary</h3>
              <span style={{ fontSize: '0.78rem', color: isPublic ? 'var(--accent-teal)' : 'var(--accent-amber)', fontWeight: 600 }}>
                {isPublic ? '🌐 Publicly Accessible' : '🔒 Private (Only You)'}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Visibility Toggle Box */}
        <div style={{
          background: 'rgba(11, 15, 25, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.85rem',
          padding: '1rem 1.1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isPublic ? <Eye size={20} color="var(--accent-teal)" /> : <EyeOff size={20} color="var(--accent-amber)" />}
            <div>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>Public Visibility</h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isPublic ? 'Anyone with the link can view & copy' : 'Public sharing is disabled'}
              </p>
            </div>
          </div>

          <button 
            onClick={handleTogglePublic} 
            disabled={toggling}
            className={isPublic ? 'btn-primary' : 'btn-secondary'} 
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            {isPublic ? 'Disable Public' : 'Enable Public'}
          </button>
        </div>

        {/* Public Share Link Box */}
        {isPublic ? (
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
        ) : (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            padding: '0.85rem 1rem',
            borderRadius: '0.75rem',
            color: '#fda4af',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <Lock size={16} />
            <span>This trip is currently <b>PRIVATE</b>. Enable public sharing above to generate a shareable link.</span>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
}
