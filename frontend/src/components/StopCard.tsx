import React from 'react';
import { MapPin, Calendar, Trash2 } from 'lucide-react';
import { TripStop } from '../types/trip';
import { formatToDDMMYYYY } from '../lib/dateFormatter';

interface StopCardProps {
  stop: TripStop;
  index: number;
  onDeleteStop?: (id: number) => void;
}

export default function StopCard({ stop, index, onDeleteStop }: StopCardProps) {
  const formattedArrival = formatToDDMMYYYY(stop.arrival_date);
  const formattedDeparture = formatToDDMMYYYY(stop.departure_date);

  return (
    <div className="glass-card" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Sequence Badge */}
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '0.95rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(20, 184, 166, 0.3)'
        }}>
          {index + 1}
        </div>

        {/* Info */}
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={16} color="var(--accent-teal)" />
            {stop.city_name}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            <Calendar size={14} color="var(--primary)" />
            <span>{formattedArrival} — {formattedDeparture}</span>
          </div>
        </div>
      </div>

      {/* Delete trigger */}
      {onDeleteStop && (
        <button 
          onClick={() => onDeleteStop(stop.id)} 
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            color: 'var(--accent-rose)',
            padding: '0.45rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Remove Stop"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
}
