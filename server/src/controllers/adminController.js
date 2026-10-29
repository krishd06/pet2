import { getDb } from '../db/index.js';
import { ClickEvents } from '../models/index.js';

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

    // 3. Total Users
    const usersRes = await db.query('SELECT COUNT(*) as count FROM users');
    const totalUsers = parseInt(usersRes.rows?.[0]?.count || 0, 10);

    // 4. Animal and Shelter counts
    const animalsRes = await db.query('SELECT COUNT(*) as count FROM animals');
    const sheltersRes = await db.query('SELECT COUNT(*) as count FROM shelters');
    const featuredSheltersRes = await db.query('SELECT COUNT(*) as count FROM shelters WHERE is_featured = true');

    // 5. Total Leads
    const leadsRes = await db.query('SELECT COUNT(*) as count FROM leads');
    const totalLeads = parseInt(leadsRes.rows?.[0]?.count || 0, 10);

    // 6. Trial Bookings count
    const trialsRes = await db.query('SELECT COUNT(*) as count FROM trial_bookings');
    const totalTrialBookings = parseInt(trialsRes.rows?.[0]?.count || 0, 10);

    // 7. Clicks by Partner (from MongoDB ClickEvents)
    const clicksByPartner = {};
    try {
      const clickEvents = await ClickEvents.find({});
      clickEvents.forEach(c => {
        clicksByPartner[c.partnerId] = (clicksByPartner[c.partnerId] || 0) + 1;
      });
    } catch (e) {
      console.warn('MongoDB click events note:', e.message);
    }

    // 8. Mock Revenue by Stream (from payments table WHERE status = 'captured')
    const paymentsRes = await db.query('SELECT amount_inr, purpose, status FROM payments WHERE status = $1', ['captured']);
    const revenueByStream = {
      trial_foster: 0,
      shelter_featured: 0,
      premium_subscription: 0,
      total: 0
    };

    (paymentsRes.rows || []).forEach(p => {
      const amt = parseInt(p.amount_inr, 10) || 0;
      if (revenueByStream[p.purpose] !== undefined) {
        revenueByStream[p.purpose] += amt;
      }
      revenueByStream.total += amt;
    });

    // 9. B2B Inquiries count
    const b2bRes = await db.query('SELECT COUNT(*) as count FROM partner_inquiries');
    const totalB2BInquiries = parseInt(b2bRes.rows?.[0]?.count || 0, 10);

    return res.json({
      totalUsers,
      totalAssessments,
      tierDistribution: tierCounts,
      popularPets,
      totalAnimals: parseInt(animalsRes.rows?.[0]?.count || 0, 10),
      totalShelters: parseInt(sheltersRes.rows?.[0]?.count || 0, 10),
      activeFeaturedShelters: parseInt(featuredSheltersRes.rows?.[0]?.count || 0, 10),
      totalLeads,
      totalTrialBookings,
      totalB2BInquiries,
      clicksByPartner,
      revenueByStream
    });
  } catch (err) {
    console.error('Get admin stats error:', err);
    return res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
}

// Mark shelter verified
export async function verifyShelter(req, res) {
  try {
    const { id } = req.params;
    const { verified = true } = req.body;
    const db = getDb();

    await db.query(
      `UPDATE shelters SET verified = $1 WHERE id = $2`,
      [Boolean(verified), id]
    );

    return res.json({ success: true, message: `Shelter marked ${verified ? 'verified' : 'unverified'}` });
  } catch (err) {
    console.error('Verify shelter error:', err);
    return res.status(500).json({ error: 'Failed to verify shelter' });
  }
}

// Get all partners for admin control
export async function getAdminPartners(req, res) {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM partners ORDER BY name ASC');
    return res.json({ partners: result.rows || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch partners' });
  }
}

// Toggle partner active/inactive
export async function togglePartner(req, res) {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const db = getDb();

    await db.query('UPDATE partners SET active = $1 WHERE id = $2', [Boolean(active), id]);
    return res.json({ success: true, message: `Partner ${active ? 'activated' : 'deactivated'}` });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to toggle partner' });
  }
}

