import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, DollarSign, Share2, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { Trip } from '../types/trip';
import { formatToDDMMYYYY } from '../lib/dateFormatter';

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: number) => void;
  onShare?: (trip: Trip) => void;
}

export default function TripCard({ trip, onDelete, onShare }: TripCardProps) {
  const formattedStart = formatToDDMMYYYY(trip.start_date);
  const formattedEnd = formatToDDMMYYYY(trip.end_date);
  const stopCount = trip.stops ? trip.stops.length : 0;

  return (
    <div className="glass-card animate-slide-up" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Cover Image Header */}
      <div style={{ position: 'relative', height: '190px', overflow: 'hidden' }}>
        <img 
          src={trip.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'} 
          alt={trip.name} 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' 
          }}
          className="trip-card-img"
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(7, 9, 19, 0.95) 0%, rgba(7, 9, 19, 0.2) 60%, transparent 100%)'
        }} />

        {/* Status Badge */}
        <div style={{ position: 'absolute', top: '0.85rem', right: '0.85rem', zIndex: 2 }}>
          <span className={`badge badge-${trip.status}`}>
            {trip.status}
          </span>
        </div>

        {/* Vibe Badge */}
        {trip.vibe && (
          <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', zIndex: 2 }}>
            <span style={{
              background: 'rgba(7, 9, 19, 0.75)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.3rem 0.7rem',
              borderRadius: '0.6rem',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
            }}>
              <Sparkles size={13} color="var(--accent-amber)" />
              {trip.vibe}
            </span>
          </div>
        )}

        {/* Title & Dates Overlay */}
        <div style={{ position: 'absolute', bottom: '0.85rem', left: '1.1rem', right: '1.1rem', zIndex: 2 }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.2rem', textShadow: '0 2px 8px rgba(0,0,0,0.6)', letterSpacing: '-0.01em' }}>
            {trip.name}
          </h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
            <Calendar size={14} color="var(--accent-teal)" />
            <span>{formattedStart} — {formattedEnd}</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.2rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {trip.description || 'No description provided for this travel itinerary.'}
        </p>

        {/* Stats Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.75rem',
          background: 'rgba(11, 15, 25, 0.6)',
          padding: '0.75rem 0.9rem',
          borderRadius: '0.75rem',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          marginBottom: '1.2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={16} color="var(--primary)" />
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.05em' }}>CITY STOPS</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>{stopCount} {stopCount === 1 ? 'City' : 'Cities'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '6px', background: 'rgba(20, 184, 166, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={16} color="var(--accent-teal)" />
            </div>
            <div>
              <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-dim)', fontWeight: 600, letterSpacing: '0.05em' }}>BUDGET</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff' }}>₹{Number(trip.total_budget || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.6rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {onShare && (
              <button 
                onClick={() => onShare(trip)} 
                title="Share Public Link"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-muted)',
                  padding: '0.5rem',
                  borderRadius: '0.6rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Share2 size={16} />
              </button>
            )}
            {onDelete && (
              <button 
                onClick={() => onDelete(trip.id)} 
                title="Delete Trip"
                style={{
                  background: 'rgba(244, 63, 94, 0.1)',
                  border: '1px solid rgba(244, 63, 94, 0.2)',
                  color: 'var(--accent-rose)',
                  padding: '0.5rem',
                  borderRadius: '0.6rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <Link href={`/trips/${trip.id}`} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 0.95rem' }}>
            View Details
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
