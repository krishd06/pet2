import mongoose from 'mongoose';
import { inMemoryMongoStores } from '../db/mongo.js';

// Mongoose Schemas
const PetContentSchema = new mongoose.Schema({
  petSlug: { type: String, required: true, unique: true },
  tagline: String,
  about: String,
  historyAndOrigin: String,
  temperamentOverview: String,
  commonHealthIssues: [String],
  climateCareGuide: String,
  mythsAndFacts: [{ myth: String, fact: String }],
  careGuide: {
    exerciseTips: String,
    nutritionGuide: String,
    groomingGuide: String,
    trainingTips: String
  },
  images: [String]
}, { timestamps: true });

const QuestionnaireSchema = new mongoose.Schema({
  version: { type: Number, default: 1 },
  steps: [{
    id: String,
    title: String,
    description: String,
    icon: String,
    questions: [mongoose.Schema.Types.Mixed]
  }]
}, { timestamps: true });

const ExplanationTemplateSchema = new mongoose.Schema({
  dimension: { type: String, required: true, unique: true },
  matchTemplate: String,
  frictionTemplate: String,
  okTemplate: String
}, { timestamps: true });

const RemediationTemplateSchema = new mongoose.Schema({
  category: { type: String, required: true },
  issueTrigger: String,
  actionTitle: String,
  actionDescription: String,
  recommendedAlternative: String
}, { timestamps: true });

const OnboardingGuideSchema = new mongoose.Schema({
  species: { type: String, required: true, unique: true },
  rule333: {
    day1to3: [String],
    week1to3: [String],
    month1to3: [String]
  },
  petProofingChecklist: [{
    id: String,
    category: String,
    label: String,
    description: String
  }],
  firstVetVisitChecklist: [String]
}, { timestamps: true });

const FaqItemSchema = new mongoose.Schema({
  category: String,
  keywords: [String],
  question: String,
  answer: String
}, { timestamps: true });

