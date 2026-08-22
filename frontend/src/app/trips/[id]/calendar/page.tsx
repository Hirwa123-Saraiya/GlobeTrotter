'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Calendar as CalendarIcon, MapPin, Clock, DollarSign, 
  Sparkles, RefreshCw, ChevronLeft, ChevronRight, PieChart 
} from 'lucide-react';
import { Trip, TripStop, ItineraryActivity } from '../../../../types/trip';
import { getTripById } from '../../../../lib/api';

export default function TripCalendarPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTripData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTrip = await getTripById(params.id);
      if (fetchedTrip && fetchedTrip.id) {
        setTrip(fetchedTrip);
        setStops(fetchedTrip.stops || []);
      } else {
        setError('Trip not found.');
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        router.push('/login');
        return;
      }
      setError(err.response?.data?.message || 'Failed to load trip calendar.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripData();
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ maxWidth: '1140px', margin: '4rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} className="spin" style={{ marginBottom: '1rem' }} />
        <p>Loading itinerary calendar visualizer...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '3rem 2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem' }}>{error || 'Calendar Not Found'}</h2>
          <Link href="/trips" className="btn-primary">
            <ArrowLeft size={16} />
            Back to Trips
          </Link>
        </div>
      </div>
    );
  }

  // Extract all activities across all stops
  const allActivities: ItineraryActivity[] = stops.flatMap(s => s.activities || []);

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '2rem 1.5rem 5rem' }}>
      {/* Back Link */}
      <Link href={`/trips/${trip.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', fontWeight: 600 }}>
        <ArrowLeft size={16} />
        Back to {trip.name} Details
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <Sparkles size={14} />
            Calendar & Timeline Visualizer
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {trip.name} — Itinerary Calendar
          </h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Date Range: <b>{trip.start_date}</b> — <b>{trip.end_date}</b> (DD/MM/YYYY)
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href={`/trips/${trip.id}/budget`} className="btn-secondary">
            <PieChart size={16} />
            Budget View
          </Link>
        </div>
      </div>

      {/* Timeline Stops Banner */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={18} color="var(--accent-teal)" />
          Scheduled City Stops Sequence ({stops.length} Cities)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {stops.map((stop, idx) => (
            <div 
              key={stop.id} 
              style={{
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                borderRadius: '0.85rem',
                padding: '0.85rem 1rem'
              }}
            >
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                STOP {idx + 1}
              </span>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', margin: '0.15rem 0' }}>
                {stop.city_name}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {stop.arrival_date} — {stop.departure_date}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Day-by-Day Activity Calendar Feed */}
      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CalendarIcon size={20} color="var(--primary)" />
        Scheduled Day-by-Day Activities Schedule
      </h3>

      {allActivities.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {allActivities.map((act) => (
            <div 
              key={act.id} 
              className="glass-card activity-card-hover" 
              style={{ padding: '1.15rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                  <span style={{
                    background: 'rgba(20, 184, 166, 0.15)',
                    color: 'var(--accent-teal)',
                    border: '1px solid rgba(20, 184, 166, 0.3)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px'
                  }}>
                    {act.category || 'Sightseeing'}
                  </span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>{act.custom_title}</h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CalendarIcon size={14} color="var(--primary)" />
                    {act.scheduled_date}
                  </span>
                  {(act.start_time || act.end_time) && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={14} color="var(--accent-teal)" />
                      {act.start_time}{act.end_time ? ` - ${act.end_time}` : ''}
                    </span>
                  )}
                </div>
              </div>

              {Number(act.custom_cost || 0) > 0 && (
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block' }}>EST. COST</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    ₹{Number(act.custom_cost).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p>No day activities scheduled yet. Open trip details to add day activities to city stops!</p>
        </div>
      )}
    </div>
  );
}
