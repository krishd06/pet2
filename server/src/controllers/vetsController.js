import { getDb } from '../db/index.js';

export async function getVets(req, res) {
  try {
    const { city } = req.query;
    const db = getDb();

    let result;
    if (city) {
      result = await db.query('SELECT * FROM vets WHERE LOWER(city) = LOWER($1) ORDER BY emergency_24x7 DESC, rating DESC', [city]);
    } else {
      result = await db.query('SELECT * FROM vets ORDER BY city ASC, emergency_24x7 DESC, rating DESC');
    }

    return res.json({ vets: result.rows || [] });
  } catch (err) {
    console.error('Get vets error:', err);
    return res.status(500).json({ error: 'Failed to fetch vets' });
  }
}
