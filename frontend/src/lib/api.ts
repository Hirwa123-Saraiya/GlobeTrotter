import axios from 'axios';
import { Trip, TripStop } from '../types/trip';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sending & receiving httpOnly JWT auth cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/* ============================================================================
 * TRIPS API SERVICES
 * ============================================================================ */

/**
 * Fetch all trips for the authenticated user
 */
export async function getTrips(): Promise<Trip[]> {
  try {
    const response = await apiClient.get('/trips');
    return response.data.data || response.data || [];
  } catch (error: any) {
    console.warn('API getTrips failed, falling back to client state:', error.message);
    throw error;
  }
}

/**
 * Create a new travel itinerary
 */
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

/**
 * Fetch detailed trip information by ID (includes stops & health score)
 */
export async function getTripById(id: string | number): Promise<Trip> {
  const response = await apiClient.get(`/trips/${id}`);
  return response.data.data || response.data;
}

/**
 * Update an existing trip metadata
 */
export async function updateTrip(
  id: string | number,
  updateData: Partial<Trip>
): Promise<Trip> {
  const response = await apiClient.put(`/trips/${id}`, updateData);
  return response.data.data || response.data;
}

/**
 * Delete a trip by ID
 */
export async function deleteTrip(id: string | number): Promise<boolean> {
  const response = await apiClient.delete(`/trips/${id}`);
  return response.data.success ?? true;
}

/**
 * Toggle public sharing status of a trip
 */
export async function shareTrip(
  id: string | number,
  is_public: boolean
): Promise<{ id: number; name: string; is_public: boolean; share_token: string }> {
  const response = await apiClient.post(`/trips/${id}/share`, { is_public });
  return response.data.data || response.data;
}

/**
 * Clone a public trip into the current user's account
 */
export async function copyTrip(id: string | number): Promise<Trip> {
  const response = await apiClient.post(`/trips/${id}/copy`);
  return response.data.data || response.data;
}

/* ============================================================================
 * TRIP STOPS API SERVICES
 * ============================================================================ */

/**
 * Add a city stop to a trip
 */
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

/**
 * Update a city stop
 */
export async function updateStop(
  stopId: string | number,
  updateData: Partial<TripStop>
): Promise<TripStop> {
  const response = await apiClient.put(`/stops/${stopId}`, updateData);
  return response.data.data || response.data;
}

/**
 * Delete a city stop
 */
export async function deleteStop(stopId: string | number): Promise<boolean> {
  const response = await apiClient.delete(`/stops/${stopId}`);
  return response.data.success ?? true;
}

/**
 * Reorder city stops sequence
 */
export async function reorderStops(
  tripId: string | number,
  stops: { id: number; sequence_order: number }[]
): Promise<TripStop[]> {
  const response = await apiClient.patch(`/trips/${tripId}/stops/reorder`, { stops });
  return response.data.data || response.data;
}
