import express from 'express';
import { checkDbHealth } from '../db/index.js';
import { checkMongoHealth } from '../db/mongo.js';
import { register, login, getMe, createGuestToken } from '../controllers/authController.js';
import { getQuestionnaire } from '../controllers/questionnaireController.js';
import { createAssessment, getAssessmentById, getMyAssessments } from '../controllers/assessmentController.js';
import { getPets, getPetBySlug } from '../controllers/petsController.js';
import { getCostForecast } from '../controllers/costsController.js';
import { getShelters, getAnimals, getAnimalById } from '../controllers/sheltersController.js';
import { createFosterTrial, updateTrialOutcome, getMyTrials, getTrialGuide } from '../controllers/trialsController.js';
import { getOnboardingPlan, updateProgress, getProgress } from '../controllers/onboardingController.js';
import { getVets } from '../controllers/vetsController.js';
import { sendMessage, getConversationHistory } from '../controllers/advisorController.js';
import {
  getStats,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  createShelter,
  updateShelter,
  deleteShelter
} from '../controllers/adminController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Health check endpoint (checks both SQL and MongoDB)
router.get('/health', async (req, res) => {
  const [sqlHealth, mongoHealth] = await Promise.all([
    checkDbHealth(),
    checkMongoHealth()
  ]);

  const isHealthy = sqlHealth.status === 'healthy' && mongoHealth.status === 'healthy';
  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'PawMatch India API',
    timestamp: new Date().toISOString(),
    databases: {
      sql: sqlHealth,
      mongodb: mongoHealth
    }
  });
});

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', requireAuth, getMe);
router.post('/auth/guest-token', createGuestToken);

// Questionnaire Routes
router.get('/questionnaire', getQuestionnaire);

// Assessment Routes
router.post('/assessments', createAssessment);
router.get('/assessments/mine', getMyAssessments);
router.get('/assessments/:id', getAssessmentById);

// Pet Catalog Routes
router.get('/pets', getPets);
router.get('/pets/:slug', getPetBySlug);

// Cost Forecaster Route
router.get('/costs/forecast', getCostForecast);

// Shelters & Adoptable Animals Routes
router.get('/shelters', getShelters);
router.get('/animals', getAnimals);
router.get('/animals/:id', getAnimalById);

// Foster Trials Routes
router.get('/foster-trials/guide', getTrialGuide);
router.post('/foster-trials', createFosterTrial);
router.patch('/foster-trials/:id', updateTrialOutcome);
router.get('/foster-trials/mine', getMyTrials);

// Onboarding First 30 Days Routes
router.get('/onboarding/:species', getOnboardingPlan);
router.patch('/onboarding/progress', updateProgress);
router.get('/onboarding/progress/:species', getProgress);

// Vet Directory
router.get('/vets', getVets);

// AI Pet Advisor Routes
router.post('/advisor/message', sendMessage);
router.get('/advisor/conversations/:id', getConversationHistory);

// Admin Routes (Protected with requireAdmin)
router.get('/admin/stats', requireAdmin, getStats);
router.post('/admin/animals', requireAdmin, createAnimal);
router.put('/admin/animals/:id', requireAdmin, updateAnimal);
router.delete('/admin/animals/:id', requireAdmin, deleteAnimal);
router.post('/admin/shelters', requireAdmin, createShelter);
router.put('/admin/shelters/:id', requireAdmin, updateShelter);
router.delete('/admin/shelters/:id', requireAdmin, deleteShelter);

export default router;
