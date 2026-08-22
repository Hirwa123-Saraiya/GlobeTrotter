'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { inputDateToDDMMYYYY } from '../../lib/dateFormatter';

const DEFAULT_COVERS = [
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80'
];

export default function CreateTripPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState('50000');
  const [vibe, setVibe] = useState('Balanced');
  const [coverImage, setCoverImage] = useState(DEFAULT_COVERS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) return;

    // Redirect to trips page
    router.push('/trips');
  };

  return (
    <div style={{ maxWidth: '680px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
      <Link href="/trips" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        <ArrowLeft size={16} />
        Back to My Trips
      </Link>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={22} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create New Travel Plan</h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Enter your trip details (Dates in DD/MM/YYYY format)</p>
          </div>
        </div>

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
              placeholder="Brief summary of your travel journey..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          {/* Dates Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Date * (DD/MM/YYYY)</label>
              <input 
                type="date" 
                className="form-input" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>End Date * (DD/MM/YYYY)</label>
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
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label>Cover Photo</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginTop: '0.4rem' }}>
              {DEFAULT_COVERS.map((url, i) => (
                <div 
                  key={i} 
                  onClick={() => setCoverImage(url)} 
                  style={{
                    height: '64px',
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <Link href="/trips" className="btn-secondary">Cancel</Link>
            <button type="submit" className="btn-primary" style={{ padding: '0.75rem 1.75rem' }}>Save & Build Itinerary</button>
          </div>
        </form>
      </div>
    </div>
  );
}
