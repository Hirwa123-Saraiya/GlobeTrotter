const pool = require('../config/db');

const SAMPLE_ACTIVITIES = [
  {
    id: 1,
    city_name: 'Mumbai',
    title: 'Heritage Sunset Walk at Gateway of India & Taj Mahal Palace',
    category: 'Sightseeing',
    estimated_cost: 0,
    duration: '2 Hours',
    cover_image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    description: 'Walk along Apollo Bunder harbor enjoying panoramic Arabian Sea views and British colonial architecture.'
  },
  {
    id: 2,
    city_name: 'Mumbai',
    title: 'Authentic Street Food Tasting in Mohammad Ali Road',
    category: 'Food & Dining',
    estimated_cost: 1200,
    duration: '3 Hours',
    cover_image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    description: 'Guided evening food crawl trying Vada Pav, Kebabs, Falooda, and Malpua.'
  },
  {
    id: 3,
    city_name: 'Goa',
    title: 'Scuba Diving & Water Sports at Grande Island',
    category: 'Adventure',
    estimated_cost: 3500,
    duration: '5 Hours',
    cover_image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    description: 'Boat ride to Grande Island including scuba training, underwater photography, and parasailing.'
  },
  {
    id: 4,
    city_name: 'Goa',
    title: 'Fontainhas Latin Quarter Heritage Architecture Walk',
    category: 'Culture & Heritage',
    estimated_cost: 800,
    duration: '2 Hours',
    cover_image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    description: 'Explore bright pastel-colored Portuguese houses, art galleries, and historic churches in Panjim.'
  },
  {
    id: 5,
    city_name: 'Delhi',
    title: 'Rickshaw Tour of Old Delhi & Chandni Chowk Spice Market',
    category: 'Culture & Heritage',
    estimated_cost: 1500,
    duration: '3 Hours',
    cover_image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
    description: 'Ride through historic narrow alleys visiting Asia’s largest spice market and Jama Masjid.'
  },
  {
    id: 6,
    city_name: 'Jaipur',
    title: 'Sunset Views & Elephant Safari at Amer Fort',
    category: 'Sightseeing',
    estimated_cost: 2200,
    duration: '4 Hours',
    cover_image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    description: 'Hilltop fort tour with intricate mirror work (Sheesh Mahal) and breathtaking views over Maota Lake.'
  }
];

class ActivitiesService {
  async getAllActivities(search, category) {
    try {
      let query = `SELECT * FROM activities_catalog WHERE 1=1`;
      const values = [];

      if (search) {
        values.push(`%${search}%`);
        query += ` AND (title ILIKE $${values.length} OR category ILIKE $${values.length})`;
      }
      if (category && category !== 'all') {
        values.push(category);
        query += ` AND category = $${values.length}`;
      }

      const { rows } = await pool.query(query, values);
      if (rows.length > 0) return rows;
    } catch (err) {
      console.warn('Postgres query fallback to sample activities catalog:', err.message);
    }

    let results = SAMPLE_ACTIVITIES;
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.city_name.toLowerCase().includes(q));
    }
    if (category && category !== 'all') {
      results = results.filter(a => a.category === category);
    }
    return results;
  }
}

module.exports = new ActivitiesService();
