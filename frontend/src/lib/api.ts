import axios from 'axios';
import { Trip, TripStop, ItineraryActivity, Expense, BudgetAnalytics } from '../types/trip';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending & receiving httpOnly JWT auth cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ============================================================================
 * AUTH API SERVICES
 * ============================================================================ */

export async function getCurrentUser(): Promise<any> {
  const response = await apiClient.get('/auth/me');
  return response.data.data?.user || response.data.data || response.data;
}

export async function logoutUser(): Promise<boolean> {
  const response = await apiClient.post('/auth/logout');
  return response.data.success ?? true;
}

/* ============================================================================
 * DISCOVERY CATALOG API SERVICES
 * ============================================================================ */

export async function getCities(search?: string, region?: string): Promise<any[]> {
  const response = await apiClient.get('/cities', { params: { search, region } });
  return response.data.data || response.data || [];
}

export async function getActivities(search?: string, category?: string): Promise<any[]> {
  const response = await apiClient.get('/activities', { params: { search, category } });
  return response.data.data || response.data || [];
}

/* ============================================================================
 * TRIPS API SERVICES
 * ============================================================================ */

export async function getTrips(): Promise<Trip[]> {
  const response = await apiClient.get('/trips');
  return response.data.data || response.data || [];
}

export async function createTrip(tripData: {
  name: string;
  description?: string;
  start_date: string; // DD/MM/YYYY
  end_date: string; // DD/MM/YYYY
  total_budget?: number;
  vibe?: string;
  cover_image?: string;
}): Promise<Trip> {
  const response = await apiClient.post('/trips', tripData);
  return response.data.data || response.data;
}

export async function getTripById(id: string | number): Promise<Trip> {
  const response = await apiClient.get(`/trips/${id}`);
  return response.data.data || response.data;
}

export async function updateTrip(
  id: string | number,
  updateData: Partial<Trip>
): Promise<Trip> {
  const response = await apiClient.put(`/trips/${id}`, updateData);
  return response.data.data || response.data;
}

export async function deleteTrip(id: string | number): Promise<boolean> {
  const response = await apiClient.delete(`/trips/${id}`);
  return response.data.success ?? true;
}

export async function shareTrip(
  id: string | number,
  is_public: boolean
): Promise<{ id: number; name: string; is_public: boolean; share_token: string }> {
  const response = await apiClient.post(`/trips/${id}/share`, { is_public });
  return response.data.data || response.data;
}

export async function copyTrip(id: string | number): Promise<Trip> {
  const response = await apiClient.post(`/trips/${id}/copy`);
  return response.data.data || response.data;
}

/* ============================================================================
 * TRIP STOPS API SERVICES
 * ============================================================================ */

export async function addStop(
  tripId: string | number,
  stopData: {
    city_name: string;
    arrival_date: string; // DD/MM/YYYY
    departure_date: string; // DD/MM/YYYY
    sequence_order?: number;
  }
): Promise<TripStop> {
  const response = await apiClient.post(`/trips/${tripId}/stops`, stopData);
  return response.data.data || response.data;
}

export async function updateStop(
  stopId: string | number,
  updateData: Partial<TripStop>
): Promise<TripStop> {
  const response = await apiClient.put(`/stops/${stopId}`, updateData);
  return response.data.data || response.data;
}

export async function deleteStop(stopId: string | number): Promise<boolean> {
  const response = await apiClient.delete(`/stops/${stopId}`);
  return response.data.success ?? true;
}

export async function reorderStops(
  tripId: string | number,
  stops: { id: number; sequence_order: number }[]
): Promise<TripStop[]> {
  const response = await apiClient.patch(`/trips/${tripId}/stops/reorder`, { stops });
  return response.data.data || response.data;
}

/* ============================================================================
 * ITINERARY ACTIVITIES API SERVICES
 * ============================================================================ */

export async function addActivity(activityData: {
  trip_stop_id: number;
  custom_title: string;
  category?: string;
  scheduled_date: string; // DD/MM/YYYY
  start_time?: string;
  end_time?: string;
  custom_cost?: number;
  notes?: string;
  sequence_order?: number;
}): Promise<ItineraryActivity> {
  const response = await apiClient.post('/itinerary-activities', activityData);
  return response.data.data || response.data;
}

export async function updateActivity(
  id: string | number,
  updateData: Partial<ItineraryActivity>
): Promise<ItineraryActivity> {
  const response = await apiClient.put(`/itinerary-activities/${id}`, updateData);
  return response.data.data || response.data;
}

export async function deleteActivity(id: string | number): Promise<boolean> {
  const response = await apiClient.delete(`/itinerary-activities/${id}`);
  return response.data.success ?? true;
}

export async function reorderActivities(
  tripStopId: number,
  activities: { id: number; sequence_order: number }[]
): Promise<ItineraryActivity[]> {
  const response = await apiClient.patch('/itinerary-activities/reorder', {
    trip_stop_id: tripStopId,
    activities,
  });
  return response.data.data || response.data;
}

/* ============================================================================
 * BUDGET & EXPENSE LOGGING API SERVICES
 * ============================================================================ */

export async function getBudgetAnalytics(tripId: string | number): Promise<BudgetAnalytics> {
  const response = await apiClient.get(`/trips/${tripId}/budget`);
  return response.data.data || response.data;
}

export async function logExpense(
  tripId: string | number,
  expenseData: {
    category: string;
    amount: number;
    description?: string;
    expense_date: string; // DD/MM/YYYY
  }
): Promise<Expense> {
  const response = await apiClient.post(`/trips/${tripId}/expenses`, expenseData);
  return response.data.data || response.data;
}

export async function updateExpense(
  expenseId: string | number,
  updateData: Partial<Expense>
): Promise<Expense> {
  const response = await apiClient.put(`/expenses/${expenseId}`, updateData);
  return response.data.data || response.data;
}

export async function deleteExpense(expenseId: string | number): Promise<boolean> {
  const response = await apiClient.delete(`/expenses/${expenseId}`);
  return response.data.success ?? true;
}