const AdvisorConversationSchema = new mongoose.Schema({
  conversationId: { type: String, required: true, unique: true },
  userId: String,
  messages: [{
    role: { type: String, enum: ['user', 'model', 'system'], default: 'user' },
    content: String,
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// Event Tracking & Analytics Schemas (MongoDB Atlas)
const ClickEventSchema = new mongoose.Schema({
  partnerId: { type: String, required: true },
  sourcePage: { type: String, default: 'unknown' },
  sessionId: { type: String, default: 'anonymous' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const PetViewEventSchema = new mongoose.Schema({
  animalId: { type: String, required: true },
  shelterId: { type: String },
  sessionId: { type: String, default: 'anonymous' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const QuizSnapshotSchema = new mongoose.Schema({
  consented: { type: Boolean, default: true },
  speciesPreference: String,
  city: String,
  homeType: String,
  readinessBand: String,
  topPetSlug: String,
  matchScore: Number,
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// Premium User Data Schemas (MongoDB Atlas)
const RoadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  petId: String,
  petName: String,
  readinessScore: Number,
  timelineWeeks: Number,
  actionSteps: [{
    week: Number,
    category: String,
    title: String,
    description: String,
    completed: { type: Boolean, default: false }
  }]
}, { timestamps: true });

const CostPlanSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  petId: String,
  petName: String,
  city: String,
  upfrontBudget: Number,
  monthlyBudget: Number,
  contingencyFund: Number,
  customNotes: String,
  allocations: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const ReminderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  petName: { type: String, required: true },
  title: { type: String, required: true },
  category: { type: String, enum: ['vaccination', 'vet_checkup', 'deworming', 'grooming', 'other'], default: 'vaccination' },
  dueDate: { type: String, required: true },
  completed: { type: Boolean, default: false },
  notes: String
}, { timestamps: true });

// Compile models safely if not already registered
const MongoosePetContent = mongoose.models.PetContent || mongoose.model('PetContent', PetContentSchema);
const MongooseQuestionnaire = mongoose.models.Questionnaire || mongoose.model('Questionnaire', QuestionnaireSchema);
const MongooseExplanationTemplate = mongoose.models.ExplanationTemplate || mongoose.model('ExplanationTemplate', ExplanationTemplateSchema);
const MongooseRemediationTemplate = mongoose.models.RemediationTemplate || mongoose.model('RemediationTemplate', RemediationTemplateSchema);
const MongooseOnboardingGuide = mongoose.models.OnboardingGuide || mongoose.model('OnboardingGuide', OnboardingGuideSchema);
const MongooseFaqItem = mongoose.models.FaqItem || mongoose.model('FaqItem', FaqItemSchema);
const MongooseAdvisorConversation = mongoose.models.AdvisorConversation || mongoose.model('AdvisorConversation', AdvisorConversationSchema);
const MongooseClickEvent = mongoose.models.ClickEvent || mongoose.model('ClickEvent', ClickEventSchema);
const MongoosePetViewEvent = mongoose.models.PetViewEvent || mongoose.model('PetViewEvent', PetViewEventSchema);
const MongooseQuizSnapshot = mongoose.models.QuizSnapshot || mongoose.model('QuizSnapshot', QuizSnapshotSchema);
const MongooseRoadmap = mongoose.models.Roadmap || mongoose.model('Roadmap', RoadmapSchema);
const MongooseCostPlan = mongoose.models.CostPlan || mongoose.model('CostPlan', CostPlanSchema);
const MongooseReminder = mongoose.models.Reminder || mongoose.model('Reminder', ReminderSchema);

// Helper to determine if Mongoose is connected
function isMongooseConnected() {
  return mongoose.connection.readyState === 1;
}

// Unified Model abstraction that automatically delegates to Mongoose or InMemoryStore
function createModelWrapper(modelName, mongooseModel) {
  return {
    async find(filter = {}) {
      if (isMongooseConnected()) {
        return await mongooseModel.find(filter).lean();
      }
      return await inMemoryMongoStores[modelName].find(filter);
    },
    async findOne(filter = {}) {
      if (isMongooseConnected()) {
        return await mongooseModel.findOne(filter).lean();
      }
      return await inMemoryMongoStores[modelName].findOne(filter);
    },
    async create(doc) {
      if (isMongooseConnected()) {
        return await mongooseModel.create(doc);
      }
      return await inMemoryMongoStores[modelName].create(doc);
    },
    async insertMany(docs) {
      if (isMongooseConnected()) {
        return await mongooseModel.insertMany(docs);
      }
      return await inMemoryMongoStores[modelName].insertMany(docs);
    },
    async updateOne(filter, update, options = {}) {
      if (isMongooseConnected()) {
        return await mongooseModel.updateOne(filter, update, options);
      }
      return await inMemoryMongoStores[modelName].updateOne(filter, update, options);
    },
    async deleteMany(filter = {}) {
      if (isMongooseConnected()) {
        return await mongooseModel.deleteMany(filter);
      }
      return await inMemoryMongoStores[modelName].deleteMany(filter);
    }
  };
}

export const PetContent = createModelWrapper('PetContent', MongoosePetContent);
export const QuestionnaireDefinition = createModelWrapper('QuestionnaireDefinition', MongooseQuestionnaire);
export const ExplanationTemplates = createModelWrapper('ExplanationTemplates', MongooseExplanationTemplate);
export const RemediationTemplates = createModelWrapper('RemediationTemplates', MongooseRemediationTemplate);
export const OnboardingGuides = createModelWrapper('OnboardingGuides', MongooseOnboardingGuide);
export const FaqItems = createModelWrapper('FaqItems', MongooseFaqItem);
export const AdvisorConversations = createModelWrapper('AdvisorConversations', MongooseAdvisorConversation);
export const ClickEvents = createModelWrapper('ClickEvents', MongooseClickEvent);
export const PetViewEvents = createModelWrapper('PetViewEvents', MongoosePetViewEvent);
export const QuizSnapshots = createModelWrapper('QuizSnapshots', MongooseQuizSnapshot);
export const Roadmaps = createModelWrapper('Roadmaps', MongooseRoadmap);
export const CostPlans = createModelWrapper('CostPlans', MongooseCostPlan);
export const Reminders = createModelWrapper('Reminders', MongooseReminder);
