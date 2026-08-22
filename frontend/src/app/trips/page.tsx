'use client';

import React, { useState } from 'react';
import { Plus, Search, Compass, Sparkles, MapPin, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import TripCard from '../../components/TripCard';
import CreateTripModal from '../../components/CreateTripModal';
import ShareModal from '../../components/ShareModal';
import { Trip } from '../../types/trip';

const INITIAL_MOCK_TRIPS: Trip[] = [
  {
    id: 1,
    user_id: 1,
    name: 'Coastal India Odyssey',
    description: 'An 8-day coastal journey across Mumbai, Goa beaches, and Bengaluru tech hub.',
    cover_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
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
  },
  {
    id: 2,
    user_id: 1,
    name: 'Rajasthan Heritage Circuit',
    description: 'Exploring fortresses, palaces, and desert dunes across Jaipur and Udaipur.',
    cover_image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    start_date: '15/10/2026',
    end_date: '22/10/2026',
    total_budget: 45000,
    vibe: 'Culture & Heritage',
    status: 'ongoing',
    is_public: false,
    share_token: 'rajasthan-heritage-1a2b',
    stops: [
      { id: 104, trip_id: 2, city_name: 'Jaipur', arrival_date: '15/10/2026', departure_date: '18/10/2026', sequence_order: 1 },
      { id: 105, trip_id: 2, city_name: 'Udaipur', arrival_date: '18/10/2026', departure_date: '22/10/2026', sequence_order: 2 }
    ]
  },
  {
    id: 3,
    user_id: 1,
    name: 'Himalayan Mountain Escape',
    description: 'Scenic valleys, mountain passes, and peaceful retreats in Himachal Pradesh.',
    cover_image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    start_date: '10/11/2026',
    end_date: '17/11/2026',
    total_budget: 35000,
    vibe: 'Adventure & Nature',
    status: 'completed',
    is_public: true,
    share_token: 'himalayan-escape-3c4d',
    stops: [
      { id: 106, trip_id: 3, city_name: 'Manali', arrival_date: '10/11/2026', departure_date: '14/11/2026', sequence_order: 1 },
      { id: 107, trip_id: 3, city_name: 'Shimla', arrival_date: '14/11/2026', departure_date: '17/11/2026', sequence_order: 2 }
    ]
  }
];

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>(INITIAL_MOCK_TRIPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeShareTrip, setActiveShareTrip] = useState<Trip | null>(null);

  // Filter trips
  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          trip.vibe.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || trip.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate Summary Stats
  const totalBudgetCombined = trips.reduce((sum, t) => sum + (t.total_budget || 0), 0);
  const totalStopsCombined = trips.reduce((sum, t) => sum + (t.stops ? t.stops.length : 0), 0);

  const handleCreateTrip = (newTripData: Omit<Trip, 'id' | 'user_id' | 'share_token'>) => {
    const newTrip: Trip = {
      ...newTripData,
      id: Date.now(),
      user_id: 1,
      share_token: `trip-${Date.now()}`,
      stops: []
    };
    setTrips([newTrip, ...trips]);
  };

  const handleDeleteTrip = (id: number) => {
    if (confirm('Are you sure you want to delete this trip?')) {
      setTrips(trips.filter(t => t.id !== id));
    }
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

        <button onClick={() => setIsCreateModalOpen(true)} className="btn-primary" style={{ padding: '0.85rem 1.6rem', fontSize: '0.95rem' }}>
          <Plus size={20} />
          Plan New Trip
        </button>
      </div>

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
      {filteredTrips.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))', gap: '2rem' }}>
          {filteredTrips.map(trip => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              onDelete={handleDeleteTrip} 
              onShare={(t) => setActiveShareTrip(t)} 
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
            No travel plans match your search or status filter. Start by creating a new personalized itinerary.
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
      />
    </div>
  );
}
