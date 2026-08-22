'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL, getCurrentUser, getTrips, logoutUser } from '@/lib/api';
import { parseDDMMYYYY } from '@/lib/date';
import '@/styles/profile.css';

function TripGrid({ title, trips }) {
  return (
    <div className="profile-section">
      <h2>{title}</h2>
      {trips.length === 0 ? (
        <p className="profile-empty">No trips here yet.</p>
      ) : (
        <div className="profile-trip-grid">
          {trips.map((trip) => (
            <div className="profile-trip-card" key={trip.id}>
              <div className="profile-trip-cover">
                {trip.cover_image ? (
                  <img src={trip.cover_image} alt={trip.name} />
                ) : (
                  <span>No image</span>
                )}
              </div>
              <div className="profile-trip-name">{trip.name}</div>
              <div className="profile-trip-dates">
                {trip.start_date} - {trip.end_date}
              </div>
              <a className="profile-trip-view-btn" href={`/trips/${trip.id}`}>
                View
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [preplannedTrips, setPreplannedTrips] = useState([]);
  const [previousTrips, setPreviousTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [editingDetails, setEditingDetails] = useState(false);
  const [detailsForm, setDetailsForm] = useState({ firstName: '', lastName: '', email: '' });
  const [detailsError, setDetailsError] = useState('');
  const [savingDetails, setSavingDetails] = useState(false);

  const [editingPhoto, setEditingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [savingPhoto, setSavingPhoto] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const meUser = await getCurrentUser();
        if (!meUser) {
          router.push('/login');
          return;
        }

        setUser(meUser);
        setDetailsForm({
          firstName: meUser.firstName || '',
          lastName: meUser.lastName || '',
          email: meUser.email || '',
        });

        const userTrips = await getTrips().catch(() => []);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const preplanned = [];
        const previous = [];
        for (const trip of userTrips || []) {
          const end = parseDDMMYYYY(trip.end_date);
          if (end && end < today) {
            previous.push(trip);
          } else {
            preplanned.push(trip);
          }
        }
        setPreplannedTrips(preplanned);
        setPreviousTrips(previous);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push('/login');
          return;
        }
        setLoadError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const handleDetailsChange = (e) => {
    setDetailsForm({ ...detailsForm, [e.target.name]: e.target.value });
  };

  const handleDetailsSave = async (e) => {
    e.preventDefault();
    setDetailsError('');
    setSavingDetails(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(detailsForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      setUser(data.data.user);
      setEditingDetails(false);
    } catch (err) {
      setDetailsError(err.message);
    } finally {
      setSavingDetails(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image file size must be less than 5MB.');
      return;
    }

    setPhotoError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoSave = async (e) => {
    e.preventDefault();
    setPhotoError('');

    if (!photoUrl) {
      setPhotoError('Please select a photo file or enter an image URL.');
      return;
    }

    setSavingPhoto(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ profilePhotoUrl: photoUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      setUser(data.data.user);
      setEditingPhoto(false);
      setPhotoUrl('');
    } catch (err) {
      setPhotoError(err.message);
    } finally {
      setSavingPhoto(false);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteError('');
    setDeleting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');

      router.push('/login');
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="profile-loading">Loading your profile...</div>;
  }

  if (loadError) {
    return <div className="profile-loading">{loadError}</div>;
  }

  return (
    <main className="profile-page">
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-photo-wrap">
            <div className="profile-photo">
              {user?.profilePhotoUrl ? (
                <img src={user.profilePhotoUrl} alt={user.firstName} />
              ) : (
                <span>{user?.firstName?.[0]?.toUpperCase()}</span>
              )}
            </div>
            <button className="profile-photo-edit-btn" onClick={() => setEditingPhoto((v) => !v)}>
              Change photo
            </button>
            {editingPhoto && (
              <form className="profile-form" onSubmit={handlePhotoSave} style={{ width: '100%' }}>
                {photoError && <p className="profile-error">{photoError}</p>}
                <div>
                  <label htmlFor="photoFile">Upload Image File</label>
                  <input
                    id="photoFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ padding: '0.4rem' }}
                  />
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0.2rem 0' }}>
                  — OR —
                </div>
                <div>
                  <label htmlFor="photoUrl">Image URL</label>
                  <input
                    id="photoUrl"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                  />
                </div>
                <div className="profile-form-actions">
                  <button className="profile-btn-primary" type="submit" disabled={savingPhoto}>
                    {savingPhoto ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className="profile-btn-secondary"
                    type="button"
                    onClick={() => {
                      setEditingPhoto(false);
                      setPhotoUrl('');
                      setPhotoError('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="profile-details">
            <div className="profile-details-header">
              <h1>User Details</h1>
              {!editingDetails && (
                <button className="profile-edit-btn" onClick={() => setEditingDetails(true)}>
                  Edit
                </button>
              )}
            </div>

            {!editingDetails ? (
              <>
                <div className="profile-field-row">
                  <span>Name</span>
                  <span>
                    {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <div className="profile-field-row">
                  <span>Email</span>
                  <span>{user?.email}</span>
                </div>
              </>
            ) : (
              <form className="profile-form" onSubmit={handleDetailsSave}>
                {detailsError && <p className="profile-error">{detailsError}</p>}
                <div className="profile-form-row">
                  <div>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      name="firstName"
                      value={detailsForm.firstName}
                      onChange={handleDetailsChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={detailsForm.lastName}
                      onChange={handleDetailsChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={detailsForm.email}
                    onChange={handleDetailsChange}
                    required
                  />
                </div>
                <div className="profile-form-actions">
                  <button className="profile-btn-primary" type="submit" disabled={savingDetails}>
                    {savingDetails ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className="profile-btn-secondary"
                    type="button"
                    onClick={() => setEditingDetails(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="profile-danger-zone">
              {!showDeleteConfirm ? (
                <button className="profile-btn-danger" onClick={() => setShowDeleteConfirm(true)}>
                  Delete Account
                </button>
              ) : (
                <form className="profile-form" onSubmit={handleDelete}>
                  {deleteError && <p className="profile-error">{deleteError}</p>}
                  <div>
                    <label htmlFor="deletePassword">Confirm your password to delete your account</label>
                    <input
                      id="deletePassword"
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="profile-form-actions">
                    <button className="profile-btn-danger" type="submit" disabled={deleting}>
                      {deleting ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button
                      className="profile-btn-secondary"
                      type="button"
                      onClick={() => setShowDeleteConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <TripGrid title="Preplanned Trips" trips={preplannedTrips} />
        <TripGrid title="Previous Trips" trips={previousTrips} />
      </div>
    </main>
  );
}
