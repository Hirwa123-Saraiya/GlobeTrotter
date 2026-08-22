import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, FileText, Tag, Sparkles, AlertCircle } from 'lucide-react';
import { Expense } from '../types/trip';
import { inputDateToDDMMYYYY } from '../lib/dateFormatter';

interface LogExpenseModalProps {
  isOpen: boolean;
  expenseToEdit?: Expense | null;
  onClose: () => void;
  onSaveExpense: (expenseData: Omit<Expense, 'id' | 'trip_id'>, expenseId?: number) => Promise<void>;
}

const CATEGORIES = [
  'Transport',
  'Accommodation',
  'Meals',
  'Activities',
  'Misc'
];

export default function LogExpenseModal({
  isOpen,
  expenseToEdit,
  onClose,
  onSaveExpense
}: LogExpenseModalProps) {
  const [category, setCategory] = useState('Transport');
  const [amount, setAmount] = useState('2500');
  const [expenseDate, setExpenseDate] = useState('');
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = !!expenseToEdit;

  useEffect(() => {
    setErrorMsg(null);
    if (expenseToEdit) {
      setCategory(expenseToEdit.category || 'Transport');
      setAmount(String(expenseToEdit.amount || 0));
      setDescription(expenseToEdit.description || '');

      if (expenseToEdit.expense_date) {
        const parts = expenseToEdit.expense_date.split('/');
        if (parts.length === 3) {
          setExpenseDate(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`);
        }
      }
    } else {
      setCategory('Transport');
      setAmount('2500');
      setExpenseDate('');
      setDescription('');
    }
  }, [expenseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!category || !amount || !expenseDate) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Expense amount must be greater than zero.');
      return;
    }

    setSubmitting(true);
    try {
      const formattedDate = inputDateToDDMMYYYY(expenseDate);
      await onSaveExpense(
        {
          category,
          amount: parsedAmount,
          description,
          expense_date: formattedDate
        },
        expenseToEdit?.id
      );
      onClose();
    } catch (err: any) {
      console.error('Error saving expense:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', position: 'relative' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.18)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                {isEditMode ? 'Edit Logged Expense' : 'Log New Expense'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isEditMode ? 'Update expense details' : 'Track your travel spending in real-time'}
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Validation Error */}
        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', padding: '0.65rem 0.85rem', borderRadius: '0.65rem', marginBottom: '1rem', fontSize: '0.82rem', fontWeight: 600 }}>
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {/* Category & Amount Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Category *</label>
              <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Amount (₹) *</label>
              <input 
                type="number" 
                min="0.01"
                step="0.01"
                className="form-input" 
                placeholder="2500" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
              />
            </div>
          </div>

          {/* Date Row */}
          <div className="form-group">
            <label>Expense Date * (DD/MM/YYYY)</label>
            <input 
              type="date" 
              className="form-input" 
              value={expenseDate} 
              onChange={(e) => setExpenseDate(e.target.value)} 
              required 
            />
          </div>

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label>Description / Note</label>
            <textarea 
              className="form-input" 
              rows={2} 
              placeholder="e.g. Express train tickets from Mumbai to Goa..." 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary" style={{ padding: '0.65rem 1.5rem' }}>
              {submitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Log Expense')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
