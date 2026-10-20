import { getDb } from '../db/index.js';
import { PetContent } from '../models/index.js';

export async function getPets(req, res) {
  try {
    const db = getDb();
    const { species, size, energy, budgetBand, isNative, apartmentFriendly, search } = req.query;

    const result = await db.query('SELECT * FROM pets ORDER BY is_native DESC, name ASC');
    let pets = result.rows || [];

    if (species) {
      pets = pets.filter(p => p.species.toLowerCase() === species.toLowerCase());
    }
    if (size) {
      pets = pets.filter(p => p.size.toLowerCase() === size.toLowerCase());
    }
    if (energy) {
      const e = parseInt(energy, 10);
      pets = pets.filter(p => p.energy_level === e);
    }
    if (budgetBand) {
      pets = pets.filter(p => p.budget_band.toLowerCase() === budgetBand.toLowerCase());
    }
    if (isNative !== undefined) {
      const nat = isNative === 'true' || isNative === true;
      pets = pets.filter(p => Boolean(p.is_native) === nat);
    }
    if (apartmentFriendly !== undefined) {
      const apt = apartmentFriendly === 'true' || apartmentFriendly === true;
      pets = pets.filter(p => Boolean(p.apartment_friendly) === apt);
    }
    if (search) {
      const q = search.toLowerCase();
      pets = pets.filter(p => p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q));
    }

    return res.json({ pets, total: pets.length });
  } catch (err) {
    console.error('Get pets error:', err);
    return res.status(500).json({ error: 'Failed to fetch pets' });
  }
}

export async function getPetBySlug(req, res) {
  try {
    const { slug } = req.params;
    const db = getDb();

    // 1. Fetch SQL attributes
    const result = await db.query('SELECT * FROM pets WHERE slug = $1', [slug]);
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: 'Pet profile not found' });
    }
    const pet = result.rows[0];

    // 2. Fetch rich Mongo content
    const richContent = await PetContent.findOne({ petSlug: slug });

    return res.json({
      pet: {
        ...pet,
        richContent: richContent || null
      }
    });
  } catch (err) {
    console.error('Get pet by slug error:', err);
    return res.status(500).json({ error: 'Failed to fetch pet details' });
  }
}
