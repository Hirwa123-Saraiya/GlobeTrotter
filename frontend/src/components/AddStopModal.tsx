import React, { useState } from 'react';
import { X, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { TripStop } from '../types/trip';
import { inputDateToDDMMYYYY } from '../lib/dateFormatter';

interface AddStopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStop: (stop: Omit<TripStop, 'id' | 'trip_id'>) => void;
}

export default function AddStopModal({ isOpen, onClose, onAddStop }: AddStopModalProps) {
  const [cityName, setCityName] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [dateError, setDateError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDateError(null);

    if (!cityName || !arrivalDate || !departureDate) return;

    if (new Date(departureDate) < new Date(arrivalDate)) {
      setDateError('Departure date must be on or after arrival date.');
      return;
    }

    onAddStop({
      city_name: cityName,
      arrival_date: inputDateToDDMMYYYY(arrivalDate),
      departure_date: inputDateToDDMMYYYY(departureDate),
      sequence_order: 1
    });

    setCityName('');
    setArrivalDate('');
    setDepartureDate('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '1.5rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(20, 184, 166, 0.15)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Add City Stop</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Validation Alert */}
        {dateError && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', marginBottom: '1rem', fontSize: '0.82rem', fontWeight: 600 }}>
            <AlertCircle size={16} />
            {dateError}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>City Name *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Mumbai, Goa, Bengaluru" 
              value={cityName} 
              onChange={(e) => setCityName(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Arrival Date *</label>
            <input 
              type="date" 
              className="form-input" 
              value={arrivalDate} 
              onChange={(e) => setArrivalDate(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label>Departure Date *</label>
            <input 
              type="date" 
              className="form-input" 
              value={departureDate} 
              onChange={(e) => setDepartureDate(e.target.value)} 
              required 
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary">Add Stop</button>
          </div>
        </form>
      </div>
    </div>
  );
}
