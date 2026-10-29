import { getDb } from '../db/index.js';
import { ClickEvents } from '../models/index.js';

// Get active partners with simple rule matching
export async function getPartners(req, res) {
  try {
    const { category, city, species, size, firstTime, budget } = req.query;
    const db = getDb();

    let query = 'SELECT * FROM partners WHERE active = true';
    const params = [];

    if (category) {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }

    const result = await db.query(query, params);
    let partners = result.rows || [];

    // Filter by city if partner is city-specific (null city means national)
    if (city) {
      partners = partners.filter(p => !p.city || p.city.toLowerCase() === city.toLowerCase());
    }

    // Rule-based relevance sorting
    partners = partners.map(p => {
      let relevanceScore = 0;
      const tags = (p.target_tags || '').toLowerCase();

      if (species && tags.includes(species.toLowerCase())) relevanceScore += 3;
      if (size && tags.includes(size.toLowerCase())) relevanceScore += 2;
      if (firstTime === 'true' && tags.includes('first_time')) relevanceScore += 2;
      if (budget && tags.includes(budget.toLowerCase())) relevanceScore += 1;

      return { ...p, relevanceScore };
    });

    // Sort by relevance score descending
    partners.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return res.json({ partners });
  } catch (err) {
    console.error('Error fetching partners:', err);
    return res.status(500).json({ error: 'Failed to retrieve partners' });
  }
}

// Outbound click tracking route: /go/:partnerId
export async function trackOutboundClick(req, res) {
  try {
    const { partnerId } = req.params;
    const { from = 'website', sid = 'anonymous' } = req.query;
    const db = getDb();

    // Look up partner in Neon / PostgreSQL
    const result = await db.query('SELECT * FROM partners WHERE id = $1', [partnerId]);
    const partner = result.rows && result.rows[0];

    // Log click event asynchronously to MongoDB Atlas
    await ClickEvents.create({
      partnerId,
      sourcePage: from,
      sessionId: sid,
      timestamp: new Date()
    }).catch(e => console.warn('Click event MongoDB log warning:', e.message));

    if (!partner || !partner.url) {
      return res.redirect('/?partner_not_found=1');
    }

    // Redirect to partner destination
    return res.redirect(302, partner.url);
  } catch (err) {
    console.error('Outbound redirect error:', err);
    return res.redirect('/');
  }
}

// Admin toggle partner active/inactive
export async function togglePartnerActive(req, res) {
  try {
    const { id } = req.params;
    const { active } = req.body;
    const db = getDb();

    await db.query(
      `UPDATE partners SET active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [Boolean(active), id]
    );

    return res.json({ success: true, message: `Partner ${active ? 'activated' : 'deactivated'}` });
  } catch (err) {
    console.error('Toggle partner error:', err);
    return res.status(500).json({ error: 'Failed to update partner status' });
  }
}

