'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, DollarSign, AlertTriangle, TrendingUp, Calendar, Plus, 
  Trash2, Edit2, ShieldCheck, RefreshCw, PieChart, Sparkles, AlertCircle, Edit3
} from 'lucide-react';
import LogExpenseModal from '../../../../components/LogExpenseModal';
import DeleteConfirmModal from '../../../../components/DeleteConfirmModal';
import { BudgetAnalytics, Expense } from '../../../../types/trip';
import { getBudgetAnalytics, logExpense, updateExpense, deleteExpense, updateTrip } from '../../../../lib/api';

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string; bar: string }> = {
  'Transport': { bg: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.3)', bar: '#6366f1' },
  'Accommodation': { bg: 'rgba(20, 184, 166, 0.15)', color: '#2dd4bf', border: 'rgba(20, 184, 166, 0.3)', bar: '#14b8a6' },
  'Meals': { bg: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.3)', bar: '#f59e0b' },
  'Activities': { bg: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', border: 'rgba(168, 85, 247, 0.3)', bar: '#a855f7' },
  'Misc': { bg: 'rgba(148, 163, 184, 0.15)', color: '#cbd5e1', border: 'rgba(148, 163, 184, 0.3)', bar: '#94a3b8' }
};

export default function TripBudgetPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<BudgetAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<number | null>(null);

  // Fetch Budget Analytics
  const fetchBudget = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBudgetAnalytics(params.id);
      setAnalytics(data);
    } catch (err: any) {
      console.error('Failed to fetch budget analytics:', err.message);
      if (err.response?.status === 401) {
        router.push('/login');
        return;
      }
      setError(err.response?.data?.message || 'Failed to load trip budget from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [params.id]);

  // Log / Update Expense Handler
  const handleSaveExpense = async (expenseData: Omit<Expense, 'id' | 'trip_id'>, expenseId?: number) => {
    try {
      if (expenseId) {
        await updateExpense(expenseId, expenseData);
      } else {
        await logExpense(params.id, expenseData);
      }
      await fetchBudget();
    } catch (err: any) {
      alert('Failed to save expense: ' + (err.response?.data?.message || err.message));
    }
  };

  // Delete Expense Handler
  const handleConfirmDeleteExpense = async () => {
    if (!deleteExpenseId) return;
    try {
      await deleteExpense(deleteExpenseId);
      await fetchBudget();
    } catch (err: any) {
      alert('Failed to delete expense: ' + (err.response?.data?.message || err.message));
    } finally {
      setDeleteExpenseId(null);
    }
  };

  // Edit Target Budget Prompt
  const handleEditTargetBudget = async () => {
    if (!analytics) return;
    const newBudgetStr = prompt('Enter new Total Budget (₹):', String(analytics.total_budget || 0));
    if (newBudgetStr === null) return;
    const newBudget = parseFloat(newBudgetStr);
    if (isNaN(newBudget) || newBudget < 0) {
      alert('Please enter a valid numeric budget.');
      return;
    }

    try {
      await updateTrip(params.id, { total_budget: newBudget });
      await fetchBudget();
    } catch (err: any) {
      alert('Failed to update target budget: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1140px', margin: '4rem auto', textAlign: 'center', color: 'var(--text-muted)' }}>
        <RefreshCw size={32} className="spin" style={{ marginBottom: '1rem' }} />
        <p>Loading budget intelligence & expense data...</p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '3rem 2rem' }}>
          <AlertCircle size={40} color="var(--accent-amber)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>{error || 'Budget Data Unavailable'}</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Unable to fetch budget details for this trip.
          </p>
          <Link href={`/trips/${params.id}`} className="btn-primary">
            <ArrowLeft size={16} />
            Back to Trip Details
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1140px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
      {/* Back Button */}
      <Link href={`/trips/${params.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem', fontWeight: 600 }}>
        <ArrowLeft size={16} />
        Back to {analytics.trip_name} Details
      </Link>

      {/* Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <Sparkles size={14} />
            Budget Intelligence Engine
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            {analytics.trip_name} — Expense Tracker
          </h1>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Trip Duration: <b>{analytics.total_days} days</b> ({analytics.start_date} — {analytics.end_date})
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button onClick={handleEditTargetBudget} className="btn-secondary" style={{ padding: '0.7rem 1.1rem' }}>
            <Edit3 size={16} />
            Edit Target Budget
          </button>

          <button 
            onClick={() => {
              setExpenseToEdit(null);
              setIsLogModalOpen(true);
            }} 
            className="btn-primary" 
            style={{ padding: '0.75rem 1.4rem' }}
          >
            <Plus size={18} />
            Log New Expense
          </button>
        </div>
      </div>

      {/* Over-Budget Alert Warning Banner */}
      {analytics.is_over_budget && (
        <div className="animate-slide-up" style={{
          background: 'rgba(244, 63, 94, 0.15)',
          border: '1px solid rgba(244, 63, 94, 0.4)',
          borderRadius: '1rem',
          padding: '1.25rem 1.5rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '0 8px 24px rgba(244, 63, 94, 0.25)'
        }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.25)', color: '#f43f5e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fda4af', marginBottom: '0.2rem' }}>
              ⚠️ Budget Exceeded Alert!
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#fecdd3' }}>
              You have exceeded your total planned budget by <b>₹{Number(analytics.over_budget_amount).toLocaleString()}</b>. Consider reviewing category expenses below.
            </p>
          </div>
        </div>
      )}

      {/* Overview Metric Widgets Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        {/* Total Target Budget */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            TARGET BUDGET
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.4rem' }}>
            ₹{Number(analytics.total_budget).toLocaleString()}
          </h3>
        </div>

        {/* Total Spent */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            TOTAL SPENT
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: analytics.is_over_budget ? '#f43f5e' : 'var(--accent-teal)', marginTop: '0.4rem' }}>
            ₹{Number(analytics.total_spent).toLocaleString()}
          </h3>
        </div>

        {/* Remaining Budget */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            REMAINING BUDGET
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: analytics.remaining_budget < 0 ? '#f43f5e' : '#fcd34d', marginTop: '0.4rem' }}>
            {analytics.remaining_budget < 0 ? `- ₹${Math.abs(analytics.remaining_budget).toLocaleString()}` : `₹${Number(analytics.remaining_budget).toLocaleString()}`}
          </h3>
        </div>

        {/* Daily Average */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            DAILY AVERAGE
          </span>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#818cf8', marginTop: '0.4rem' }}>
            ₹{Number(analytics.daily_average).toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', fontWeight: 500 }}>/ day</span>
          </h3>
        </div>
      </div>

      {/* Workspace Grid Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        {/* Left Column: Category Spending Breakdown */}
        <div>
          <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={20} color="var(--primary)" />
              Category Spending Allocation
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {analytics.category_breakdown.map(cat => {
                const catStyle = CATEGORY_COLORS[cat.category] || CATEGORY_COLORS['Misc'];
                return (
                  <div key={cat.category}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                      <span style={{ fontWeight: 700, color: catStyle.color, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: catStyle.bar }} />
                        {cat.category}
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>
                        ₹{Number(cat.amount).toLocaleString()} <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>({cat.percentage}%)</span>
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${Math.min(100, cat.percentage)}%`,
                        height: '100%',
                        background: catStyle.bar,
                        borderRadius: '4px',
                        transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Logged Expense History */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <DollarSign size={20} color="var(--accent-amber)" />
              Expense History ({analytics.expenses.length})
            </h3>
          </div>

          {analytics.expenses.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {analytics.expenses.map((exp) => {
                const catStyle = CATEGORY_COLORS[exp.category] || CATEGORY_COLORS['Misc'];
                return (
                  <div 
                    key={exp.id} 
                    className="glass-card activity-card-hover" 
                    style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <span style={{
                          background: catStyle.bg,
                          color: catStyle.color,
                          border: `1px solid ${catStyle.border}`,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '0.15rem 0.55rem',
                          borderRadius: '9999px'
                        }}>
                          {exp.category}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {exp.expense_date}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {exp.description || `${exp.category} expense`}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                        ₹{Number(exp.amount).toLocaleString()}
                      </span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button 
                          onClick={() => {
                            setExpenseToEdit(exp);
                            setIsLogModalOpen(true);
                          }}
                          style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0.25rem' }}
                          title="Edit expense"
                        >
                          <Edit2 size={15} />
                        </button>

                        <button 
                          onClick={() => setDeleteExpenseId(exp.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--accent-rose)', cursor: 'pointer', padding: '0.25rem' }}
                          title="Delete expense"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass-card" style={{ padding: '2.5rem 1.5rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
              No expenses logged for this trip yet. Click <b>+ Log New Expense</b> above!
            </div>
          )}
        </div>
      </div>

      {/* Log / Edit Expense Modal */}
      <LogExpenseModal
        isOpen={isLogModalOpen}
        expenseToEdit={expenseToEdit}
        onClose={() => {
          setIsLogModalOpen(false);
          setExpenseToEdit(null);
        }}
        onSaveExpense={handleSaveExpense}
      />

      {/* Delete Expense Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteExpenseId}
        title="Delete Logged Expense?"
        message="Are you sure you want to delete this expense entry? Your remaining budget analytics will be recalculated."
        onClose={() => setDeleteExpenseId(null)}
        onConfirm={handleConfirmDeleteExpense}
      />
    </div>
  );
}
