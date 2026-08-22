export interface TripStop {
  id: number;
  trip_id: number;
  city_name: string;
  arrival_date: string; // DD/MM/YYYY
  departure_date: string; // DD/MM/YYYY
  sequence_order: number;
  created_at?: string;
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
