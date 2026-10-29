import { getDb } from '../db/index.js';
import { QuizSnapshots } from '../models/index.js';

// Save B2B partner inquiry (housing societies, companies, corporate welfare, brands)
export async function submitB2BInquiry(req, res) {
  try {
    const { organizationName, organizationType, contactPerson, email, phone, city, message } = req.body;

    if (!organizationName || !contactPerson || !email || !phone) {
      return res.status(400).json({ error: 'Please provide organization name, contact person, email, and phone' });
    }

    const db = getDb();
    const id = 'b2b_' + Math.random().toString(36).substr(2, 9);

    await db.query(
      `INSERT INTO partner_inquiries (id, organization_name, organization_type, contact_person, email, phone, city, message, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        id,
        organizationName,
        organizationType || 'society',
        contactPerson,
        email,
        phone,
        city || 'National',
        message || 'Interested in PawMatch Partner Solutions',
        'pending'
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your institutional partnership inquiry has been received. Our B2B coordinator will be in touch.'
    });
  } catch (err) {
    console.error('Error submitting B2B inquiry:', err);
    return res.status(500).json({ error: 'Failed to record partnership inquiry' });
  }
}

// Get B2B inquiries for admin
export async function getB2BInquiries(req, res) {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM partner_inquiries ORDER BY created_at DESC');
    return res.json({ inquiries: result.rows || [] });
  } catch (err) {
    console.error('Error fetching B2B inquiries:', err);
    return res.status(500).json({ error: 'Failed to retrieve partner inquiries' });
  }
}

// Log anonymised aggregate quiz outcome with explicit user consent (MongoDB Atlas)
// CRITICAL: NEVER store names, emails, phone numbers, or user IDs here.
export async function logConsentedQuizSnapshot(req, res) {
  try {
    const { consented, speciesPreference, city, homeType, readinessBand, topPetSlug, matchScore } = req.body;

    // Respect consent checkbox: only store if consented === true
    if (!consented) {
      return res.json({ recorded: false, message: 'Consent not granted; analytics omitted.' });
    }

    await QuizSnapshots.create({
      consented: true,
      speciesPreference: speciesPreference || 'all',
      city: city || 'Unspecified',
      homeType: homeType || 'apartment',
      readinessBand: readinessBand || 'moderate',
      topPetSlug: topPetSlug || 'indian-pariah-dog',
      matchScore: matchScore || 0,
      timestamp: new Date()
    });

    return res.json({ recorded: true, message: 'Anonymised statistical outcome recorded with consent.' });
  } catch (err) {
    console.warn('Quiz snapshot log error:', err.message);
    return res.json({ recorded: false });
  }
}

// Aggregate aggregate analytics for B2B and Admin
export async function getAnonymisedQuizAnalytics(req, res) {
  try {
    const snapshots = await QuizSnapshots.find({ consented: true });

    // Aggregate metrics
    const totalSnapshots = snapshots.length;
    const cityBreakdown = {};
    const speciesBreakdown = {};
    const readinessBandBreakdown = {};

    snapshots.forEach(s => {
      cityBreakdown[s.city] = (cityBreakdown[s.city] || 0) + 1;
      speciesBreakdown[s.speciesPreference] = (speciesBreakdown[s.speciesPreference] || 0) + 1;
      readinessBandBreakdown[s.readinessBand] = (readinessBandBreakdown[s.readinessBand] || 0) + 1;
    });

    return res.json({
      totalConsentedAssessments: totalSnapshots,
      cityBreakdown,
      speciesBreakdown,
      readinessBandBreakdown
    });
  } catch (err) {
    console.error('Error fetching analytics:', err);
    return res.status(500).json({ error: 'Failed to load aggregate analytics' });
  }
}
