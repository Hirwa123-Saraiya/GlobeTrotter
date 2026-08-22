'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Calendar, MapPin, DollarSign, Share2, Plus, Sparkles, 
  CheckCircle2, ShieldCheck, RefreshCw, AlertCircle 
} from 'lucide-react';
import StopCard from '../../../components/StopCard';
import AddStopModal from '../../../components/AddStopModal';
import ActivityModal from '../../../components/AddActivityModal';
import ShareModal from '../../../components/ShareModal';
import DeleteConfirmModal from '../../../components/DeleteConfirmModal';
import { Trip, TripStop, ItineraryActivity } from '../../../types/trip';
import { getTripById, addStop, deleteStop, shareTrip, addActivity, updateActivity, deleteActivity } from '../../../lib/api';

export default function TripDetailsPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<TripStop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isAddStopModalOpen, setIsAddStopModalOpen] = useState(false);
  const [activeStopForActivity, setActiveStopForActivity] = useState<TripStop | null>(null);
  const [activityToEdit, setActivityToEdit] = useState<ItineraryActivity | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Delete confirmation targets
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'stop' | 'activity';
    id: number;
    title: string;
  } | null>(null);

  // Fetch Trip Details & Stops from API
  const fetchTripDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTrip = await getTripById(params.id);
      if (fetchedTrip && fetchedTrip.id) {
        setTrip(fetchedTrip);
        setStops(fetchedTrip.stops || []);
      } else {
        setError('Trip not found in database.');
      }
    } catch (err: any) {
      console.error('API getTripById failed:', err.message);
      setError(err.response?.data?.message || 'Failed to load trip from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripDetails();
  }, [params.id]);

  // Add Stop Handler
  const handleAddStop = async (newStopData: Omit<TripStop, 'id' | 'trip_id'>) => {
    if (!trip) return;
    try {
      const createdStop = await addStop(trip.id, newStopData);
      setStops([...stops, { ...createdStop, activities: [] }]);
    } catch (err: any) {
      alert('Failed to add stop: ' + (err.response?.data?.message || err.message));
    }
  };

  // Save (Add or Update) Activity Handler
  const handleSaveActivity = async (activityData: Omit<ItineraryActivity, 'id'>, activityId?: number) => {
    try {
      if (activityId) {
        // Edit Mode
        const updated = await updateActivity(activityId, activityData);
        setStops(stops.map(stop => {
          if (stop.activities?.some(a => a.id === activityId)) {
            return {
              ...stop,
              activities: stop.activities.map(a => a.id === activityId ? updated : a)
            };
          }
          return stop;
        }));
      } else {
        // Add Mode
        const createdActivity = await addActivity(activityData);
        setStops(stops.map(stop => {
          if (stop.id === activityData.trip_stop_id) {
            const currentActivities = stop.activities || [];
            return {
              ...stop,
              activities: [...currentActivities, createdActivity]
            };
          }
          return stop;
        }));
      }
    } catch (err: any) {
      alert('Failed to save activity: ' + (err.response?.data?.message || err.message));
    }
  };

  // Confirmed Delete Execution
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'stop') {
        await deleteStop(deleteTarget.id);
        setStops(stops.filter(s => s.id !== deleteTarget.id));
      } else if (deleteTarget.type === 'activity') {
        await deleteActivity(deleteTarget.id);
        setStops(stops.map(stop => {
          if (stop.activities?.some(a => a.id === deleteTarget.id)) {
            return {
              ...stop,
              activities: stop.activities.filter(a => a.id !== deleteTarget.id)
            };
          }
          return stop;
        }));
      }
    } catch (err: any) {
      alert('Failed to delete item: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleteTarget(null);
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1140px', margin: '4rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} className="spin" style={{ marginBottom: '1rem' }} />
        <p>Loading trip details from database...</p>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '3rem 2rem' }}>
          <AlertCircle size={40} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{error || 'Trip Not Found'}</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            The requested travel itinerary does not exist in the database or requires authentication.
          </p>
          <Link href="/trips" className="btn-primary">
            <ArrowLeft size={16} />
            Return to My Trips
          </Link>
        </div>
      </div>
    );
  }

  // Calculate total scheduled activities count
  const totalActivitiesCount = stops.reduce((sum, s) => sum + (s.activities ? s.activities.length : 0), 0);

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
            src={trip.cover_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'} 
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
              <span className={`badge badge-${trip.status || 'planning'}`}>{trip.status}</span>
              <span style={{ background: 'rgba(245, 158, 11, 0.18)', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={13} color="var(--accent-amber)" />
                {trip.vibe || 'Balanced'}
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
                <span>Budget: ₹{Number(trip.total_budget || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description Body */}
        <div style={{ padding: '1.5rem 2rem', background: 'rgba(15, 23, 42, 0.6)' }}>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', lineHeight: '1.65' }}>
            {trip.description || 'No description provided.'}
          </p>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '2rem' }}>
        {/* Left Column: City Stops & Activities Timeline */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={22} color="var(--accent-teal)" />
                City Stops & Day-wise Activities Timeline
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>Arrival, departure, and activity dates in <b>DD/MM/YYYY</b> format</p>
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
                  onDeleteStop={(stopId) => setDeleteTarget({ type: 'stop', id: stopId, title: `Remove "${stop.city_name}" Stop?` })}
                  onOpenAddActivityModal={(selectedStop) => {
                    setActivityToEdit(null);
                    setActiveStopForActivity(selectedStop);
                  }}
                  onOpenEditActivityModal={(selectedActivity) => {
                    setActivityToEdit(selectedActivity);
                    setActiveStopForActivity(null);
                  }}
                  onDeleteActivity={(actId) => setDeleteTarget({ type: 'activity', id: actId, title: 'Delete Scheduled Activity?' })}
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
                <b>{totalActivitiesCount}</b> Day Activities Scheduled
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--accent-teal)" />
                Budget: <b>₹{Number(trip.total_budget || 0).toLocaleString()}</b>
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

      {/* Add / Edit Activity Modal */}
      <ActivityModal
        isOpen={!!activeStopForActivity || !!activityToEdit}
        tripStop={activeStopForActivity}
        activityToEdit={activityToEdit}
        onClose={() => {
          setActiveStopForActivity(null);
          setActivityToEdit(null);
        }}
        onSaveActivity={handleSaveActivity}
      />

      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen} 
        trip={trip} 
        onClose={() => setIsShareModalOpen(false)} 
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title={deleteTarget?.title || 'Confirm Deletion'}
        message={
          deleteTarget?.type === 'stop'
            ? 'Are you sure you want to remove this city stop and all its scheduled activities? This action cannot be undone.'
            : 'Are you sure you want to delete this scheduled activity? This action cannot be undone.'
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
