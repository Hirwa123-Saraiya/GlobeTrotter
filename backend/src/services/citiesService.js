const pool = require('../config/db');

const SAMPLE_CITIES = [
  {
    id: 1,
    name: 'Mumbai',
    country: 'India',
    region: 'Maharashtra',
    cost_index: 'Budget-Friendly',
    popularity: 98,
    avg_daily_cost: 3500,
    cover_image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    description: 'Financial hub of India with iconic Gateway of India, Marine Drive promenade, and vibrant street food.'
  },
  {
    id: 2,
    name: 'Goa',
    country: 'India',
    region: 'Goa Coast',
    cost_index: 'Moderate',
    popularity: 99,
    avg_daily_cost: 4500,
    cover_image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Tropical paradise featuring golden beaches, Portuguese heritage architecture, water sports, and nightlife.'
  },
  {
    id: 3,
    name: 'Delhi',
    country: 'India',
    region: 'NCR',
    cost_index: 'Budget-Friendly',
    popularity: 95,
    avg_daily_cost: 3200,
    cover_image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    description: 'Historic capital city home to Red Fort, Qutub Minar, Chandni Chowk markets, and rich Mughal cuisine.'
  },
  {
    id: 4,
    name: 'Jaipur',
    country: 'India',
    region: 'Rajasthan',
    cost_index: 'Moderate',
    popularity: 96,
    avg_daily_cost: 3800,
    cover_image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    description: 'The Pink City of Rajasthan famous for Hawa Mahal, Amer Fort, royal palaces, and vibrant bazaars.'
  },
  {
    id: 5,
    name: 'Bengaluru',
    country: 'India',
    region: 'Karnataka',
    cost_index: 'Moderate',
    popularity: 92,
    avg_daily_cost: 4000,
    cover_image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80',
    description: 'Silicon Valley of India known for tech hubs, lush Botanical Gardens, craft breweries, and pleasant weather.'
  },
  {
    id: 6,
    name: 'Manali',
    country: 'India',
    region: 'Himachal Pradesh',
    cost_index: 'Moderate',
    popularity: 94,
    avg_daily_cost: 3600,
    cover_image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    description: 'High-altitude Himalayan resort town with snow peaks, Solang Valley sports, and pine forest trails.'
  }
];

class CitiesService {
  async getAllCities(search, region) {
    try {
      let query = `SELECT * FROM cities_catalog WHERE 1=1`;
      const values = [];
      
      if (search) {
        values.push(`%${search}%`);
        query += ` AND (name ILIKE $${values.length} OR country ILIKE $${values.length})`;
      }
      if (region && region !== 'all') {
        values.push(region);
        query += ` AND region = $${values.length}`;
      }
      query += ` ORDER BY popularity DESC`;

      const { rows } = await pool.query(query, values);
      if (rows.length > 0) return rows;
    } catch (err) {
      console.warn('Postgres query fallback to sample cities catalog:', err.message);
    }

    // Fallback sample cities list for zero-setup demo
    let results = SAMPLE_CITIES;
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(c => c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q));
    }
    return results;
  }
}

module.exports = new CitiesService();
