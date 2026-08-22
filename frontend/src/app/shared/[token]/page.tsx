'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Calendar, MapPin, DollarSign, Copy, Check, Sparkles, ArrowRight } from 'lucide-react';
import { Trip } from '../../../types/trip';

const MOCK_SHARED_TRIP: Trip = {
  id: 1,
  user_id: 1,
  name: 'Coastal India Odyssey',
  description: 'An 8-day coastal journey across Mumbai, Goa beaches, and Bengaluru tech hub.',
  cover_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
  start_date: '01/09/2026',
  end_date: '08/09/2026',
  total_budget: 60000,
  vibe: 'Food & Beach',
  status: 'planning',
  is_public: true,
  share_token: 'coastal-odyssey-8f72',
  stops: [
    { id: 101, trip_id: 1, city_name: 'Mumbai', arrival_date: '01/09/2026', departure_date: '03/09/2026', sequence_order: 1 },
    { id: 102, trip_id: 1, city_name: 'Goa', arrival_date: '03/09/2026', departure_date: '06/09/2026', sequence_order: 2 },
    { id: 103, trip_id: 1, city_name: 'Bengaluru', arrival_date: '06/09/2026', departure_date: '08/09/2026', sequence_order: 3 }
  ]
};

export default function PublicSharedTripPage({ params }: { params: { token: string } }) {
  const [trip] = useState<Trip>(MOCK_SHARED_TRIP);
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const handleCopyTrip = () => {
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '2rem auto', padding: '0 1.5rem 4rem' }}>
      {/* Banner Notice */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.12)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        padding: '0.85rem 1.25rem',
        borderRadius: '0.85rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Sparkles size={18} color="var(--primary)" />
          <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
            You are viewing a shared itinerary on <b>GlobeTrotter</b>.
          </span>
        </div>

        <button onClick={handleCopyTrip} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          {copiedSuccess ? <Check size={16} /> : <Copy size={16} />}
          {copiedSuccess ? 'Cloned to Your Account!' : 'Copy This Trip'}
        </button>
      </div>

      {/* Main Hero Card */}
      <div className="glass-card" style={{ overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', height: '240px' }}>
          <img src={trip.cover_image} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(11, 15, 25, 0.95) 0%, transparent 100%)'
          }} />

          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }}>
            <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '0.2rem 0.65rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 600, display: 'inline-block', marginBottom: '0.5rem' }}>
              ✨ {trip.vibe}
            </span>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>{trip.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.3rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calendar size={14} color="var(--accent-teal)" />
                {trip.start_date} — {trip.end_date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <DollarSign size={14} color="var(--accent-amber)" />
                Est. Budget: ₹{Number(trip.total_budget).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div style={{ padding: '1.5rem', background: 'rgba(18, 24, 38, 0.5)' }}>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{trip.description}</p>
        </div>
      </div>

      {/* Stops Timeline */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MapPin size={20} color="var(--accent-teal)" />
        Itinerary City Stops (DD/MM/YYYY)
      </h2>

      <div>
        {trip.stops?.map((stop, index) => (
          <div key={stop.id} className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.85rem' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
              color: '#ffffff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {index + 1}
            </div>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{stop.city_name}</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {stop.arrival_date} — {stop.departure_date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
