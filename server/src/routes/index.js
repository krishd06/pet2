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
import { getPartners, trackOutboundClick } from '../controllers/partnersController.js';

// New Feature Controllers
import {
  getMyShelterProfile,
  updateMyShelterProfile,
  getMyShelterPets,
  addShelterPet,
  updateShelterPet,
  deleteShelterPet,
  getShelterInquiries,
  updateInquiryStatus,
  createShelterUpgradeOrder,
  verifyShelterUpgradePayment,
  logPetView,
  submitInquiry
} from '../controllers/shelterDashboardController.js';

import {
  getTrialFosterPricing,
  createTrialBookingOrder,
  confirmTrialBooking,
  getMyTrialBookings,
  submitCheckInNote,
  finalizeTrialOutcome
} from '../controllers/trialBookingController.js';

import {
  getPricingPlans,
  getUserSubscription,
  createSubscriptionOrder,
  verifySubscriptionPayment,
  getRoadmap,
  saveRoadmap,
  getCostPlan,
  saveCostPlan,
  getReminders,
  createReminder,
  toggleReminder,
  deleteReminder
} from '../controllers/premiumController.js';

import {
  getServiceProviders,
  submitServiceLead,
  getProviderLeads,
  toggleProviderStatus
} from '../controllers/servicesController.js';

import {
  submitB2BInquiry,
  getB2BInquiries,
  logConsentedQuizSnapshot,
  getAnonymisedQuizAnalytics
} from '../controllers/b2bController.js';

import {
  getStats,
  verifyShelter,
  getAdminPartners,
  togglePartner,
  getAdminProviders,
  toggleProvider,
  getAdminLeads,
  getAdminTrials,
  createAnimal,
  updateAnimal,
  deleteAnimal,
  createShelter,
  updateShelter,
  deleteShelter,
  triggerSupabaseSeed
} from '../controllers/adminController.js';

import { requireAuth, requireShelter, requireAdmin } from '../middleware/auth.js';

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

// Auth Routes (Feature A)
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/me', requireAuth, getMe);
router.post('/auth/guest-token', createGuestToken);

// Questionnaire Routes
router.get('/questionnaire', getQuestionnaire);

// Assessment Routes & Consented Analytics (Feature G)
router.post('/assessments', createAssessment);
router.get('/assessments/mine', getMyAssessments);
router.get('/assessments/:id', getAssessmentById);
router.post('/analytics/quiz-snapshot', logConsentedQuizSnapshot);
router.get('/analytics/aggregate', getAnonymisedQuizAnalytics);

// Pet Catalog Routes
router.get('/pets', getPets);
router.get('/pets/:slug', getPetBySlug);

// Cost Forecaster Route
router.get('/costs/forecast', getCostForecast);

// Public Shelters & Adoptable Animals Routes (Feature C)
router.get('/shelters', getShelters);
router.get('/animals', getAnimals);
router.get('/animals/:id', getAnimalById);
router.post('/animals/:id/view', logPetView);
router.post('/animals/:id/inquiry', submitInquiry);

// Partner Recommendations & Outbound Clicks (Feature B)
router.get('/partners', getPartners);
router.get('/go/:partnerId', trackOutboundClick);

// Paid Trial Foster-to-Adopt (Feature D)
router.get('/trial-foster/pricing', getTrialFosterPricing);
router.post('/trial-foster/orders', createTrialBookingOrder);
router.post('/trial-foster/verify', confirmTrialBooking);
router.get('/trial-foster/my-trials', getMyTrialBookings);
router.post('/trial-foster/bookings/:id/checkin', submitCheckInNote);
router.post('/trial-foster/bookings/:id/outcome', finalizeTrialOutcome);

// Self-managed Foster Trials (legacy support preserved)
router.get('/foster-trials/guide', getTrialGuide);
router.post('/foster-trials', createFosterTrial);
router.patch('/foster-trials/:id', updateTrialOutcome);
router.get('/foster-trials/mine', getMyTrials);

// Premium Tier & Pricing (Feature E)
router.get('/pricing', getPricingPlans);
router.get('/subscriptions/me', getUserSubscription);
router.post('/subscriptions/orders', requireAuth, createSubscriptionOrder);
router.post('/subscriptions/verify', requireAuth, verifySubscriptionPayment);
router.get('/premium/roadmap', getRoadmap);
router.post('/premium/roadmap', saveRoadmap);
router.get('/premium/cost-plan', getCostPlan);
router.post('/premium/cost-plan', saveCostPlan);
router.get('/premium/reminders', requireAuth, getReminders);
router.post('/premium/reminders', requireAuth, createReminder);
router.patch('/premium/reminders/:id', requireAuth, toggleReminder);
router.delete('/premium/reminders/:id', requireAuth, deleteReminder);

// Shelter Dashboard Routes (Feature C)
router.get('/shelter-dashboard/profile', requireShelter, getMyShelterProfile);
router.put('/shelter-dashboard/profile', requireShelter, updateMyShelterProfile);
router.get('/shelter-dashboard/pets', requireShelter, getMyShelterPets);
router.post('/shelter-dashboard/pets', requireShelter, addShelterPet);
router.put('/shelter-dashboard/pets/:id', requireShelter, updateShelterPet);
router.delete('/shelter-dashboard/pets/:id', requireShelter, deleteShelterPet);
router.get('/shelter-dashboard/inquiries', requireShelter, getShelterInquiries);
router.patch('/shelter-dashboard/inquiries/:id', requireShelter, updateInquiryStatus);
router.post('/shelter-dashboard/upgrade/order', requireShelter, createShelterUpgradeOrder);
router.post('/shelter-dashboard/upgrade/verify', requireShelter, verifyShelterUpgradePayment);

// Services Directory & Leads (Feature F)
router.get('/services', getServiceProviders);
router.post('/services/:providerId/lead', submitServiceLead);
router.get('/services/leads', requireAuth, getProviderLeads);

// B2B Partner Inquiries (Feature G)
router.post('/b2b/inquiry', submitB2BInquiry);

// Onboarding First 30 Days Routes
router.get('/onboarding/:species', getOnboardingPlan);
router.patch('/onboarding/progress', updateProgress);
router.get('/onboarding/progress/:species', getProgress);

// Vet Directory
router.get('/vets', getVets);

// AI Pet Advisor Routes
router.post('/advisor/message', sendMessage);
router.get('/advisor/conversations/:id', getConversationHistory);

// Admin Routes (Feature H)
router.get('/admin/stats', requireAdmin, getStats);
router.patch('/admin/shelters/:id/verify', requireAdmin, verifyShelter);
router.get('/admin/partners', requireAdmin, getAdminPartners);
router.patch('/admin/partners/:id/toggle', requireAdmin, togglePartner);
router.get('/admin/providers', requireAdmin, getAdminProviders);
router.patch('/admin/providers/:id/toggle', requireAdmin, toggleProvider);
router.get('/admin/leads', requireAdmin, getAdminLeads);
router.get('/admin/trials', requireAdmin, getAdminTrials);
router.get('/admin/b2b-inquiries', requireAdmin, getB2BInquiries);
router.post('/admin/animals', requireAdmin, createAnimal);
router.put('/admin/animals/:id', requireAdmin, updateAnimal);
router.delete('/admin/animals/:id', requireAdmin, deleteAnimal);
router.post('/admin/shelters', requireAdmin, createShelter);
router.put('/admin/shelters/:id', requireAdmin, updateShelter);
router.delete('/admin/shelters/:id', requireAdmin, deleteShelter);
router.post('/admin/seed-supabase', requireAdmin, triggerSupabaseSeed);

export default router;
