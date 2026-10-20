import { getDb } from '../db/index.js';

export async function getShelters(req, res) {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM shelters ORDER BY city ASC, name ASC');
    return res.json({ shelters: result.rows || [] });
  } catch (err) {
    console.error('Get shelters error:', err);
    return res.status(500).json({ error: 'Failed to fetch shelters' });
  }
}

export async function getAnimals(req, res) {
  try {
    const db = getDb();
    const { city, species, breed, assessmentId, guestToken } = req.query;

    // 1. Fetch animals
    const animalsResult = await db.query(`
      SELECT 
        a.*,
        s.name AS shelter_name,
        s.phone AS shelter_phone,
        s.email AS shelter_email,
        s.website AS shelter_website,
        s.address AS shelter_address,
        p.is_native AS is_native_breed,
        p.slug AS pet_slug
      FROM animals a
      LEFT JOIN shelters s ON a.shelter_id = s.id
      LEFT JOIN pets p ON a.pet_id = p.id
      ORDER BY a.created_at DESC
    `);
    let animals = animalsResult.rows || [];

    // Filters
    if (city) {
      animals = animals.filter(a => a.city.toLowerCase() === city.toLowerCase());
    }
    if (species) {
      animals = animals.filter(a => a.species.toLowerCase() === species.toLowerCase());
    }
    if (breed) {
      animals = animals.filter(a => a.breed.toLowerCase().includes(breed.toLowerCase()));
    }

    // 2. Check for latest assessment to attach breed-level match score
    let latestAssessment = null;
    if (assessmentId) {
      const asmRes = await db.query('SELECT * FROM assessments WHERE id = $1', [assessmentId]);
      latestAssessment = asmRes.rows?.[0];
    } else if (req.user) {
      const asmRes = await db.query('SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [req.user.id]);
      latestAssessment = asmRes.rows?.[0];
    } else if (req.guest || guestToken) {
      const gTok = req.guest ? req.guest.guestId : guestToken;
      const asmRes = await db.query('SELECT * FROM assessments WHERE guest_token = $1 ORDER BY created_at DESC LIMIT 1', [gTok]);
      latestAssessment = asmRes.rows?.[0];
    }

    let matchScoreMap = {};
    if (latestAssessment) {
      try {
        const topMatches = JSON.parse(latestAssessment.top_pet_matches_json || '[]');
        topMatches.forEach(m => {
          if (m.petId) matchScoreMap[m.petId] = m.matchScore;
          if (m.petSlug) matchScoreMap[m.petSlug] = m.matchScore;
        });
      } catch (e) {
        console.warn('Error parsing assessment top matches for animals:', e.message);
      }
    }

    // Attach match score if available
    const enriched = animals.map(anim => {
      const score = matchScoreMap[anim.pet_id] || matchScoreMap[anim.pet_slug] || null;
      return {
        ...anim,
        breedMatchScore: score
      };
    });

    return res.json({
      animals: enriched,
      total: enriched.length,
      hasAssessmentScore: Boolean(latestAssessment)
    });
  } catch (err) {
    console.error('Get animals error:', err);
    return res.status(500).json({ error: 'Failed to fetch animals' });
  }
}

export async function getAnimalById(req, res) {
  try {
    const { id } = req.params;
    const db = getDb();

    const result = await db.query(`
      SELECT 
        a.*,
        s.name AS shelter_name,
        s.phone AS shelter_phone,
        s.email AS shelter_email,
        s.website AS shelter_website,
        s.address AS shelter_address,
        p.is_native AS is_native_breed,
        p.slug AS pet_slug
      FROM animals a
      LEFT JOIN shelters s ON a.shelter_id = s.id
      LEFT JOIN pets p ON a.pet_id = p.id
      WHERE a.id = $1
    `, [id]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    return res.json({ animal: result.rows[0] });
  } catch (err) {
    console.error('Get animal by id error:', err);
    return res.status(500).json({ error: 'Failed to fetch animal details' });
  }
}
