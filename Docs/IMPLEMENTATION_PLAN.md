# Implementation Plan: GlobeTrotter Personalized Travel Planning Platform

GlobeTrotter is a personalized, intelligent, multi-city travel planning web application built for the hackathon problem statement. This implementation plan outlines the architecture, relational database design, backend services (Node.js/Express in JavaScript with Swagger OpenAPI documentation), frontend application (Next.js in TypeScript), interactive components, and verification roadmap.

---

## Technical Stack

- **Frontend**: Next.js (TypeScript) + Tailwind CSS + Recharts + `@hello-pangea/dnd` (drag-and-drop) + Lucide Icons
- **Backend**: Node.js (JavaScript) + Express.js + PostgreSQL client (`pg` / `Prisma`) + JWT Authentication
- **API Documentation**: Swagger UI (`swagger-ui-express` + `swagger-jsdoc`) hosted at `/api-docs` on the backend server
- **Database**: PostgreSQL with complete relational normalization (Users, Trips, Stops, Cities, Activities, Itinerary Activities, Expenses, Saved Destinations)

---

## User Journey Flow

```text
LOGIN / SIGNUP
      ↓
DASHBOARD (Welcome, Recent Trips, Recommended Cities, Budget Highlights)
      ↓
CREATE TRIP (Name, Dates, Vibe, Budget, Comfort Level)
      ↓
ADD CITIES / STOPS (City Search, Drag & Drop Stop Reordering)
      ↓
ADD ACTIVITIES (Activity Search, Duration, Cost, Travel DNA Matching)
      ↓
BUILD DAY-WISE ITINERARY (Interactive Drag & Drop)
      ↓
AUTOMATIC BUDGET ENGINE (Category Breakdown, Daily Averages, Over-budget Alerts)
      ↓
CALENDAR / TIMELINE VISUALIZATION (List View, Visual Timeline, Calendar)
      ↓
SHARE TRIP (Public Share Token, One-Click "Copy Trip" Cloning)
```

---

## Relational Database Schema (PostgreSQL)

```sql
-- 1. USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_image TEXT,
    language VARCHAR(10) DEFAULT 'en',
    travel_dna JSONB DEFAULT '{}', -- e.g. {"food": 80, "culture": 90, "adventure": 50}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CITIES
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    description TEXT,
    image_url TEXT,
    cost_index INT CHECK (cost_index BETWEEN 1 AND 5),
    popularity_score INT DEFAULT 50,
    tags TEXT[] -- e.g. ['beach', 'food', 'nightlife']
);

-- 3. ACTIVITIES
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    city_id INT REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- Sightseeing, Food, Adventure, Culture, Relaxation
    duration_mins INT DEFAULT 120,
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    image_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 4.5
);

-- 4. TRIPS
CREATE TABLE trips (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    cover_image TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_budget NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    vibe VARCHAR(50), -- Adventure, Food, Culture, Relaxation, Nightlife
    status VARCHAR(20) DEFAULT 'planning', -- planning, ongoing, completed
    is_public BOOLEAN DEFAULT false,
    share_token VARCHAR(64) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TRIP_STOPS
CREATE TABLE trip_stops (
    id SERIAL PRIMARY KEY,
    trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
    city_id INT REFERENCES cities(id) ON DELETE CASCADE,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    sequence_order INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. ITINERARY_ACTIVITIES
CREATE TABLE itinerary_activities (
    id SERIAL PRIMARY KEY,
    trip_stop_id INT REFERENCES trip_stops(id) ON DELETE CASCADE,
    activity_id INT REFERENCES activities(id) ON DELETE SET NULL,
    custom_title VARCHAR(150),
    scheduled_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    custom_cost NUMERIC(10, 2),
    notes TEXT,
    sequence_order INT DEFAULT 0
);

-- 7. EXPENSES
CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    trip_id INT REFERENCES trips(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- transport, stay, activities, meals, misc
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SAVED_DESTINATIONS
CREATE TABLE saved_destinations (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    city_id INT REFERENCES cities(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, city_id)
);
```

---

## Entity Relationships Diagram (Conceptual)

```text
USER
 │
 ├───────────────< TRIPS
 │                    │
 │                    ├────────< TRIP_STOPS >──────── CITY
 │                    │                                  │
 │                    │                                  └────< ACTIVITIES
 │                    │
 │                    └────────< EXPENSES
 │
 └───────────────< SAVED_DESTINATIONS >──────── CITY

TRIP_STOP
    │
    └────< ITINERARY_ACTIVITY >──── ACTIVITY
```

---

## API Endpoints & Swagger OpenAPI Specification

Backend base URL: `http://localhost:5000/api`
Swagger UI location: `http://localhost:5000/api-docs`

### Authentication (`/api/auth`)
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `GET /api/auth/me` - Get logged-in user profile & Travel DNA

