export interface ItineraryActivity {
  id: number;
  trip_stop_id: number;
  custom_title: string;
  category?: string; // Sightseeing, Food & Dining, Adventure, Culture & Heritage, Relaxation, Shopping, Transport
  scheduled_date: string; // DD/MM/YYYY
  start_time?: string; // e.g. "09:30 AM"
  end_time?: string; // e.g. "12:00 PM"
  custom_cost?: number;
  notes?: string;
  sequence_order?: number;
  created_at?: string;
}

export interface TripStop {
  id: number;
  trip_id: number;
  city_name: string;
  arrival_date: string; // DD/MM/YYYY
  departure_date: string; // DD/MM/YYYY
  sequence_order: number;
  activities?: ItineraryActivity[];
  created_at?: string;
}

export interface Expense {
  id: number;
  trip_id: number;
  category: 'Transport' | 'Accommodation' | 'Meals' | 'Activities' | 'Misc' | string;
  amount: number;
  description?: string;
  expense_date: string; // DD/MM/YYYY
  created_at?: string;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface BudgetAnalytics {
  trip_id: number;
  trip_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  total_budget: number;
  total_spent: number;
  remaining_budget: number;
  is_over_budget: boolean;
  over_budget_amount: number;
  daily_average: number;
  category_breakdown: CategoryBreakdown[];
  expenses: Expense[];
}

export interface Trip {
  id: number;
  user_id: string | number;
  name: string;
  description: string;
  cover_image: string;
  start_date: string; // DD/MM/YYYY
  end_date: string; // DD/MM/YYYY
  total_budget: number;
  vibe: string;
  status: 'planning' | 'ongoing' | 'completed';
  is_public: boolean;
  share_token: string;
  created_at?: string;
  stops?: TripStop[];
  stop_count?: number;
  health_score?: number;
}
