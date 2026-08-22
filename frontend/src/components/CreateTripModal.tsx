import React, { useState } from 'react';
import { X, Calendar, Compass, DollarSign, Sparkles, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Trip } from '../types/trip';
import { inputDateToDDMMYYYY } from '../lib/dateFormatter';

interface CreateTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trip: Omit<Trip, 'id' | 'user_id' | 'share_token'>) => void;
}

const DEFAULT_COVERS = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80'
];

export default function CreateTripModal({ isOpen, onClose, onSubmit }: CreateTripModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('50000');
  const [vibe, setVibe] = useState('Balanced');
  const [coverImage, setCoverImage] = useState(DEFAULT_COVERS[0]);
  const [dateError, setDateError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDateError(null);

    if (!name || !startDate || !endDate) return;

    if (new Date(endDate) < new Date(startDate)) {
      setDateError('End date must be on or after the start date.');
      return;
    }

    const parsedBudget = Math.max(0, parseFloat(budget) || 0);

    onSubmit({
      name,
      description,
      start_date: inputDateToDDMMYYYY(startDate),
      end_date: inputDateToDDMMYYYY(endDate),
      total_budget: parsedBudget,
      vibe,
      status: 'planning',
      is_public: false,
      cover_image: coverImage
    });

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card" style={{ width: '100%', maxWidth: '540px', padding: '1.75rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '0.85rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Compass size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Plan a New Trip</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Enter your trip itinerary details</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Validation Alert */}
        {dateError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', marginBottom: '1rem', fontSize: '0.82rem', fontWeight: 600 }}>
            <AlertCircle size={16} />
            {dateError}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Trip Title *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Coastal India Escape 🌴" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Trip Description</label>
            <textarea 
              className="form-input" 
              rows={3} 
              placeholder="Brief description of your itinerary..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          {/* Dates Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Date *</label>
              <input 
                type="date" 
                className="form-input" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input 
                type="date" 
                className="form-input" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Budget & Vibe Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Total Budget (₹)</label>
              <input 
                type="number" 
                min="0"
                className="form-input" 
                placeholder="50000" 
                value={budget} 
                onChange={(e) => setBudget(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>Trip Vibe</label>
              <select className="form-input" value={vibe} onChange={(e) => setVibe(e.target.value)}>
                <option value="Balanced">Balanced</option>
                <option value="Food & Culture">Food & Culture</option>
                <option value="Adventure">Adventure</option>
                <option value="Beach & Relaxation">Beach & Relaxation</option>
                <option value="Nightlife">Nightlife</option>
              </select>
            </div>
          </div>

          {/* Cover Picker */}
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Cover Photo</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '0.3rem' }}>
              {DEFAULT_COVERS.map((url, i) => (
                <div 
                  key={i} 
                  onClick={() => setCoverImage(url)} 
                  style={{
                    height: '54px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: coverImage === url ? '2px solid var(--primary)' : '2px solid transparent',
                    opacity: coverImage === url ? 1 : 0.6,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <img src={url} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Create Itinerary</button>
          </div>
        </form>
      </div>
    </div>
  );
}
