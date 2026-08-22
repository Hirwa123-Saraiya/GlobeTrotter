import React from 'react';
import { Calendar, Trash2, Edit2, MapPin, Plus, Clock, DollarSign, Sparkles, FileText } from 'lucide-react';
import { TripStop, ItineraryActivity } from '../types/trip';
import { formatToDDMMYYYY } from '../lib/dateFormatter';

interface StopCardProps {
  stop: TripStop;
  index: number;
  onDeleteStop?: (id: number) => void;
  onOpenAddActivityModal?: (stop: TripStop) => void;
  onOpenEditActivityModal?: (activity: ItineraryActivity) => void;
  onDeleteActivity?: (activityId: number) => void;
}

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  'Sightseeing': { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)' },
  'Food & Dining': { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)' },
  'Adventure': { bg: 'rgba(244, 63, 94, 0.15)', color: '#fda4af', border: 'rgba(244, 63, 94, 0.3)' },
  'Culture & Heritage': { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)' },
  'Relaxation': { bg: 'rgba(20, 184, 166, 0.15)', color: '#2dd4bf', border: 'rgba(20, 184, 166, 0.3)' },
  'Shopping': { bg: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
  'Transport': { bg: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: 'rgba(148, 163, 184, 0.3)' }
};

export default function StopCard({ 
  stop, 
  index, 
  onDeleteStop, 
  onOpenAddActivityModal,
  onOpenEditActivityModal,
  onDeleteActivity 
}: StopCardProps) {
  const arrivalFormatted = formatToDDMMYYYY(stop.arrival_date);
  const departureFormatted = formatToDDMMYYYY(stop.departure_date);
  const activities = stop.activities || [];

  return (
    <div className="timeline-item animate-slide-up">
      <div className="timeline-node">
        {index + 1}
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', width: '100%' }}>
        {/* Stop Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={18} color="var(--accent-teal)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{stop.city_name}</h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <Calendar size={13} color="var(--primary)" />
              <span>{arrivalFormatted} — {departureFormatted}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onOpenAddActivityModal && (
              <button 
                onClick={() => onOpenAddActivityModal(stop)} 
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              >
                <Plus size={15} />
                Add Activity
              </button>
            )}
            {onDeleteStop && (
              <button 
                onClick={() => onDeleteStop(stop.id)} 
                style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', opacity: 0.8 }}
                title="Remove Stop"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Activities Section */}
        {activities.length > 0 ? (
          <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SCHEDULED DAY ACTIVITIES ({activities.length})
            </span>

            {activities.map((act) => {
              const catStyle = CATEGORY_COLORS[act.category || 'Sightseeing'] || CATEGORY_COLORS['Sightseeing'];
              return (
                <div 
                  key={act.id} 
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-card)',
                    borderRadius: '0.75rem',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                  className="activity-card-hover"
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: catStyle.bg,
                        color: catStyle.color,
                        border: `1px solid ${catStyle.border}`,
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.55rem',
                        borderRadius: '9999px'
                      }}>
                        {act.category || 'Sightseeing'}
                      </span>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)' }}>{act.custom_title}</h4>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={13} color="var(--accent-teal)" />
                        {formatToDDMMYYYY(act.scheduled_date)}
                      </span>
                      {(act.start_time || act.end_time) && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={13} color="var(--primary)" />
                          {act.start_time}{act.end_time ? ` - ${act.end_time}` : ''}
                        </span>
                      )}
                      {Number(act.custom_cost || 0) > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-amber)', fontWeight: 600 }}>
                          <DollarSign size={13} color="var(--accent-amber)" />
                          ₹{Number(act.custom_cost).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {act.notes && (
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <FileText size={12} />
                        {act.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions (Edit & Delete) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {onOpenEditActivityModal && (
                      <button 
                        onClick={() => onOpenEditActivityModal(act)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.35rem' }}
                        title="Edit activity"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                    {onDeleteActivity && (
                      <button 
                        onClick={() => onDeleteActivity(act.id)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.35rem' }}
                        title="Delete activity"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{
            marginTop: '1rem',
            padding: '0.85rem 1rem',
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-card)',
            borderRadius: '0.75rem',
            textAlign: 'center',
            fontSize: '0.82rem',
            color: 'var(--text-dim)'
          }}>
            No activities scheduled for this city stop yet. Click <b>+ Add Activity</b> above!
          </div>
        )}
      </div>
    </div>
  );
}
