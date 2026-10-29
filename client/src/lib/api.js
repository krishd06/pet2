const API_BASE = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : '';

function getAuthHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('pawmatch_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export async function request(path, options = {}) {
  const primaryUrl = `${API_BASE}${path}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  };

  let response;
  try {
    response = await fetch(primaryUrl, config);
  } catch (err) {
    // If primary failed (e.g. Failed to fetch), try fallback URL (relative via Vite proxy or direct)
    const fallbackUrl = API_BASE ? path : `http://localhost:5000${path}`;
    try {
      await new Promise((r) => setTimeout(r, 250));
      response = await fetch(fallbackUrl, config);
    } catch (fallbackErr) {
      await new Promise((r) => setTimeout(r, 500));
      response = await fetch(primaryUrl, config);
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Health
  getHealth: () => request('/api/health'),

  // Auth (Feature A)
  register: (body) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request('/api/auth/me'),
  getGuestToken: () => request('/api/auth/guest-token', { method: 'POST' }),

  // Questionnaire
  getQuestionnaire: () => request('/api/questionnaire'),

  // Assessments
  createAssessment: (answers, guestToken) => 
    request('/api/assessments', { method: 'POST', body: JSON.stringify({ answers, guestToken }) }),
  getAssessmentById: (id) => request(`/api/assessments/${id}`),
  getMyAssessments: (guestToken) => 
    request(`/api/assessments/mine${guestToken ? `?guestToken=${guestToken}` : ''}`),

  // Pet Catalog
  getPets: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/pets${query ? `?${query}` : ''}`);
  },
  getPetBySlug: (slug) => request(`/api/pets/${slug}`),

  // Cost Forecaster
  getCostForecast: (petId, city) => {
    const query = new URLSearchParams({ petId, city }).toString();
    return request(`/api/costs/forecast?${query}`);
  },

  // Public Shelters & Adoptable Animals (Feature C)
  getShelters: () => request('/api/shelters'),
  getAnimals: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/animals${query ? `?${query}` : ''}`);
  },
  getAnimalById: (id) => request(`/api/animals/${id}`),
  recordPetView: (animalId, sessionId) =>
    request(`/api/animals/${animalId}/view`, { method: 'POST', body: JSON.stringify({ sid: sessionId }) }),
  submitAdopterInquiry: (body) =>
    request('/api/animals/' + body.animalId + '/inquiry', { method: 'POST', body: JSON.stringify(body) }),

  // Partner / Affiliate Recommendations (Feature B)
  getPartners: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/partners${query ? `?${query}` : ''}`);
  },

  // Paid Trial Foster-to-Adopt (Feature D)
  getTrialPricing: () => request('/api/trial-foster/pricing'),
  createTrialOrder: (body) =>
    request('/api/trial-foster/orders', { method: 'POST', body: JSON.stringify(body) }),
  verifyTrialBooking: (body) =>
    request('/api/trial-foster/verify', { method: 'POST', body: JSON.stringify(body) }),
  getMyTrialBookings: (guestToken) =>
    request(`/api/trial-foster/my-trials${guestToken ? `?guestToken=${guestToken}` : ''}`),
  submitTrialCheckIn: (bookingId, body) =>
    request(`/api/trial-foster/bookings/${bookingId}/checkin`, { method: 'POST', body: JSON.stringify(body) }),
  finalizeTrialOutcome: (bookingId, body) =>
    request(`/api/trial-foster/bookings/${bookingId}/outcome`, { method: 'POST', body: JSON.stringify(body) }),

  // Legacy Foster Trials
  getTrialGuide: () => request('/api/foster-trials/guide'),
  createFosterTrial: (body) => request('/api/foster-trials', { method: 'POST', body: JSON.stringify(body) }),
  updateTrialOutcome: (id, body) => request(`/api/foster-trials/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getMyTrials: (guestToken) => 
    request(`/api/foster-trials/mine${guestToken ? `?guestToken=${guestToken}` : ''}`),

  // Premium Subscriptions, Roadmaps, Custom Cost Plans & Reminders (Feature E)
  getPricing: () => request('/api/pricing'),
  getUserSubscription: () => request('/api/subscriptions/me'),
  createSubscriptionOrder: (body) =>
    request('/api/subscriptions/orders', { method: 'POST', body: JSON.stringify(body) }),
  verifySubscription: (body) =>
    request('/api/subscriptions/verify', { method: 'POST', body: JSON.stringify(body) }),
  getRoadmap: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/premium/roadmap${query ? `?${query}` : ''}`);
  },
  saveRoadmap: (body) =>
    request('/api/premium/roadmap', { method: 'POST', body: JSON.stringify(body) }),
  getCostPlan: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/premium/cost-plan${query ? `?${query}` : ''}`);
  },
  saveCostPlan: (body) =>
    request('/api/premium/cost-plan', { method: 'POST', body: JSON.stringify(body) }),
  getReminders: () => request('/api/premium/reminders'),
  createReminder: (body) =>
    request('/api/premium/reminders', { method: 'POST', body: JSON.stringify(body) }),
  toggleReminder: (id, completed) =>
    request(`/api/premium/reminders/${id}`, { method: 'PATCH', body: JSON.stringify({ completed }) }),
  deleteReminder: (id) =>
    request(`/api/premium/reminders/${id}`, { method: 'DELETE' }),

  // Shelter Dashboard (Feature C)
  getMyShelter: () => request('/api/shelter-dashboard/profile'),
  updateMyShelter: (body) =>
    request('/api/shelter-dashboard/profile', { method: 'PUT', body: JSON.stringify(body) }),
  getMyShelterPets: () => request('/api/shelter-dashboard/pets'),
  addShelterPet: (body) =>
    request('/api/shelter-dashboard/pets', { method: 'POST', body: JSON.stringify(body) }),
  updateShelterPet: (id, body) =>
    request(`/api/shelter-dashboard/pets/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteShelterPet: (id) =>
    request(`/api/shelter-dashboard/pets/${id}`, { method: 'DELETE' }),
  getShelterInquiries: () => request('/api/shelter-dashboard/inquiries'),
  updateInquiryStatus: (id, status) =>
    request(`/api/shelter-dashboard/inquiries/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  createShelterUpgradeOrder: () =>
    request('/api/shelter-dashboard/upgrade/order', { method: 'POST' }),
  verifyShelterUpgrade: (body) =>
    request('/api/shelter-dashboard/upgrade/verify', { method: 'POST', body: JSON.stringify(body) }),

  // Services Directory & Leads (Feature F)
  getServices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/services${query ? `?${query}` : ''}`);
  },
  submitServiceLead: (providerId, body) =>
    request(`/api/services/${providerId}/lead`, { method: 'POST', body: JSON.stringify(body) }),
  getServiceLeads: (providerId) =>
    request(`/api/services/leads${providerId ? `?providerId=${providerId}` : ''}`),

  // B2B & Analytics (Feature G)
  submitB2BInquiry: (body) =>
    request('/api/b2b/inquiry', { method: 'POST', body: JSON.stringify(body) }),
  logConsentedQuizSnapshot: (body) =>
    request('/api/analytics/quiz-snapshot', { method: 'POST', body: JSON.stringify(body) }),
  logQuizSnapshot: (body) =>
    request('/api/analytics/quiz-snapshot', { method: 'POST', body: JSON.stringify(body) }),
  getQuizAnalytics: () => request('/api/analytics/aggregate'),

  // Onboarding (First 30 Days)
  getOnboardingPlan: (species = 'dog') => request(`/api/onboarding/${species}`),
  updateOnboardingProgress: (body) => request('/api/onboarding/progress', { method: 'PATCH', body: JSON.stringify(body) }),
  getOnboardingProgress: (species = 'dog', guestToken) => 
    request(`/api/onboarding/progress/${species}${guestToken ? `?guestToken=${guestToken}` : ''}`),

  // Vets
  getVets: (city = '') => request(`/api/vets${city ? `?city=${encodeURIComponent(city)}` : ''}`),

  // AI Pet Advisor
  sendAdvisorMessage: (message, conversationId) => 
    request('/api/advisor/message', { method: 'POST', body: JSON.stringify({ message, conversationId }) }),
  getAdvisorConversation: (id) => request(`/api/advisor/conversations/${id}`),

  // Admin (Feature H)
  getAdminStats: () => request('/api/admin/stats'),
  verifyShelter: (id, verified = true) =>
    request(`/api/admin/shelters/${id}/verify`, { method: 'PATCH', body: JSON.stringify({ verified }) }),
  getAdminPartners: () => request('/api/admin/partners'),
  togglePartner: (id, active) =>
    request(`/api/admin/partners/${id}/toggle`, { method: 'PATCH', body: JSON.stringify({ active }) }),
  getAdminProviders: () => request('/api/admin/providers'),
  toggleProvider: (id, body) =>
    request(`/api/admin/providers/${id}/toggle`, { method: 'PATCH', body: JSON.stringify(body) }),
  getAdminLeads: () => request('/api/admin/leads'),
  getAdminTrials: () => request('/api/admin/trials'),
  getAdminB2B: () => request('/api/admin/b2b-inquiries'),
  createAnimal: (body) => request('/api/admin/animals', { method: 'POST', body: JSON.stringify(body) }),
  updateAnimal: (id, body) => request(`/api/admin/animals/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAnimal: (id) => request(`/api/admin/animals/${id}`, { method: 'DELETE' }),
  createShelter: (body) => request('/api/admin/shelters', { method: 'POST', body: JSON.stringify(body) }),
  updateShelter: (id, body) => request(`/api/admin/shelters/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteShelter: (id) => request(`/api/admin/shelters/${id}`, { method: 'DELETE' })
};
