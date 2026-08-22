import React from 'react';
import Link from 'next/link';
import { Compass, Globe, BookOpen } from 'lucide-react';

interface NavbarProps {
  onOpenCreateModal?: () => void;
}

export default function Navbar({ onOpenCreateModal }: NavbarProps) {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7, 9, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0.9rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Brand Logo */}
      <Link href="/trips" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #14b8a6 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
        }}>
          <Compass size={24} />
        </div>
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            GlobeTrotter
          </span>
          <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--accent-teal)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Travel Operating System
          </span>
        </div>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link href="/trips" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none' }}>
          <Globe size={18} />
          My Trips
        </Link>

        <a 
          href="http://localhost:5000/api-docs" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}
        >
          <BookOpen size={16} />
          Swagger Docs
        </a>
      </div>
    </nav>
  );
}
