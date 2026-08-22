'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Compass, Sparkles, MapPin, Calendar, DollarSign, Share2, ArrowRight, 
  Globe, Zap, Check, Eye, X, Clock, ShieldCheck 
} from 'lucide-react';
import { createTrip, addStop, addActivity, getCurrentUser } from '../lib/api';

const FEATURED_SAMPLE_TRIPS = [
  {
    id: 'sample-1',
    name: 'Coastal India Odyssey',
    vibe: 'Food & Beach',
    cover_image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    start_date: '01/09/2026',
    end_date: '08/09/2026',
    total_budget: 65000,
    stops_count: 3,
    description: 'Explore the vibrant western coastline of India starting from colonial Marine Drive in Mumbai, relaxing on golden beaches of Goa, and finishing in tech-hub Bengaluru.',
    stops_preview: [
      { name: 'Mumbai', arrival_date: '01/09/2026', departure_date: '03/09/2026', activities: ['Gateway of India Heritage Walk', 'Mohammad Ali Road Food Crawl'] },
      { name: 'Goa', arrival_date: '03/09/2026', departure_date: '06/09/2026', activities: ['Grande Island Scuba Diving', 'Fontainhas Latin Quarter Heritage Walk'] },
      { name: 'Bengaluru', arrival_date: '06/09/2026', departure_date: '08/09/2026', activities: ['Lalbagh Botanical Gardens', 'Indiranagar Craft Breweries'] }
    ],
    health_score: 96
  },
  {
    id: 'sample-2',
    name: 'Golden Triangle Heritage',
    vibe: 'Culture & Architecture',
    cover_image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80',
    start_date: '15/10/2026',
    end_date: '22/10/2026',
    total_budget: 48000,
    stops_count: 3,
    description: 'Immerse yourself in northern India’s iconic cultural circuit featuring Mughal monuments in Delhi, the Taj Mahal in Agra, and royal palaces of Jaipur.',
    stops_preview: [
      { name: 'Delhi', arrival_date: '15/10/2026', departure_date: '17/10/2026', activities: ['Old Delhi Rickshaw Spice Market Tour', 'Qutub Minar Sunset'] },
      { name: 'Agra', arrival_date: '17/10/2026', departure_date: '19/10/2026', activities: ['Taj Mahal Sunrise Tour', 'Agra Fort Exploration'] },
      { name: 'Jaipur', arrival_date: '19/10/2026', departure_date: '22/10/2026', activities: ['Amer Fort Elephant & Palace Walk', 'Hawa Mahal Photography'] }
    ],
    health_score: 98
  },
  {
    id: 'sample-3',
    name: 'Himalayan High Passes',
    vibe: 'Mountain Adventure',
    cover_image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    start_date: '05/11/2026',
    end_date: '15/11/2026',
    total_budget: 82000,
    stops_count: 4,
    description: 'An epic high-altitude mountain expedition traversing Solang Valley, Rohtang Pass, Leh Monasteries, and the pristine Nubra Valley.',
    stops_preview: [
      { name: 'Manali', arrival_date: '05/11/2026', departure_date: '07/11/2026', activities: ['Solang Valley Sports', 'Old Manali Cafe Crawl'] },
      { name: 'Jispa', arrival_date: '07/11/2026', departure_date: '09/11/2026', activities: ['Bhaga River Camping', 'High Pass Altitude Acclimatization'] },
      { name: 'Leh', arrival_date: '09/11/2026', departure_date: '12/11/2026', activities: ['Shanti Stupa Sunset', 'Pangong Lake Day Tour'] },
      { name: 'Nubra Valley', arrival_date: '12/11/2026', departure_date: '15/11/2026', activities: ['Hunder Double-Hump Camel Safari', 'Diskit Monastery'] }
    ],
    health_score: 94
  }
];

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedSampleForPreview, setSelectedSampleForPreview] = useState<typeof FEATURED_SAMPLE_TRIPS[0] | null>(null);
  const [cloningId, setCloningId] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().then(u => {
      if (u && (u.id || u.email)) setUser(u);
      else setUser(null);
    }).catch(() => setUser(null));
  }, []);

  const handlePlanSampleTrip = async (sampleTrip: typeof FEATURED_SAMPLE_TRIPS[0]) => {
    setCloningId(sampleTrip.id);
    try {
      const currentUser = await getCurrentUser().catch(() => null);
      if (!currentUser || (!currentUser.id && !currentUser.email)) {
        router.push('/login');
        return;
      }

      // 1. Create Trip Container
      const createdTrip = await createTrip({
        name: sampleTrip.name,
        description: sampleTrip.description,
        start_date: sampleTrip.start_date,
        end_date: sampleTrip.end_date,
        total_budget: sampleTrip.total_budget,
        vibe: sampleTrip.vibe,
        cover_image: sampleTrip.cover_image,
      });

      // 2. Auto-Populate All City Stops & Day Activities with precise stop dates!
      if (createdTrip && createdTrip.id) {
        for (let i = 0; i < sampleTrip.stops_preview.length; i++) {
          const s = sampleTrip.stops_preview[i];
          const createdStop = await addStop(createdTrip.id, {
            city_name: s.name,
            arrival_date: s.arrival_date,
            departure_date: s.departure_date,
            sequence_order: i + 1
          }).catch(() => null);

          if (createdStop && createdStop.id) {
            for (let actIdx = 0; actIdx < s.activities.length; actIdx++) {
              await addActivity({
                trip_stop_id: createdStop.id,
                custom_title: s.activities[actIdx],
                category: 'Sightseeing',
                scheduled_date: s.arrival_date,
                start_time: '10:00 AM',
                end_time: '01:00 PM',
                custom_cost: 1500,
                notes: `Activity for ${s.name}`,
                sequence_order: actIdx + 1
              }).catch(() => null);
            }
          }
        }
        router.push(`/trips/${createdTrip.id}`);
      } else {
        router.push('/trips');
      }
    } catch (err) {
      router.push('/login');
    } finally {
      setCloningId(null);
    }
  };

  return (
    <main style={{ padding: '3.5rem 1.5rem 6rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(99, 102, 241, 0.15)',
          color: 'var(--primary)',
          padding: '0.45rem 1.2rem',
          borderRadius: '9999px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} color="var(--accent-amber)" />
          GlobeTrotter Travel Operating System
        </div>

        <h1 style={{
          fontSize: '3.6rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: '1.12',
          marginBottom: '1.25rem',
          color: 'var(--text-main)'
        }}>
          Architect Beautiful Multi-City <br />
          <span style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Travel Itineraries
          </span>
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '720px',
          margin: '0 auto 2.5rem',
          lineHeight: '1.65'
        }}>
          Build day-by-day city routes, track real-time budgets & expenses, standardize date formatting in <b>DD/MM/YYYY</b>, and publish shareable itineraries.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link href="/trips" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem' }}>
            <Compass size={20} />
            Launch My Trips Workspace
            <ArrowRight size={18} />
          </Link>

          {!user ? (
            <Link href="/login" className="btn-secondary" style={{ padding: '0.9rem 1.75rem', fontSize: '1rem' }}>
              Sign In / Register
            </Link>
          ) : (
            <Link href="/discover" className="btn-secondary" style={{ padding: '0.9rem 1.75rem', fontSize: '1rem' }}>
              <Globe size={18} color="var(--accent-teal)" />
              Discover Destinations
            </Link>
          )}
        </div>
      </div>

      {/* Featured Curated Itineraries Section */}
      <div style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-teal)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.35rem' }}>
              <Zap size={15} />
              CURATED EXAMPLES
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>Popular Multi-City Sample Itineraries</h2>
          </div>

          <Link href="/discover" className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            Explore All Destinations
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Featured Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {FEATURED_SAMPLE_TRIPS.map(trip => (
            <div key={trip.id} className="glass-card animate-slide-up" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'relative', height: '200px' }}>
                <img src={trip.cover_image} alt={trip.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(7, 9, 19, 0.95) 0%, rgba(7, 9, 19, 0.2) 60%, transparent 100%)'
                }} />

                <div style={{ position: 'absolute', top: '0.85rem', left: '0.85rem', zIndex: 2 }}>
                  <span style={{
                    background: 'rgba(7, 9, 19, 0.75)',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.75rem',
                    borderRadius: '0.6rem',
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}>
                    <Sparkles size={13} color="var(--accent-amber)" />
                    {trip.vibe}
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: '0.85rem', left: '1.1rem', right: '1.1rem', zIndex: 2 }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.2rem', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
                    {trip.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.9)', fontWeight: 500 }}>
                    <Calendar size={14} color="var(--accent-teal)" />
                    <span>{trip.start_date} — {trip.end_date}</span>
                  </div>
                </div>
              </div>

              <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.45rem' }}>
                    CITY STOPS ROUTE ({trip.stops_count})
                  </span>

                  <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
                    {trip.stops_preview.map((s, idx) => (
                      <span key={idx} style={{
                        background: 'rgba(99, 102, 241, 0.12)',
                        color: 'var(--primary)',
                        border: '1px solid rgba(99, 102, 241, 0.25)',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.65rem',
                        borderRadius: '0.5rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <MapPin size={12} />
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-card)'
                }}>
                  <button
                    onClick={() => setSelectedSampleForPreview(trip)}
                    className="btn-secondary"
                    style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}
                  >
                    <Eye size={15} />
                    View Details
                  </button>

                  <button 
                    onClick={() => handlePlanSampleTrip(trip)}
                    disabled={cloningId === trip.id}
                    className="btn-primary" 
                    style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem' }}
                  >
                    {cloningId === trip.id ? 'Cloning Itinerary...' : 'Plan Similar'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Trip Full Details Preview Modal */}
      {selectedSampleForPreview && (
        <div className="modal-overlay">
          <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '640px', padding: '2rem', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <span className="badge badge-planning" style={{ marginBottom: '0.35rem', display: 'inline-flex' }}>
                  {selectedSampleForPreview.vibe}
                </span>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {selectedSampleForPreview.name}
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  📅 {selectedSampleForPreview.start_date} — {selectedSampleForPreview.end_date} (DD/MM/YYYY)
                </p>
              </div>

              <button onClick={() => setSelectedSampleForPreview(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <img src={selectedSampleForPreview.cover_image} alt="Cover" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '0.75rem', marginBottom: '1.25rem' }} />

            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {selectedSampleForPreview.description}
            </p>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <MapPin size={18} color="var(--accent-teal)" />
              Full City Stop & Day Activity Schedule
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.75rem' }}>
              {selectedSampleForPreview.stops_preview.map((stop, i) => (
                <div key={i} style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--border-card)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                      📍 Stop {i + 1}: {stop.name}
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-teal)', fontWeight: 700 }}>
                      {stop.arrival_date} — {stop.departure_date}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {stop.activities.map((act, actIdx) => (
                      <div key={actIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Check size={14} color="var(--primary)" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-card)' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block' }}>ESTIMATED BUDGET</span>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                  ₹{selectedSampleForPreview.total_budget.toLocaleString()}
                </span>
              </div>

              <button 
                onClick={() => {
                  const s = selectedSampleForPreview;
                  setSelectedSampleForPreview(null);
                  handlePlanSampleTrip(s);
                }} 
                disabled={cloningId === selectedSampleForPreview.id}
                className="btn-primary" 
                style={{ padding: '0.7rem 1.4rem' }}
              >
                <Compass size={18} />
                {cloningId === selectedSampleForPreview.id ? 'Cloning Itinerary...' : 'Copy & Plan This Trip'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
