import React, { useState, useEffect } from 'react';
import { X, Sparkles, Clock, DollarSign, Calendar, FileText } from 'lucide-react';
import { TripStop, ItineraryActivity } from '../types/trip';
import { inputDateToDDMMYYYY } from '../lib/dateFormatter';

interface ActivityModalProps {
  isOpen: boolean;
  tripStop: TripStop | null;
  activityToEdit?: ItineraryActivity | null;
  onClose: () => void;
  onSaveActivity: (activityData: Omit<ItineraryActivity, 'id'>, activityId?: number) => Promise<void>;
}

const CATEGORIES = [
  'Sightseeing',
  'Food & Dining',
  'Adventure',
  'Culture & Heritage',
  'Relaxation',
  'Shopping',
  'Transport'
];

export default function ActivityModal({ 
  isOpen, 
  tripStop, 
  activityToEdit, 
  onClose, 
  onSaveActivity 
}: ActivityModalProps) {
  const [customTitle, setCustomTitle] = useState('');
  const [category, setCategory] = useState('Sightseeing');
  const [scheduledDate, setScheduledDate] = useState('');
  const [startTime, setStartTime] = useState('09:30 AM');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [customCost, setCustomCost] = useState('1500');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!activityToEdit;

  useEffect(() => {
    if (activityToEdit) {
      setCustomTitle(activityToEdit.custom_title || '');
      setCategory(activityToEdit.category || 'Sightseeing');
      setStartTime(activityToEdit.start_time || '');
      setEndTime(activityToEdit.end_time || '');
      setCustomCost(String(activityToEdit.custom_cost || 0));
      setNotes(activityToEdit.notes || '');
      
      // Convert DD/MM/YYYY to YYYY-MM-DD for date input
      if (activityToEdit.scheduled_date) {
        const parts = activityToEdit.scheduled_date.split('/');
        if (parts.length === 3) {
          setScheduledDate(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
        }
      }
    } else {
      setCustomTitle('');
      setCategory('Sightseeing');
      setScheduledDate('');
      setStartTime('09:30 AM');
      setEndTime('12:00 PM');
      setCustomCost('1500');
      setNotes('');
    }
  }, [activityToEdit, isOpen]);

  if (!isOpen || (!tripStop && !activityToEdit)) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle || !scheduledDate) return;

    setSubmitting(true);
    try {
      const formattedDate = inputDateToDDMMYYYY(scheduledDate);
      const stopId = activityToEdit ? activityToEdit.trip_stop_id : (tripStop?.id || 0);

      await onSaveActivity(
        {
          trip_stop_id: stopId,
          custom_title: customTitle,
          category,
          scheduled_date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          custom_cost: Math.max(0, parseFloat(customCost) || 0),
          notes,
        },
        activityToEdit?.id
      );
      onClose();
    } catch (err: any) {
      console.error('Error saving activity:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(20, 184, 166, 0.18)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {isEditMode ? 'Edit Day Activity' : 'Schedule Day Activity'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isEditMode ? `Editing "${activityToEdit.custom_title}"` : `Under ${tripStop?.city_name || 'city'} stop`}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label>Activity Title *</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Visit Gateway of India & Taj Palace Hotel 🏰" 
              value={customTitle} 
              onChange={(e) => setCustomTitle(e.target.value)} 
              required 
            />
          </div>

          {/* Category & Scheduled Date */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Category</label>
              <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Scheduled Date * (DD/MM/YYYY)</label>
              <input 
                type="date" 
                className="form-input" 
                value={scheduledDate} 
                onChange={(e) => setScheduledDate(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Start Time & End Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Start Time</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="09:30 AM" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label>End Time</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="12:00 PM" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
              />
            </div>
          </div>

          {/* Cost */}
          <div className="form-group">
            <label>Estimated Cost (₹)</label>
            <input 
              type="number" 
              min="0"
              className="form-input" 
              placeholder="1500" 
              value={customCost} 
              onChange={(e) => setCustomCost(e.target.value)} 
            />
          </div>

          {/* Notes */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label>Notes & Tips</label>
            <textarea 
              className="form-input" 
              rows={2} 
              placeholder="e.g. Pre-book ferry tickets online, wear comfortable shoes..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
              {submitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Schedule Activity')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
