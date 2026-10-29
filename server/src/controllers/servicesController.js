import { getDb } from '../db/index.js';

// Get service providers filterable by city and category
export async function getServiceProviders(req, res) {
  try {
    const { city, category } = req.query;
    const db = getDb();

    let query = 'SELECT * FROM service_providers WHERE active = true';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    if (city) {
      params.push(city);
      query += ` AND LOWER(city) = LOWER($${params.length})`;
    }

    query += ' ORDER BY rating DESC, reviews_count DESC';

    const result = await db.query(query, params);
    return res.json({ providers: result.rows || [] });
  } catch (err) {
    console.error('Error fetching service providers:', err);
    return res.status(500).json({ error: 'Failed to retrieve service providers' });
  }
}

// Request a quote lead submission
export async function submitServiceLead(req, res) {
  try {
    const { providerId } = req.params;
    const { name, contact, petDetails, message, consent } = req.body;

    if (!name || !contact) {
      return res.status(400).json({ error: 'Name and contact details (phone or email) are required' });
    }

    if (consent === false) {
      return res.status(400).json({ error: 'Consent to share details with the provider is required' });
    }

    const db = getDb();
    const provRes = await db.query('SELECT * FROM service_providers WHERE id = $1', [providerId]);
    const provider = provRes.rows && provRes.rows[0];
    if (!provider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    const leadId = 'lead_' + Math.random().toString(36).substr(2, 9);
    const userId = req.user ? req.user.id : null;

    await db.query(
      `INSERT INTO leads (id, provider_id, user_id, customer_name, customer_contact, pet_details, message, consent, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        leadId,
        provider.id,
        userId,
        name,
        contact,
        petDetails || '',
        message || 'Interested in booking services',
        Boolean(consent),
        'new'
      ]
    );

    return res.status(201).json({
      success: true,
      message: `Quote request sent to ${provider.name}! They will contact you shortly via ${contact}.`
    });
  } catch (err) {
    console.error('Error submitting lead:', err);
    return res.status(500).json({ error: 'Failed to submit quote request' });
  }
}

// Get leads for provider / admin
export async function getProviderLeads(req, res) {
  try {
    const db = getDb();
    const { providerId } = req.query;

    let query = `
      SELECT l.*, sp.name as provider_name, sp.category as provider_category, sp.city as provider_city
      FROM leads l
      LEFT JOIN service_providers sp ON l.provider_id = sp.id
    `;
    const params = [];

    if (providerId) {
      params.push(providerId);
      query += ` WHERE l.provider_id = $1`;
    }

    query += ' ORDER BY l.created_at DESC';

    const result = await db.query(query, params);
    return res.json({ leads: result.rows || [] });
  } catch (err) {
    console.error('Error fetching leads:', err);
    return res.status(500).json({ error: 'Failed to retrieve quote leads' });
  }
}

// Toggle provider active / verified (admin)
export async function toggleProviderStatus(req, res) {
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

    return res.json({ success: true, message: 'Provider status updated' });
  } catch (err) {
    console.error('Error updating provider status:', err);
    return res.status(500).json({ error: 'Failed to update provider' });
  }
}
