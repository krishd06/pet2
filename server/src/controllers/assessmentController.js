import { getDb } from '../db/index.js';
import { evaluateAssessment } from '../engine/index.js';
import { ExplanationTemplates, RemediationTemplates } from '../models/index.js';

export async function createAssessment(req, res) {
  try {
    const answers = req.body.answers || {};
    const db = getDb();

    // 1. Fetch pets from database
    const petsResult = await db.query('SELECT * FROM pets ORDER BY name ASC');
    const allPets = petsResult.rows || [];

    // 2. Fetch custom scoring weights
    const weightsResult = await db.query('SELECT dimension, weight FROM scoring_weights');
    const scoringWeights = {};
    (weightsResult.rows || []).forEach(r => {
      scoringWeights[r.dimension] = Number(r.weight);
    });

    // 3. Fetch city info
    let cityData = null;
    if (answers.city) {
      const cityResult = await db.query('SELECT * FROM cities WHERE LOWER(name) = LOWER($1)', [answers.city]);
      cityData = cityResult.rows?.[0] || null;
    }

    // 4. Fetch templates from Mongo
    const rawExplanationTemplates = await ExplanationTemplates.find({});
    const explanationTemplates = {};
    rawExplanationTemplates.forEach(t => {
      explanationTemplates[t.dimension] = {
        match: t.matchTemplate,
        friction: t.frictionTemplate,
        ok: t.okTemplate
      };
    });

    const rawRemediationTemplates = await RemediationTemplates.find({});
    const remediationTemplates = {};
    rawRemediationTemplates.forEach(t => {
      if (!remediationTemplates[t.category]) {
        remediationTemplates[t.category] = {
          category: t.issueTrigger,
          actions: []
        };
      }
      remediationTemplates[t.category].actions.push({
        title: t.actionTitle,
        description: t.actionDescription,
        alternative: t.recommendedAlternative
      });
    });

    // 5. Run pure scoring engine
    const evaluation = evaluateAssessment(allPets, answers, {
      scoringWeights,
      cityData,
      cityCostMultiplier: cityData ? Number(cityData.cost_multiplier) : 1.0,
      climateZone: cityData ? cityData.climate_zone : 'composite',
      explanationTemplates,
      remediationTemplates
    });

    // 6. Persist assessment in database
    const assessmentId = 'asm_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    const userId = req.user ? req.user.id : null;
    const guestToken = req.guest ? req.guest.guestId : (req.body.guestToken || null);

    await db.query(
      `INSERT INTO assessments (
        id, user_id, guest_token, readiness_score, readiness_band,
        answers_json, readiness_breakdown_json, top_pet_matches_json, excluded_pets_json
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        assessmentId,
        userId,
        guestToken,
        evaluation.readiness.overallScore,
        evaluation.readiness.band,
        JSON.stringify(answers),
        JSON.stringify(evaluation.readiness.categoryBreakdown),
        JSON.stringify(evaluation.rankedMatches.slice(0, 10)),
        JSON.stringify(evaluation.whyNotShown)
      ]
    );

    return res.status(201).json({
      assessmentId,
      ...evaluation
    });
  } catch (err) {
    console.error('Assessment creation error:', err);
    return res.status(500).json({ error: 'Failed to process assessment: ' + err.message });
  }
}

export async function getAssessmentById(req, res) {
  try {
    const { id } = req.params;
    const db = getDb();
    const result = await db.query('SELECT * FROM assessments WHERE id = $1', [id]);

    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({ error: 'Assessment not found' });
    }

    const row = result.rows[0];
    const answers = JSON.parse(row.answers_json || '{}');
    const readinessBreakdown = JSON.parse(row.readiness_breakdown_json || '{}');
    const topPetMatches = JSON.parse(row.top_pet_matches_json || '[]');
    const whyNotShown = JSON.parse(row.excluded_pets_json || '[]');

    return res.json({
      assessmentId: row.id,
      userId: row.user_id,
      createdAt: row.created_at,
      readiness: {
        overallScore: row.readiness_score,
        band: row.readiness_band,
        categoryBreakdown: readinessBreakdown
      },
      rankedMatches: topPetMatches,
      whyNotShown,
      answers
    });
  } catch (err) {
    console.error('Get assessment error:', err);
    return res.status(500).json({ error: 'Failed to load assessment' });
  }
}

export async function getMyAssessments(req, res) {
  try {
    const db = getDb();
    let rows = [];

    if (req.user) {
      const result = await db.query('SELECT * FROM assessments WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
      rows = result.rows || [];
    } else if (req.guest || req.query.guestToken) {
      const gToken = req.guest ? req.guest.guestId : req.query.guestToken;
      const result = await db.query('SELECT * FROM assessments WHERE guest_token = $1 ORDER BY created_at DESC', [gToken]);
      rows = result.rows || [];
    }

    const formatted = rows.map(r => ({
      id: r.id,
      readinessScore: r.readiness_score,
      readinessBand: r.readiness_band,
      createdAt: r.created_at
    }));

    return res.json({ assessments: formatted });
  } catch (err) {
    console.error('Get my assessments error:', err);
    return res.status(500).json({ error: 'Failed to fetch assessments' });
  }
}
