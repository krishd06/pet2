import { getDb } from '../db/index.js';
import { PetViewEvents } from '../models/index.js';
import { PRICING_CONFIG } from '../config/pricing.js';
import { createPaymentOrder, processPaymentVerification } from '../services/paymentService.js';

// Get shelter profile for the authenticated shelter account
export async function getMyShelterProfile(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const db = getDb();
    let result = await db.query('SELECT * FROM shelters WHERE user_id = $1', [req.user.id]);
    let shelter = result.rows && result.rows[0];

    // If none exists yet, automatically create an initial one
    if (!shelter) {
      const shelterId = 'sh_' + Math.random().toString(36).substr(2, 9);
      const insert = await db.query(
        `INSERT INTO shelters (id, user_id, name, city, address, phone, email, description, verified, is_featured, plan_name)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
        [
          shelterId,
          req.user.id,
          req.user.name || 'Shelter Partner',
          'Mumbai',
          'Address pending update',
          '+91 98000 00000',
          req.user.email,
          'Dedicated to animal rescue, medical care, and lifelong adoption.',
          false,
          false,
          'Free'
        ]
      );
      shelter = insert.rows && insert.rows[0];
    }

    return res.json({ shelter });
  } catch (err) {
    console.error('Error fetching shelter profile:', err);
    return res.status(500).json({ error: 'Failed to load shelter profile' });
  }
}

// Update shelter profile
export async function updateMyShelterProfile(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { name, city, address, phone, website, description } = req.body;
    const db = getDb();

    const result = await db.query(
      `UPDATE shelters
       SET name = $1, city = $2, address = $3, phone = $4, website = $5, description = $6
       WHERE user_id = $7
       RETURNING *`,
      [name, city, address, phone, website || '', description || '', req.user.id]
    );

    return res.json({ success: true, shelter: result.rows && result.rows[0] });
  } catch (err) {
    console.error('Error updating shelter profile:', err);
    return res.status(500).json({ error: 'Failed to update shelter profile' });
  }
}

// Get pets belonging to shelter with views & inquiry metrics
export async function getMyShelterPets(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const db = getDb();
    const shRes = await db.query('SELECT id, is_featured, verified FROM shelters WHERE user_id = $1', [req.user.id]);
    const shelter = shRes.rows && shRes.rows[0];

    if (!shelter) {
      return res.json({ pets: [] });
    }

    // Fetch animals
    const animalsRes = await db.query(
      `SELECT * FROM animals WHERE shelter_id = $1 ORDER BY created_at DESC`,
      [shelter.id]
    );
    const animals = animalsRes.rows || [];

    // Fetch inquiries counts per animal
    const inqRes = await db.query(
      `SELECT animal_id, COUNT(*) as count FROM inquiries WHERE shelter_id = $1 GROUP BY animal_id`,
      [shelter.id]
    );
    const inqCounts = {};
    (inqRes.rows || []).forEach(r => {
      inqCounts[r.animal_id] = parseInt(r.count, 10);
    });

    // Attach views from MongoDB or animals table and inquiries count
    const enrichedPets = await Promise.all(animals.map(async (pet) => {
      let views = pet.views_count || 0;
      try {
        const mongoViews = await PetViewEvents.find({ animalId: pet.id });
        if (mongoViews && mongoViews.length > views) {
          views = mongoViews.length;
        }
      } catch (e) {
        // Fallback to pet.views_count
      }

      return {
        ...pet,
        viewsCount: views,
        inquiriesCount: inqCounts[pet.id] || 0,
        isFeatured: Boolean(pet.is_featured || shelter.is_featured)
      };
    }));

    return res.json({ pets: enrichedPets });
  } catch (err) {
    console.error('Error fetching shelter pets:', err);
    return res.status(500).json({ error: 'Failed to retrieve shelter pets' });
  }
}

// Add pet listing for shelter
export async function addShelterPet(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const db = getDb();
    const shRes = await db.query('SELECT * FROM shelters WHERE user_id = $1', [req.user.id]);
    const shelter = shRes.rows && shRes.rows[0];
    if (!shelter) {
      return res.status(404).json({ error: 'Shelter profile not found' });
    }

    const {
      name,
      species = 'dog',
      breed,
      pet_id,
      age_months = 12,
      gender = 'male',
      size = 'medium',
      vaccinated = true,
      neutered = true,
      description = '',
      photo_url = '',
      status = 'adoptable',
      city
    } = req.body;

    if (!name || !breed) {
      return res.status(400).json({ error: 'Pet name and breed are required' });
    }

    const id = 'anim_' + Math.random().toString(36).substr(2, 9);
    const isFeatured = Boolean(shelter.is_featured);

    const result = await db.query(
      `INSERT INTO animals (
        id, name, species, breed, pet_id, shelter_id, age_months, gender, size,
        vaccinated, neutered, description, photo_url, status, city, is_featured, views_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *`,
      [
        id,
        name,
        species,
        breed,
        pet_id || null,
        shelter.id,
        parseInt(age_months, 10),
        gender,
        size,
        Boolean(vaccinated),
        Boolean(neutered),
        description,
        photo_url,
        status,
        city || shelter.city,
        isFeatured,
        0
      ]
    );

    return res.status(201).json({ success: true, pet: result.rows && result.rows[0] });
  } catch (err) {
    console.error('Error adding shelter pet:', err);
    return res.status(500).json({ error: 'Failed to create pet listing' });
  }
}

// Update shelter pet
export async function updateShelterPet(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const db = getDb();

    // Verify ownership
    const shRes = await db.query('SELECT id FROM shelters WHERE user_id = $1', [req.user.id]);
    const shelter = shRes.rows && shRes.rows[0];
    if (!shelter) return res.status(404).json({ error: 'Shelter not found' });

    const {
      name,
      species,
      breed,
      age_months,
      gender,
      size,
      vaccinated,
      neutered,
      description,
      photo_url,
      status,
      city
    } = req.body;

    const result = await db.query(
      `UPDATE animals
       SET name = $1, species = $2, breed = $3, age_months = $4, gender = $5, size = $6,
           vaccinated = $7, neutered = $8, description = $9, photo_url = $10, status = $11, city = $12
       WHERE id = $13 AND shelter_id = $14
       RETURNING *`,
      [
        name,
        species,
        breed,
        parseInt(age_months, 10),
        gender,
        size,
        Boolean(vaccinated),
        Boolean(neutered),
        description,
        photo_url,
        status,
        city,
        id,
        shelter.id
      ]
    );

    return res.json({ success: true, pet: result.rows && result.rows[0] });
  } catch (err) {
    console.error('Error updating pet:', err);
    return res.status(500).json({ error: 'Failed to update pet details' });
  }
}

// Delete shelter pet
export async function deleteShelterPet(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const db = getDb();

    const shRes = await db.query('SELECT id FROM shelters WHERE user_id = $1', [req.user.id]);
    const shelter = shRes.rows && shRes.rows[0];
    if (!shelter) return res.status(404).json({ error: 'Shelter not found' });

    await db.query('DELETE FROM animals WHERE id = $1 AND shelter_id = $2', [id, shelter.id]);
    return res.json({ success: true, message: 'Pet listing deleted' });
  } catch (err) {
    console.error('Error deleting pet:', err);
    return res.status(500).json({ error: 'Failed to delete pet listing' });
  }
}

// Inquiries received by this shelter
export async function getShelterInquiries(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const db = getDb();
    const shRes = await db.query('SELECT id FROM shelters WHERE user_id = $1', [req.user.id]);
    const shelter = shRes.rows && shRes.rows[0];
    if (!shelter) return res.json({ inquiries: [] });

    const result = await db.query(
      `SELECT inq.*, a.name as animal_name, a.photo_url as animal_photo
       FROM inquiries inq
       LEFT JOIN animals a ON inq.animal_id = a.id
       WHERE inq.shelter_id = $1
       ORDER BY inq.created_at DESC`,
      [shelter.id]
    );

    return res.json({ inquiries: result.rows || [] });
  } catch (err) {
    console.error('Error fetching inquiries:', err);
    return res.status(500).json({ error: 'Failed to load inquiries' });
  }
}

// Update inquiry status
export async function updateInquiryStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'pending', 'contacted', 'approved', 'rejected'
    const db = getDb();

    await db.query('UPDATE inquiries SET status = $1 WHERE id = $2', [status, id]);
    return res.json({ success: true, message: 'Inquiry status updated' });
  } catch (err) {
    console.error('Error updating inquiry:', err);
    return res.status(500).json({ error: 'Failed to update inquiry' });
  }
}

// Upgrade shelter plan to 'Featured'
export async function createShelterUpgradeOrder(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const db = getDb();
    const shRes = await db.query('SELECT * FROM shelters WHERE user_id = $1', [req.user.id]);
    const shelter = shRes.rows && shRes.rows[0];
    if (!shelter) return res.status(404).json({ error: 'Shelter not found' });

    const featuredPlan = PRICING_CONFIG.shelterPlans.featured;

    const paymentOrder = await createPaymentOrder({
      userId: req.user.id,
      amountInr: featuredPlan.amountInr,
      purpose: 'shelter_featured',
      referenceId: shelter.id
    });

    return res.json({
      plan: featuredPlan,
      paymentOrder
    });
  } catch (err) {
    console.error('Error creating shelter plan order:', err);
    return res.status(500).json({ error: 'Failed to create plan upgrade order' });
  }
}

// Confirm shelter plan upgrade
export async function verifyShelterUpgradePayment(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { orderId, paymentId, simulateFailure = false } = req.body;
    const paymentResult = await processPaymentVerification({
      orderId,
      paymentId,
      status: simulateFailure ? 'failed' : 'captured',
      simulatedFailure: simulateFailure
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Payment failed or cancelled in test simulator.',
        payment: paymentResult.payment
      });
    }

    const db = getDb();
    const shRes = await db.query('SELECT * FROM shelters WHERE user_id = $1', [req.user.id]);
    const shelter = shRes.rows && shRes.rows[0];
    if (!shelter) return res.status(404).json({ error: 'Shelter not found' });

    const planId = 'shplan_' + Math.random().toString(36).substr(2, 9);
    const endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Insert into shelter_plans
    await db.query(
      `INSERT INTO shelter_plans (id, shelter_id, plan_type, status, amount_inr, end_date)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [planId, shelter.id, 'featured', 'active', 999, endDate]
    );

    // Update shelter to is_featured = true, plan_name = 'Featured'
    await db.query(
      `UPDATE shelters SET is_featured = true, plan_name = 'Featured' WHERE id = $1`,
      [shelter.id]
    );

    // Update all this shelter's animals to is_featured = true
    await db.query(
      `UPDATE animals SET is_featured = true WHERE shelter_id = $1`,
      [shelter.id]
    );

    return res.json({
      success: true,
      message: '🌟 Featured Shelter status unlocked! Your shelter badge and pet listings now have prominent priority placement.',
      plan: {
        plan_type: 'featured',
        end_date: endDate
      }
    });
  } catch (err) {
    console.error('Error confirming shelter upgrade:', err);
    return res.status(500).json({ error: 'Failed to verify shelter upgrade' });
  }
}

// Log view event for an animal (called when user views pet card or detail)
export async function logPetView(req, res) {
  try {
    const { id } = req.params;
    const { sid = 'anonymous' } = req.body;
    const db = getDb();

    // Increment count on animals
    await db.query(
      `UPDATE animals SET views_count = COALESCE(views_count, 0) + 1 WHERE id = $1`,
      [id]
    );

    // Get shelter_id
    const animRes = await db.query('SELECT shelter_id FROM animals WHERE id = $1', [id]);
    const shelterId = animRes.rows && animRes.rows[0] ? animRes.rows[0].shelter_id : null;

    // Log to MongoDB PetViewEvents
    await PetViewEvents.create({
      animalId: id,
      shelterId,
      sessionId: sid,
      timestamp: new Date()
    }).catch(e => console.warn('Mongo PetViewEvent note:', e.message));

    return res.json({ success: true });
  } catch (err) {
    console.error('Error logging pet view:', err);
    return res.status(500).json({ error: 'Failed to record view' });
  }
}

// Submit adopter inquiry for a pet
export async function submitInquiry(req, res) {
  try {
    const { animalId, adopterName, adopterEmail, adopterPhone, message } = req.body;
    if (!animalId || !adopterName || !adopterEmail || !adopterPhone) {
      return res.status(400).json({ error: 'Please provide your name, email, and phone number.' });
    }

    const db = getDb();
    const animRes = await db.query('SELECT * FROM animals WHERE id = $1', [animalId]);
    const animal = animRes.rows && animRes.rows[0];
    if (!animal) {
      return res.status(404).json({ error: 'Animal listing not found' });
    }

    const inqId = 'inq_' + Math.random().toString(36).substr(2, 9);
    const userId = req.user ? req.user.id : null;

    await db.query(
      `INSERT INTO inquiries (id, shelter_id, animal_id, user_id, adopter_name, adopter_email, adopter_phone, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        inqId,
        animal.shelter_id,
        animal.id,
        userId,
        adopterName,
        adopterEmail,
        adopterPhone,
        message || `I am interested in adopting ${animal.name}!`,
        'pending'
      ]
    );

    return res.status(201).json({
      success: true,
      message: `Your adoption inquiry for ${animal.name} has been sent to the shelter! They will contact you shortly.`
    });
  } catch (err) {
    console.error('Error submitting inquiry:', err);
    return res.status(500).json({ error: 'Failed to submit inquiry' });
  }
}
