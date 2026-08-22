'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Compass, Globe, LogIn, LogOut, Sun, Moon, User as UserIcon, Search } from 'lucide-react';
import LoginModal from './LoginModal';
import { useTheme } from '../context/ThemeContext';
import { getCurrentUser, logoutUser } from '../lib/api';

interface NavbarProps {
  onOpenCreateModal?: () => void;
  onLoginSuccess?: () => void;
}

export default function Navbar({ onOpenCreateModal, onLoginSuccess }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Check login session on mount or route change
  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser && (currentUser.id || currentUser.email)) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setCheckingAuth(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Logout API failed, clearing local state:', err);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: theme === 'dark' ? 'rgba(7, 9, 19, 0.85)' : 'rgba(248, 250, 252, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-card)',
        padding: '0.9rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'background 0.3s ease, border 0.3s ease'
      }}>
        {/* Brand Logo - Links to Home Page ( / ) */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
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
            <span style={{
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              color: 'var(--text-main)'
            }}>
              GlobeTrotter
            </span>
            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--accent-teal)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Travel Operating System
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href="/trips" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none' }}>
            <Globe size={18} />
            My Trips
          </Link>

          <Link href="/discover" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none' }}>
            <Search size={17} color="var(--accent-teal)" />
            Discover
          </Link>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="btn-secondary"
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.82rem', borderRadius: '0.65rem' }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun size={17} color="#fbbf24" />
            ) : (
              <Moon size={17} color="#6366f1" />
            )}
          </button>

          {/* Auth Action: Logout if Signed In, Sign In if Signed Out */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-teal)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                <UserIcon size={14} />
                {user.firstName || user.email?.split('@')[0] || 'User'}
              </span>

              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem', color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                title="Log out of your account"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          ) : pathname !== '/login' ? (
            <Link
              href="/login"
              className="btn-secondary"
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}
            >
              <LogIn size={15} />
              Sign In
            </Link>
          ) : null}
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          checkAuthStatus();
          if (onLoginSuccess) onLoginSuccess();
          else router.push('/trips');
        }}
      />
    </>
  );
}
