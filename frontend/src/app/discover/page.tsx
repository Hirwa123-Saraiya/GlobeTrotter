'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, MapPin, Compass, Sparkles, DollarSign, Plus, Check, 
  Calendar, Clock, Filter, ArrowRight, RefreshCw 
} from 'lucide-react';
import { getCities, getActivities, getTrips, addStop } from '../../lib/api';
import { Trip } from '../../types/trip';

export default function DiscoverPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'cities' | 'activities'>('cities');
  const [cities, setCities] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  // Add city to trip modal state
  const [selectedCityForTrip, setSelectedCityForTrip] = useState<any | null>(null);
  const [targetTripId, setTargetTripId] = useState<string>('');
  const [arrivalDate, setArrivalDate] = useState<string>('2026-09-01');
  const [departureDate, setDepartureDate] = useState<string>('2026-09-03');
  const [addingStop, setAddingStop] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [citiesData, activitiesData, userTrips] = await Promise.all([
        getCities(searchQuery, selectedCategory),
        getActivities(searchQuery, selectedCategory),
        getTrips().catch(() => [])
      ]);
      setCities(citiesData);
      setActivities(activitiesData);
      setTrips(userTrips);
      if (userTrips.length > 0) {
        setTargetTripId(String(userTrips[0].id));
      }
    } catch (err) {
      console.error('Error fetching discovery data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchQuery, selectedCategory]);

  const handleConfirmAddStop = async () => {
    if (!selectedCityForTrip || !targetTripId) return;
    setAddingStop(true);
    try {
      // Format HTML date (YYYY-MM-DD) to DD/MM/YYYY
      const partsArr = arrivalDate.split('-');
      const formattedArr = partsArr.length === 3 ? `${partsArr[2]}/${partsArr[1]}/${partsArr[0]}` : arrivalDate;

      const partsDep = departureDate.split('-');
      const formattedDep = partsDep.length === 3 ? `${partsDep[2]}/${partsDep[1]}/${partsDep[0]}` : departureDate;

      await addStop(targetTripId, {
        city_name: selectedCityForTrip.name,
        arrival_date: formattedArr,
        departure_date: formattedDep
      });

      setSuccessToast(`Added ${selectedCityForTrip.name} to trip!`);
      setSelectedCityForTrip(null);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: any) {
      alert('Failed to add stop: ' + (err.response?.data?.message || err.message));
    } finally {
      setAddingStop(false);
    }
  };

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.5rem 5rem' }}>
      {/* Toast Notice */}
      {successToast && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 1000,
          background: 'var(--accent-teal)',
          color: '#ffffff',
          padding: '0.85rem 1.4rem',
          borderRadius: '0.75rem',
          fontWeight: 700,
          boxShadow: '0 8px 24px rgba(20, 184, 166, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Check size={18} />
          {successToast}
        </div>
      )}

      {/* Header Banner */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '0.35rem 0.95rem', borderRadius: '9999px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.85rem', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <Sparkles size={15} color="var(--accent-amber)" />
          Explore & Discover Catalog
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
          Discover Travel Cities & Activities
        </h1>
        <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', marginTop: '0.35rem', maxWidth: '640px', margin: '0.35rem auto 0' }}>
          Search global destination hubs, browse curated activity recommendations, and add them directly to your itineraries.
        </p>
      </div>

      {/* Toolbar & Search */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1.25rem' }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '380px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder={activeTab === 'cities' ? 'Search cities or countries...' : 'Search activity experiences...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.75rem' }}
          />
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-card)', padding: '0.35rem', borderRadius: '0.85rem', border: '1px solid var(--border-card)' }}>
          <button
            onClick={() => setActiveTab('cities')}
            style={{
              background: activeTab === 'cities' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'cities' ? '#ffffff' : 'var(--text-muted)',
              padding: '0.5rem 1.2rem',
              borderRadius: '0.65rem',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease'
            }}
          >
            <MapPin size={16} />
            Destination Cities ({cities.length})
          </button>

          <button
            onClick={() => setActiveTab('activities')}
            style={{
              background: activeTab === 'activities' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'activities' ? '#ffffff' : 'var(--text-muted)',
              padding: '0.5rem 1.2rem',
              borderRadius: '0.65rem',
              border: 'none',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.2s ease'
            }}
          >
            <Compass size={16} />
            Activity Catalog ({activities.length})
          </button>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <RefreshCw size={28} className="spin" style={{ marginBottom: '0.75rem' }} />
          <p>Loading discovery catalog...</p>
        </div>
      ) : activeTab === 'cities' ? (
        /* Cities Catalog Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {cities.map((city) => (
            <div key={city.id} className="glass-card animate-slide-up" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'relative', height: '190px' }}>
                <img src={city.cover_image} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(7, 9, 19, 0.95) 0%, rgba(7, 9, 19, 0.2) 60%, transparent 100%)'
                }} />

                <div style={{ position: 'absolute', top: '0.85rem', right: '0.85rem', zIndex: 2 }}>
                  <span className="badge badge-ongoing">
                    {city.cost_index}
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: '0.85rem', left: '1.1rem', right: '1.1rem', zIndex: 2 }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.15rem', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                    {city.name}
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>
                    📍 {city.country} • {city.region}
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                  {city.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-card)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>AVG DAILY COST</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                      ₹{Number(city.avg_daily_cost || 3500).toLocaleString()}
                    </span>
                  </div>

                  <button 
                    onClick={() => setSelectedCityForTrip(city)}
                    className="btn-primary" 
                    style={{ padding: '0.5rem 0.95rem', fontSize: '0.85rem' }}
                  >
                    <Plus size={15} />
                    Add to Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Activities Catalog Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {activities.map((act) => (
            <div key={act.id} className="glass-card animate-slide-up" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                  <span style={{
                    background: 'rgba(99, 102, 241, 0.15)',
                    color: 'var(--primary)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px'
                  }}>
                    {act.category}
                  </span>

                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={13} color="var(--accent-teal)" />
                    {act.city_name || 'Destination'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.45rem', lineHeight: '1.4' }}>
                  {act.title}
                </h3>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.1rem' }}>
                  {act.description}
                </p>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.85rem',
                borderTop: '1px solid var(--border-card)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                    <DollarSign size={14} />
                    ₹{Number(act.estimated_cost).toLocaleString()}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} color="var(--primary)" />
                    {act.duration || '2 Hours'}
                  </span>
                </div>

                <button 
                  onClick={() => alert(`Activity "${act.title}" copied! Open your trip details to schedule.`)}
                  className="btn-secondary" 
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                >
                  <Plus size={14} />
                  Schedule
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add City to Trip Modal */}
      {selectedCityForTrip && (
        <div className="modal-overlay">
          <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '440px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.35rem' }}>
              Add {selectedCityForTrip.name} to Trip
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Select target trip itinerary and dates for this city stop.
            </p>

            <div className="form-group">
              <label>Target Trip Itinerary *</label>
              <select className="form-input" value={targetTripId} onChange={(e) => setTargetTripId(e.target.value)}>
                {trips.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.start_date})</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div className="form-group">
                <label>Arrival Date *</label>
                <input type="date" className="form-input" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Departure Date *</label>
                <input type="date" className="form-input" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button type="button" onClick={() => setSelectedCityForTrip(null)} className="btn-secondary">Cancel</button>
              <button type="button" onClick={handleConfirmAddStop} disabled={addingStop} className="btn-primary">
                {addingStop ? 'Adding...' : 'Confirm Stop'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