### Trips (`/api/trips`)
- `GET /api/trips` - List all user trips
- `POST /api/trips` - Create a new trip
- `GET /api/trips/:id` - Fetch detailed trip data (stops, activities, expenses, health score)
- `PUT /api/trips/:id` - Update trip metadata & budget
- `DELETE /api/trips/:id` - Delete a trip
- `POST /api/trips/:id/share` - Toggle public visibility and generate share link
- `POST /api/trips/:id/copy` - Clone a shared trip into user's account

### Trip Stops (`/api/trips/:id/stops`)
- `POST /api/trips/:id/stops` - Add a city stop to a trip
- `PUT /api/stops/:id` - Edit stop dates
- `DELETE /api/stops/:id` - Remove stop
- `PATCH /api/trips/:id/stops/reorder` - Reorder city stops

### Itinerary Activities (`/api/itinerary-activities`)
- `POST /api/itinerary-activities` - Schedule an activity on a day
- `PUT /api/itinerary-activities/:id` - Update time, notes, custom cost
- `DELETE /api/itinerary-activities/:id` - Remove scheduled activity
- `PATCH /api/itinerary-activities/reorder` - Drag-and-drop reordering of day activities

### Cities & Activities Search (`/api/cities`, `/api/activities`)
- `GET /api/cities` - Search & filter cities (country, cost index, popularity, search term)
- `GET /api/cities/:id` - Get city details & associated activities
- `GET /api/activities` - Search activities by city, category, budget, duration
- `POST /api/saved-destinations` - Bookmark/save a city
- `DELETE /api/saved-destinations/:cityId` - Unsave a city

### Budget & Cost Analytics (`/api/trips/:id/budget`)
- `GET /api/trips/:id/budget` - Aggregated spending breakdown, category percentages, daily averages, budget health indicators, over-budget warnings

---

## Directory Structure

```text
GlobeTrotter/
├── Docs/
│   ├── PROBLEM_STATEMENT.md
│   └── IMPLEMENTATION_PLAN.md
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── swagger.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── tripsController.js
│   │   │   ├── stopsController.js
│   │   │   ├── itineraryController.js
│   │   │   ├── citiesController.js
│   │   │   ├── activitiesController.js
│   │   │   └── budgetController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── tripRoutes.js
│   │   │   ├── cityRoutes.js
│   │   │   ├── activityRoutes.js
│   │   │   └── budgetRoutes.js
│   │   ├── seed.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   ├── login/page.tsx
    │   │   ├── signup/page.tsx
    │   │   ├── dashboard/page.tsx
    │   │   ├── trips/
    │   │   │   ├── page.tsx
    │   │   │   ├── create/page.tsx
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx          (Itinerary Builder)
    │   │   │       ├── budget/page.tsx   (Cost Analytics)
    │   │   │       └── calendar/page.tsx (Timeline & Calendar)
    │   │   ├── discover/page.tsx
    │   │   ├── profile/page.tsx
    │   │   └── shared/[token]/page.tsx   (Public Shared View)
    │   ├── components/
    │   │   ├── Navbar.tsx
    │   │   ├── Sidebar.tsx
    │   │   ├── TripCard.tsx
    │   │   ├── ItineraryBuilder.tsx
    │   │   ├── DragDropDay.tsx
    │   │   ├── BudgetCharts.tsx
    │   │   ├── TripHealthBadge.tsx
    │   │   └── CitySearchModal.tsx
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   └── lib/
    │       └── api.ts
    ├── package.json
    └── tsconfig.json
```

---

## Phased Implementation Roadmap

### Phase 1: Project Setup & Database Foundations
- Initialize backend Node.js repository with Express, `pg`, CORS, JWT, Swagger setup.
- Define database schema script and execute tables creation in PostgreSQL.
- Write database seed script (`seed.js`) populating 15+ cities and 50+ activities.

### Phase 2: Authentication & Core Backend APIs
- Implement Auth routes (`/signup`, `/login`, `/me`) with bcrypt hashing & JWT tokens.
- Configure Swagger OpenAPI documentation definitions and mount `/api-docs` endpoint.
- Implement Trips, Stops, Cities, Activities, and Itinerary REST routes with ownership security.

### Phase 3: Next.js Frontend Foundations & Dashboard
- Initialize Next.js TypeScript project.
- Implement Auth context, Login, Signup pages, and main navigation layout.
- Build Dashboard featuring welcome banner, upcoming trips, recommended cities, and budget summary.

### Phase 4: Hero Feature — Interactive Itinerary Builder
- Implement multi-step "Create Trip" wizard.
- Build Itinerary Builder screen supporting city stop management and day-by-day activity assignment.
- Integrate drag-and-drop activity sequence reordering using `@hello-pangea/dnd`.

### Phase 5: Budget Intelligence Engine & Timeline Views
- Build Budget Analytics page with Recharts pie/bar charts, daily average calculation, remaining budget status, and over-budget warnings.
- Build Calendar and Timeline view toggles for the itinerary.

### Phase 6: Public Sharing, Copy Trip & Personal Touches
- Build `/shared/[token]` public read-only itinerary view.
- Add "Copy This Trip" 1-click cloning functionality.
- Implement Travel DNA preference matching and Trip Health Score (0-100).
