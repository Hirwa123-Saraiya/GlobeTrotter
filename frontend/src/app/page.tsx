import React from 'react';
import Link from 'next/link';
import { Compass, Sparkles, MapPin, Calendar, DollarSign, Share2, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <main style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(99, 102, 241, 0.12)',
          color: '#818cf8',
          padding: '0.4rem 1rem',
          borderRadius: '9999px',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={16} />
          Your Personal Trip Operating System
        </div>

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: '1.15',
          marginBottom: '1.25rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Transform How You Plan & Experience Travel
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          margin: '0 auto 2.5rem',
          lineHeight: '1.6'
        }}>
          Dream, design, and organize multi-city travel itineraries with ease. Track budgets automatically, visualize timelines in <b>DD/MM/YYYY</b> format, and share your journey.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Link href="/trips" className="btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Explore My Trips
            <ArrowRight size={18} />
          </Link>
          <a 
            href="http://localhost:5000/api-docs" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-secondary" 
            style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
          >
            Swagger API Specs
          </a>
        </div>
      </div>

      {/* Feature Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <MapPin size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Multi-City Itineraries</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Add city stops, assign arrival/departure dates, and reorder sequence.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(20, 184, 166, 0.15)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Calendar size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Standardized Dates</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            All dates formatted strictly in <b>DD/MM/YYYY</b> format without timezone shifts.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <DollarSign size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Budget Tracking</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Set trip budgets and track total cost breakdowns effortlessly.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
            <Share2 size={22} />
          </div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Public Sharing & Copying</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
            Generate public share links and clone public trips with one click.
          </p>
        </div>
      </div>
    </main>
  );
}
