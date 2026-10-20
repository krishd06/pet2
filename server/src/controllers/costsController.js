import { getDb } from '../db/index.js';
import { calculatePetOwnershipCosts } from '../engine/costs.js';

export async function getCostForecast(req, res) {
  try {
    const { petId, slug, city } = req.query;
    const db = getDb();

    if (!petId && !slug) {
      return res.status(400).json({ error: 'petId or slug is required' });
    }

    let pet = null;
    if (petId) {
      const petRes = await db.query('SELECT * FROM pets WHERE id = $1', [petId]);
      pet = petRes.rows?.[0];
    } else if (slug) {
      const petRes = await db.query('SELECT * FROM pets WHERE slug = $1', [slug]);
      pet = petRes.rows?.[0];
    }

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    let cityData = null;
    if (city) {
      const cityRes = await db.query('SELECT * FROM cities WHERE LOWER(name) = LOWER($1)', [city]);
      cityData = cityRes.rows?.[0] || city;
    }

    const forecast = calculatePetOwnershipCosts(pet, cityData || 'Mumbai');
    return res.json(forecast);
  } catch (err) {
    console.error('Cost forecast error:', err);
    return res.status(500).json({ error: 'Failed to generate cost forecast' });
  }
}
