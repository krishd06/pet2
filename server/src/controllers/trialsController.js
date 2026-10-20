import { getDb } from '../db/index.js';

export const TRIAL_GUIDE = {
  title: 'Self-Managed Pet Foster Trial Guide',
  subtitle: 'Test your real lifestyle compatibility and verify allergies with zero long-term pressure.',
  recommendedDurations: [
    { days: 2, label: 'Weekend Trial (48 Hours)', description: 'Best for verifying household allergies, pet dander reactions, and family comfort.' },
    { days: 7, label: 'One-Week Trial (7 Days)', description: 'Recommended to observe full weekday work schedules and alone-time behavior.' },
    { days: 14, label: 'Two-Week Trial (14 Days)', description: 'Complete decompression trial following the 3-day adjustment rule.' }
  ],
  checklist: [
    'Secure balcony pigeon nets and window screens before arrival.',
    'Stock introductory food brand from the foster caretaker to avoid stomach upset.',
    'Have a designated quiet bed corner with water bowl.',
    'Keep veterinary emergency contacts saved on phone.',
    'Observe household members for sneezing, watery eyes, or skin itchiness.',
    'Log daily exercise, barking/meowing, and calm rest habits in the PawMatch outcome logger.'
  ],
  rules: [
    'Never leave a foster pet unleashed in unfenced public areas.',
    'Do not force interactions if the pet retreats to their bed during decompression.',
    'Reach out to the shelter coordinator for any guidance or routine questions.'
  ]
};

export async function createFosterTrial(req, res) {
  try {
    const { animalId, petId, durationDays, startDate, notes } = req.body;
    const db = getDb();

    const id = 'trl_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    const userId = req.user ? req.user.id : null;
    const guestToken = req.guest ? req.guest.guestId : (req.body.guestToken || null);

    const days = [2, 7, 14].includes(Number(durationDays)) ? Number(durationDays) : 7;
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);

    await db.query(`
      INSERT INTO foster_trials (
        id, user_id, guest_token, animal_id, pet_id, trial_duration_days,
        status, start_date, end_date, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    `, [
      id, userId, guestToken, animalId || null, petId || null,
      days, 'in_progress', start.toISOString().split('T')[0], end.toISOString().split('T')[0], notes || ''
    ]);

    return res.status(201).json({
      message: 'Foster trial planned successfully!',
      trial: {
        id,
        durationDays: days,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        status: 'in_progress',
        animalId,
        petId
      }
    });
  } catch (err) {
    console.error('Create foster trial error:', err);
    return res.status(500).json({ error: 'Failed to create foster trial plan' });
  }
}

export async function updateTrialOutcome(req, res) {
  try {
    const { id } = req.params;
    const { allergySymptoms, fitRating, notes, status } = req.body;
    const db = getDb();

    const rating = fitRating !== undefined ? Math.max(1, Math.min(5, Number(fitRating))) : null;
    const allergy = allergySymptoms !== undefined ? Boolean(allergySymptoms) : null;
    const newStatus = status || 'completed';

    const result = await db.query(`
      UPDATE foster_trials
      SET allergy_symptoms = $1,
          fit_rating = $2,
          notes = $3,
          status = $4,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `, [allergy, rating, notes || '', newStatus, id]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: 'Foster trial record not found' });
    }

    return res.json({
      message: 'Trial outcome updated successfully!',
      trial: result.rows[0]
    });
  } catch (err) {
    console.error('Update trial outcome error:', err);
    return res.status(500).json({ error: 'Failed to update trial outcome' });
  }
}

export async function getMyTrials(req, res) {
  try {
    const db = getDb();
    let rows = [];

    if (req.user) {
      const result = await db.query(`
        SELECT t.*, a.name AS animal_name, a.photo_url AS animal_photo, p.name AS pet_name
        FROM foster_trials t
        LEFT JOIN animals a ON t.animal_id = a.id
        LEFT JOIN pets p ON t.pet_id = p.id
        WHERE t.user_id = $1
        ORDER BY t.created_at DESC
      `, [req.user.id]);
      rows = result.rows || [];
    } else if (req.guest || req.query.guestToken) {
      const gTok = req.guest ? req.guest.guestId : req.query.guestToken;
      const result = await db.query(`
        SELECT t.*, a.name AS animal_name, a.photo_url AS animal_photo, p.name AS pet_name
        FROM foster_trials t
        LEFT JOIN animals a ON t.animal_id = a.id
        LEFT JOIN pets p ON t.pet_id = p.id
        WHERE t.guest_token = $1
        ORDER BY t.created_at DESC
      `, [gTok]);
      rows = result.rows || [];
    }

    return res.json({ trials: rows });
  } catch (err) {
    console.error('Get my trials error:', err);
    return res.status(500).json({ error: 'Failed to fetch foster trials' });
  }
}

export function getTrialGuide(req, res) {
  return res.json(TRIAL_GUIDE);
}
