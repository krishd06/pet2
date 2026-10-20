import { QuestionnaireDefinition } from '../models/index.js';
import { QUESTIONNAIRE_STEPS } from '../seed/seedData.js';

export async function getQuestionnaire(req, res) {
  try {
    const doc = await QuestionnaireDefinition.findOne({});
    if (doc && doc.steps && doc.steps.length > 0) {
      return res.json({
        version: doc.version || 1,
        steps: doc.steps
      });
    }

    // Fallback to in-code steps definition if DB not populated yet
    return res.json({
      version: 1,
      steps: QUESTIONNAIRE_STEPS
    });
  } catch (err) {
    console.error('Get questionnaire error:', err);
    return res.json({
      version: 1,
      steps: QUESTIONNAIRE_STEPS
    });
  }
}
