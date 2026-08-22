'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Compass, Sparkles, MapPin, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';
import TripCard from '../../components/TripCard';
import CreateTripModal from '../../components/CreateTripModal';
import ShareModal from '../../components/ShareModal';
import DeleteConfirmModal from '../../components/DeleteConfirmModal';
import { Trip } from '../../types/trip';
import { getTrips, createTrip, deleteTrip } from '../../lib/api';

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeShareTrip, setActiveShareTrip] = useState<Trip | null>(null);
  const [deleteTripIdTarget, setDeleteTripIdTarget] = useState<number | null>(null);

  // Fetch Real Trips from Backend Database API
  const fetchTripsFromApi = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedTrips = await getTrips();
      if (Array.isArray(fetchedTrips)) {
        setTrips(fetchedTrips);
      } else {
        setTrips([]);
      }
    } catch (err: any) {
      console.error('Failed to fetch trips from API:', err.message);
      setError('Please log in to view your real database trips.');
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripsFromApi();
  }, []);

  // Filter trips by search query & status
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = (trip.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (trip.vibe || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || trip.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Summary Stats
  const totalBudgetCombined = trips.reduce((sum, t) => sum + (Number(t.total_budget) || 0), 0);
  const totalStopsCombined = trips.reduce((sum, t) => sum + (t.stops ? t.stops.length : 0), 0);

  // Create Trip Handler
  const handleCreateTrip = async (newTripData: Omit<Trip, 'id' | 'user_id' | 'share_token'>) => {
    try {
      const created = await createTrip(newTripData);
      setTrips([created, ...trips]);
    } catch (err: any) {
      alert('Failed to create trip: ' + (err.response?.data?.message || err.message));
    }
  };

  // Confirm & Delete Trip Handler
  const handleConfirmDeleteTrip = async () => {
    if (!deleteTripIdTarget) return;
    try {
      await deleteTrip(deleteTripIdTarget);
      setTrips(trips.filter(t => t.id !== deleteTripIdTarget));
    } catch (err: any) {
      alert('Failed to delete trip: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleteTripIdTarget(null);
    }
  };

  // Open Share Modal
  const handleShareTripClick = (trip: Trip) => {
    setActiveShareTrip(trip);
  };

  // Handle Trip Updates from Share Modal
  const handleTripUpdated = (updatedTrip: Trip) => {
    setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
    setActiveShareTrip(updatedTrip);
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
            <Sparkles size={14} />
            GlobeTrotter Workspace
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
            My Travel Itineraries
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            Design, visualize, and budget your trips (Dates in <b>DD/MM/YYYY</b> format).
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={fetchTripsFromApi} className="btn-secondary" title="Sync with Backend Database" style={{ padding: '0.7rem' }}>
            <RefreshCw size={18} className={loading ? 'spin' : ''} />
          </button>

          <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary" style={{ padding: '0.85rem 1.6rem', fontSize: '0.95rem' }}>
            <Plus size={20} />
            Plan New Trip
          </button>
        </div>
      </div>

      {/* Auth Alert Notice */}
      {error && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          padding: '0.75rem 1.25rem',
          borderRadius: '0.75rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          fontSize: '0.88rem',
          color: '#fbbf24'
        }}>
          <AlertCircle size={18} />
          <span><b>Authentication Required:</b> Please log in via <b>http://localhost:5000/api-docs</b> to view and manage your real database trips.</span>
        </div>
      )}

      {/* Overview Stat Widgets Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.18)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Compass size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL TRIPS</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{trips.length}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(20, 184, 166, 0.18)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PLANNED CITIES</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{totalStopsCombined}</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.18)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>TOTAL BUDGET</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>₹{totalBudgetCombined.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '340px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search trips by title or vibe..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.75rem', width: '100%' }}
          />
        </div>

        {/* Status Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(11, 15, 25, 0.7)', padding: '0.35rem', borderRadius: '0.85rem', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
          {['all', 'planning', 'ongoing', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              style={{
                background: selectedStatus === status ? 'var(--primary)' : 'transparent',
                color: selectedStatus === status ? '#ffffff' : 'var(--text-muted)',
                padding: '0.45rem 1rem',
                borderRadius: '0.65rem',
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                textTransform: 'capitalize',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: selectedStatus === status ? '0 4px 12px rgba(99, 102, 241, 0.4)' : 'none'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="spin" style={{ marginBottom: '0.75rem' }} />
          <p>Loading database itineraries...</p>
        </div>
      ) : filteredTrips.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '2rem' }}>
          {filteredTrips.map(trip => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              onDelete={(id) => setDeleteTripIdTarget(id)} 
              onShare={handleShareTripClick} 
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card animate-slide-up" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: '520px', margin: '3rem auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 8px 20px rgba(99, 102, 241, 0.25)' }}>
            <Compass size={32} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Trips Found</h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: '1.5' }}>
            {trips.length === 0 
              ? 'You have no trips in your database. Click below to create your first itinerary!'
              : 'No travel plans match your search filter.'}
          </p>
          <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary" style={{ padding: '0.85rem 1.6rem' }}>
            <Plus size={20} />
            Create First Trip
          </button>
        </div>
      )}

      {/* Create Trip Modal */}
      <CreateTripModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateTrip} 
      />

      {/* Share Modal */}
      <ShareModal 
        isOpen={!!activeShareTrip} 
        trip={activeShareTrip} 
        onClose={() => setActiveShareTrip(null)} 
        onTripUpdated={handleTripUpdated}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTripIdTarget}
        title="Delete Trip Itinerary?"
        message="Are you sure you want to delete this trip and all its associated city stops and day activities? This action cannot be undone."
        onClose={() => setDeleteTripIdTarget(null)}
        onConfirm={handleConfirmDeleteTrip}
      />
    </div>
  );
}
