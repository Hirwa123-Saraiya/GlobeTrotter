'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, MapPin, DollarSign, Share2, Plus, Sparkles, 
  CheckCircle2, Heart, Copy, Edit3, Globe, ShieldCheck 
} from 'lucide-react';
import StopCard from '../../../components/StopCard';
import AddStopModal from '../../../components/AddStopModal';
import ShareModal from '../../../components/ShareModal';
import { Trip, TripStop } from '../../../types/trip';

const MOCK_TRIP: Trip = {
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
  health_score: 88
};

const INITIAL_MOCK_STOPS: TripStop[] = [
  { id: 101, trip_id: 1, city_name: 'Mumbai', arrival_date: '01/09/2026', departure_date: '03/09/2026', sequence_order: 1 },
  { id: 102, trip_id: 1, city_name: 'Goa', arrival_date: '03/09/2026', departure_date: '06/09/2026', sequence_order: 2 },
  { id: 103, trip_id: 1, city_name: 'Bengaluru', arrival_date: '06/09/2026', departure_date: '08/09/2026', sequence_order: 3 }
];

export default function TripDetailsPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<Trip>(MOCK_TRIP);
  const [stops, setStops] = useState<TripStop[]>(INITIAL_MOCK_STOPS);
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleAddStop = (newStopData: Omit<TripStop, 'id' | 'trip_id'>) => {
    const newStop: TripStop = {
      ...newStopData,
      id: Date.now(),
      trip_id: trip.id,
      sequence_order: stops.length + 1
    };
    setStops([...stops, newStop]);
  };

  const handleDeleteStop = (id: number) => {
    setStops(stops.filter(s => s.id !== id));
  };

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      {/* Back Button */}
      <Link href="/trips" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', fontWeight: 600 }}>
        <ArrowLeft size={16} />
        Back to My Trips
      </Link>

      {/* Hero Banner Header */}
      <div className="glass-card animate-slide-up" style={{ overflow: 'hidden', marginBottom: '2.5rem' }}>
        <div style={{ position: 'relative', height: '280px' }}>
          <img 
            src={trip.cover_image} 
            alt={trip.name} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(7, 9, 19, 0.95) 0%, rgba(7, 9, 19, 0.3) 60%, transparent 100%)'
          }} />

          {/* Share Button Overlay */}
          <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', gap: '0.6rem', zIndex: 2 }}>
            <button onClick={() => setIsShareModalOpen(true)} className="btn-secondary" style={{ background: 'rgba(7, 9, 19, 0.65)', backdropFilter: 'blur(10px)' }}>
              <Share2 size={16} />
              Share Public Link
            </button>
          </div>

          {/* Details Overlay */}
          <div style={{ position: 'absolute', bottom: '1.75rem', left: '2rem', right: '2rem', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.6rem' }}>
              <span className={`badge badge-${trip.status}`}>{trip.status}</span>
              <span style={{ background: 'rgba(245, 158, 11, 0.18)', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={13} color="var(--accent-amber)" />
                {trip.vibe}
              </span>
            </div>

            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', textShadow: '0 2px 8px rgba(0,0,0,0.6)', letterSpacing: '-0.02em' }}>
              {trip.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', fontSize: '0.92rem', color: 'rgba(255,255,255,0.92)', flexWrap: 'wrap', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} color="var(--accent-teal)" />
                <span>{trip.start_date} — {trip.end_date}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <DollarSign size={16} color="var(--accent-amber)" />
                <span>Budget: ₹{Number(trip.total_budget).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Body */}
        <div style={{ padding: '1.5rem 2rem', background: 'rgba(15, 23, 42, 0.6)' }}>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: '1.65' }}>
            {trip.description}
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '2rem' }}>
        {/* Left Column: City Stops Timeline */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={22} color="var(--accent-teal)" />
                City Stops Timeline
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Arrival & Departure dates in <b>DD/MM/YYYY</b> format</p>
            </div>

            <button onClick={() => setIsAddStopModalOpen(true)} className="btn-primary" style={{ padding: '0.65rem 1.2rem', fontSize: '0.9rem' }}>
              <Plus size={18} />
              Add City Stop
            </button>
          </div>

          {/* Stops Timeline List */}
          {stops.length > 0 ? (
            <div className="timeline-container">
              {stops.map((stop, index) => (
                <StopCard 
                  key={stop.id} 
                  stop={stop} 
                  index={index} 
                  onDeleteStop={handleDeleteStop} 
                />
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <MapPin size={36} color="var(--text-dim)" style={{ marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>No city stops added to this trip yet.</p>
              <button onClick={() => setIsAddStopModalOpen(true)} className="btn-secondary">
                <Plus size={18} />
                Add First Stop
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Trip Health & Insights */}
        <div>
          {/* Trip Health Score Box */}
          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.1rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={20} color="var(--accent-amber)" />
                Trip Health Score
              </h3>
              <span style={{
                background: 'rgba(20, 184, 166, 0.18)',
                color: '#2dd4bf',
                fontWeight: 800,
                fontSize: '1.15rem',
                padding: '0.35rem 0.85rem',
                borderRadius: '0.6rem',
                border: '1px solid rgba(20, 184, 166, 0.35)',
                boxShadow: '0 4px 12px rgba(20, 184, 166, 0.25)'
              }}>
                {trip.health_score || 88} / 100
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '6px', overflow: 'hidden', marginBottom: '1.25rem' }}>
              <div style={{ 
                width: `${trip.health_score || 88}%`, 
                height: '100%', 
                background: 'linear-gradient(90deg, #14b8a6 0%, #6366f1 100%)', 
                borderRadius: '6px',
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)'
              }} />
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--accent-teal)" />
                Dates formatted in <b>DD/MM/YYYY</b>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--accent-teal)" />
                <b>{stops.length}</b> City Stops Planned
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--accent-teal)" />
                Budget: <b>₹{Number(trip.total_budget).toLocaleString()}</b>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Stop Modal */}
      <AddStopModal 
        isOpen={isAddStopModalOpen} 
        onClose={() => setIsAddStopModalOpen(false)} 
        onAddStop={handleAddStop} 
      />

      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        trip={trip} 
        onClose={() => setIsShareModalOpen(false)} 
      />
    </div>
  );
}
