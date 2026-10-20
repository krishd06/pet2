import { getDb } from '../db/index.js';

export async function getStats(req, res) {
  try {
    const db = getDb();

    // 1. Total assessments
    const assessmentsRes = await db.query('SELECT * FROM assessments');
    const assessments = assessmentsRes.rows || [];
    const totalAssessments = assessments.length;

    // 2. Tier distribution and popular pets
    const tierCounts = {
      'Highly Compatible': 0,
      'Consider Carefully': 0,
      'Low Match': 0
    };
    const petMatchCounts = {};

    assessments.forEach(asm => {
      try {
        const topMatches = JSON.parse(asm.top_pet_matches_json || '[]');
        if (topMatches.length > 0) {
          const topOne = topMatches[0];
          const tier = topOne.tier || 'Highly Compatible';
          tierCounts[tier] = (tierCounts[tier] || 0) + 1;

          const pName = topOne.petName || topOne.petSlug || 'Indian Pariah';
          petMatchCounts[pName] = (petMatchCounts[pName] || 0) + 1;
        }
      } catch (e) {
        // ignore parse error on bad row
      }
    });

    const popularPets = Object.entries(petMatchCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 3. Animal and Shelter counts
    const animalsRes = await db.query('SELECT COUNT(*) as count FROM animals');
    const sheltersRes = await db.query('SELECT COUNT(*) as count FROM shelters');

    return res.json({
      totalAssessments,
      tierDistribution: tierCounts,
      popularPets,
      totalAnimals: parseInt(animalsRes.rows?.[0]?.count || 0, 10),
      totalShelters: parseInt(sheltersRes.rows?.[0]?.count || 0, 10)
    });
  } catch (err) {
    console.error('Get admin stats error:', err);
    return res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
}

export async function createAnimal(req, res) {
  try {
    const db = getDb();
    const {
      name, species, breed, pet_id, shelter_id, age_months, gender, size,
      vaccinated, neutered, description, photo_url, status, city
    } = req.body;

    const id = 'anim_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

    const result = await db.query(`
      INSERT INTO animals (
        id, name, species, breed, pet_id, shelter_id, age_months, gender, size,
        vaccinated, neutered, description, photo_url, status, city
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `, [
      id, name, species || 'dog', breed || 'Mixed Breed', pet_id || null, shelter_id || null,
      Number(age_months) || 12, gender || 'male', size || 'medium',
      vaccinated !== undefined ? Boolean(vaccinated) : true,
      neutered !== undefined ? Boolean(neutered) : true,
      description || '', photo_url || '', status || 'adoptable', city || 'Mumbai'
    ]);

    return res.status(201).json({ animal: result.rows[0] });
  } catch (err) {
    console.error('Create animal error:', err);
    return res.status(500).json({ error: 'Failed to create animal' });
  }
}

export async function updateAnimal(req, res) {
  try {
    const { id } = req.params;
    const db = getDb();
    const {
      name, species, breed, pet_id, shelter_id, age_months, gender, size,
      vaccinated, neutered, description, photo_url, status, city
    } = req.body;

    const result = await db.query(`
      UPDATE animals
      SET name = $1, species = $2, breed = $3, pet_id = $4, shelter_id = $5,
          age_months = $6, gender = $7, size = $8, vaccinated = $9, neutered = $10,
          description = $11, photo_url = $12, status = $13, city = $14
      WHERE id = $15
      RETURNING *
    `, [
      name, species, breed, pet_id, shelter_id,
      Number(age_months), gender, size,
      Boolean(vaccinated), Boolean(neutered),
      description, photo_url, status, city,
      id
    ]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: 'Animal not found' });
    }

    return res.json({ animal: result.rows[0] });
  } catch (err) {
    console.error('Update animal error:', err);
    return res.status(500).json({ error: 'Failed to update animal' });
  }
}

export async function deleteAnimal(req, res) {
  try {
    const { id } = req.params;
    const db = getDb();
    await db.query('DELETE FROM animals WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Animal deleted' });
  } catch (err) {
    console.error('Delete animal error:', err);
    return res.status(500).json({ error: 'Failed to delete animal' });
  }
}

export async function createShelter(req, res) {
  try {
    const db = getDb();
    const { name, city, address, phone, email, website, description } = req.body;
    const id = 'sh_' + Math.random().toString(36).substr(2, 9);

    const result = await db.query(`
      INSERT INTO shelters (id, name, city, address, phone, email, website, description, verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [id, name, city, address, phone, email, website || '', description || '', true]);

    return res.status(201).json({ shelter: result.rows[0] });
  } catch (err) {
    console.error('Create shelter error:', err);
    return res.status(500).json({ error: 'Failed to create shelter' });
  }
}

export async function updateShelter(req, res) {
  try {
    const { id } = req.params;
    const db = getDb();
    const { name, city, address, phone, email, website, description } = req.body;

    const result = await db.query(`
      UPDATE shelters
      SET name = $1, city = $2, address = $3, phone = $4, email = $5,
          website = $6, description = $7
      WHERE id = $8
      RETURNING *
    `, [name, city, address, phone, email, website, description, id]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: 'Shelter not found' });
    }

    return res.json({ shelter: result.rows[0] });
  } catch (err) {
    console.error('Update shelter error:', err);
    return res.status(500).json({ error: 'Failed to update shelter' });
  }
}

export async function deleteShelter(req, res) {
  try {
    const { id } = req.params;
    const db = getDb();
    await db.query('DELETE FROM shelters WHERE id = $1', [id]);
    return res.json({ success: true, message: 'Shelter deleted' });
  } catch (err) {
    console.error('Delete shelter error:', err);
    return res.status(500).json({ error: 'Failed to delete shelter' });
  }
}
