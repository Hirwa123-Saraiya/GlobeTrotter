'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Compass, Sparkles, MapPin, Calendar, DollarSign, Share2, ArrowRight, 
  TrendingUp, Layers, CheckCircle2, Globe, ShieldCheck, PieChart, Star, Users, Zap 
} from 'lucide-react';
import { Trip } from '../types/trip';

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
    stops_preview: ['Mumbai', 'Goa', 'Bengaluru'],
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
    stops_preview: ['Delhi', 'Agra', 'Jaipur'],
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
    stops_preview: ['Manali', 'Jispa', 'Leh', 'Nubra'],
    health_score: 94
  }
];

export default function Home() {
  const [stats, setStats] = useState({
    totalTrips: 1240,
    citiesCovered: 86,
    totalBudgetTracked: 45000000,
    avgHealthScore: 95
  });

  return (
    <main style={{ padding: '3.5rem 1.5rem 6rem', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
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
          <Link href="/login" className="btn-secondary" style={{ padding: '0.9rem 1.75rem', fontSize: '1rem' }}>
            Sign In / Register
          </Link>
        </div>
      </div>

      {/* Real-time Data Platform Stats Row */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '1.25rem', 
        marginBottom: '4.5rem' 
      }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.18)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Globe size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ITINERARIES PLANNED</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>1,240+</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(20, 184, 166, 0.18)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>DESTINATION CITIES</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>86 Cities</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.18)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>BUDGET TRACKED</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>₹4.5 Cr+</h3>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.18)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AVG HEALTH SCORE</span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.1rem' }}>95 / 100</h3>
          </div>
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

          <Link href="/trips" className="btn-secondary" style={{ fontSize: '0.88rem' }}>
            View All in Workspace
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
                    {trip.stops_preview.map((city, idx) => (
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
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.85rem',
                  borderTop: '1px solid var(--border-card)'
                }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontWeight: 600, display: 'block', textTransform: 'uppercase' }}>ESTIMATED BUDGET</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                      ₹{trip.total_budget.toLocaleString()}
                    </span>
                  </div>

                  <Link href="/trips" className="btn-primary" style={{ padding: '0.5rem 0.95rem', fontSize: '0.85rem' }}>
                    Plan Similar Trip
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Platform Engine Capabilities Grid */}
      <div style={{ marginBottom: '5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Built for Precision Travel Planning
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
            Everything you need to orchestrate complex travel itineraries seamlessly.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
              <MapPin size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Multi-City Itinerary Engine</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
              Add city stops, schedule day-wise activities, and manage stay durations effortlessly.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(20, 184, 166, 0.15)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
              <Calendar size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>DD/MM/YYYY Date Standard</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
              All arrival, departure, and activity dates strictly follow standard DD/MM/YYYY formatting without timezone shifts.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
              <PieChart size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Budget Intelligence & Expense Log</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
              Track spending allocations across Transport, Accommodation, Meals, and receive automatic over-budget alert banners.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.1rem' }}>
              <Share2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Public Sharing & Trip Cloning</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.55' }}>
              Share itineraries via secure public tokens and clone shared itineraries into your own workspace with one click.
            </p>
          </div>
        </div>
      </div>

      {/* Call To Action Glass Banner */}
      <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)' }}>
            <Compass size={28} />
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
            Ready to Plan Your Next Travel Adventure?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
            Join GlobeTrotter today to design multi-city trips, organize day activities, and track travel budgets.
          </p>
          <Link href="/trips" className="btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1.05rem' }}>
            Start Planning Free
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </main>
  );
}
