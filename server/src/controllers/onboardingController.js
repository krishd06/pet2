import { OnboardingGuides } from '../models/index.js';
import { getDb } from '../db/index.js';
import { ONBOARDING_DOG_PLAN, ONBOARDING_CAT_PLAN } from '../seed/seedData.js';

export async function getOnboardingPlan(req, res) {
  try {
    const { species } = req.params;
    const cleanSpecies = (species || 'dog').toLowerCase();

    let plan = await OnboardingGuides.findOne({ species: cleanSpecies });
    if (!plan) {
      plan = cleanSpecies === 'cat' ? ONBOARDING_CAT_PLAN : ONBOARDING_DOG_PLAN;
    }

    return res.json({ plan });
  } catch (err) {
    console.error('Get onboarding plan error:', err);
    return res.status(500).json({ error: 'Failed to fetch onboarding plan' });
  }
}

export async function updateProgress(req, res) {
  try {
    const { species, checklistItemId, completed } = req.body;
    const db = getDb();

    const userId = req.user ? req.user.id : (req.guest ? req.guest.guestId : req.body.guestToken);
    if (!userId) {
      return res.status(400).json({ error: 'User or guest identity required' });
    }

    const id = `prog_${userId}_${checklistItemId}`;
    const isCompleted = completed !== undefined ? Boolean(completed) : true;

    await db.query(`
      INSERT INTO onboarding_progress (id, user_id, species, checklist_item_id, completed)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id, checklist_item_id) DO UPDATE SET
        completed = EXCLUDED.completed,
        completed_at = CURRENT_TIMESTAMP
    `, [id, userId, species || 'dog', checklistItemId, isCompleted]);

    return res.json({
      success: true,
      checklistItemId,
      completed: isCompleted
    });
  } catch (err) {
    console.error('Update onboarding progress error:', err);
    return res.status(500).json({ error: 'Failed to update progress' });
  }
}

export async function getProgress(req, res) {
  try {
    const { species } = req.params;
    const db = getDb();

    const userId = req.user ? req.user.id : (req.guest ? req.guest.guestId : req.query.guestToken);
    if (!userId) {
      return res.json({ completedItems: [] });
    }

    const result = await db.query(`
      SELECT checklist_item_id, completed
      FROM onboarding_progress
      WHERE user_id = $1 AND species = $2 AND completed = TRUE
    `, [userId, species || 'dog']);

    const completedItems = (result.rows || []).map(r => r.checklist_item_id);
    return res.json({ completedItems });
  } catch (err) {
    console.error('Get onboarding progress error:', err);
    return res.status(500).json({ error: 'Failed to get progress' });
  }
}