// Get all service providers for admin control
export async function getAdminProviders(req, res) {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM service_providers ORDER BY category ASC, name ASC');
    return res.json({ providers: result.rows || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch providers' });
  }
}

// Toggle provider active/inactive
export async function toggleProvider(req, res) {
  try {
    const { id } = req.params;
    const { active, verified } = req.body;
    const db = getDb();

    if (active !== undefined) {
      await db.query('UPDATE service_providers SET active = $1 WHERE id = $2', [Boolean(active), id]);
    }
    if (verified !== undefined) {
      await db.query('UPDATE service_providers SET verified = $1 WHERE id = $2', [Boolean(verified), id]);
    }

    return res.json({ success: true, message: 'Provider updated' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to toggle provider' });
  }
}

// Get leads list for admin
export async function getAdminLeads(req, res) {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT l.*, sp.name as provider_name, sp.category as provider_category
      FROM leads l
      LEFT JOIN service_providers sp ON l.provider_id = sp.id
      ORDER BY l.created_at DESC
    `);
    return res.json({ leads: result.rows || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load leads' });
  }
}

// Get trial bookings list for admin
export async function getAdminTrials(req, res) {
  try {
    const db = getDb();
    const result = await db.query(`
      SELECT tb.*, u.email as user_email
      FROM trial_bookings tb
      LEFT JOIN users u ON tb.user_id = u.id
      ORDER BY tb.created_at DESC
    `);
    return res.json({ trials: result.rows || [] });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load trial bookings' });
  }
}

// Standard shelter & animal operations
export async function createAnimal(req, res) {
  try {
    const db = getDb();
    const {
      name, species, breed, pet_id, shelter_id, age_months, gender, size,
      vaccinated, neutered, description, photo_url, status, city, is_featured
    } = req.body;

    const id = 'anim_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

    const result = await db.query(`
      INSERT INTO animals (
        id, name, species, breed, pet_id, shelter_id, age_months, gender, size,
        vaccinated, neutered, description, photo_url, status, city, is_featured, views_count
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, 0)
      RETURNING *
    `, [
      id, name, species || 'dog', breed || 'Mixed Breed', pet_id || null, shelter_id || null,
      Number(age_months) || 12, gender || 'male', size || 'medium',
      vaccinated !== undefined ? Boolean(vaccinated) : true,
      neutered !== undefined ? Boolean(neutered) : true,
      description || '', photo_url || '', status || 'adoptable', city || 'Mumbai',
      Boolean(is_featured)
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
      vaccinated, neutered, description, photo_url, status, city, is_featured
    } = req.body;

    const result = await db.query(`
      UPDATE animals
      SET name = $1, species = $2, breed = $3, pet_id = $4, shelter_id = $5,
          age_months = $6, gender = $7, size = $8, vaccinated = $9, neutered = $10,
          description = $11, photo_url = $12, status = $13, city = $14, is_featured = $15
      WHERE id = $16
      RETURNING *
    `, [
      name, species, breed, pet_id || null, shelter_id || null,
      Number(age_months) || 12, gender || 'male', size || 'medium',
      vaccinated !== undefined ? Boolean(vaccinated) : true,
      neutered !== undefined ? Boolean(neutered) : true,
      description || '', photo_url || '', status || 'adoptable', city || 'Mumbai',
      Boolean(is_featured), id
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
    const { name, city, address, phone, email, website, description, verified, is_featured } = req.body;
    const id = 'sh_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

    const result = await db.query(`
      INSERT INTO shelters (id, name, city, address, phone, email, website, description, verified, is_featured, plan_name)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      id, name, city || 'Mumbai', address || '', phone || '', email || '',
      website || '', description || '',
      verified !== undefined ? Boolean(verified) : true,
      Boolean(is_featured),
      is_featured ? 'Featured' : 'Free'
    ]);

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
    const { name, city, address, phone, email, website, description, verified, is_featured } = req.body;

    const result = await db.query(`
      UPDATE shelters
      SET name = $1, city = $2, address = $3, phone = $4, email = $5,
          website = $6, description = $7, verified = $8, is_featured = $9
      WHERE id = $10
      RETURNING *
    `, [
      name, city, address, phone, email, website, description,
      Boolean(verified), Boolean(is_featured), id
    ]);

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

export async function triggerSupabaseSeed(req, res) {
  try {
    const { runSupabaseSeed } = await import('../../../supabase/seed/seed.js');
    const result = await runSupabaseSeed();
    return res.json({ success: true, message: 'Supabase database seeding completed successfully.', result });
  } catch (err) {
    console.error('Trigger Supabase seed error:', err);
    return res.status(500).json({ error: 'Supabase seeding failed', message: err.message });
  }
}

