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
  const url = `${API_BASE}${path}`;
  const config = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {})
    }
  };

  const response = await fetch(url, config);
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

  // Auth
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

  // Shelters & Adoptable Animals
  getShelters: () => request('/api/shelters'),
  getAnimals: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/animals${query ? `?${query}` : ''}`);
  },
  getAnimalById: (id) => request(`/api/animals/${id}`),

  // Foster Trials
  getTrialGuide: () => request('/api/foster-trials/guide'),
  createFosterTrial: (body) => request('/api/foster-trials', { method: 'POST', body: JSON.stringify(body) }),
  updateTrialOutcome: (id, body) => request(`/api/foster-trials/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getMyTrials: (guestToken) => 
    request(`/api/foster-trials/mine${guestToken ? `?guestToken=${guestToken}` : ''}`),

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

  // Admin
  getAdminStats: () => request('/api/admin/stats'),
  createAnimal: (body) => request('/api/admin/animals', { method: 'POST', body: JSON.stringify(body) }),
  updateAnimal: (id, body) => request(`/api/admin/animals/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAnimal: (id) => request(`/api/admin/animals/${id}`, { method: 'DELETE' }),
  createShelter: (body) => request('/api/admin/shelters', { method: 'POST', body: JSON.stringify(body) }),
  updateShelter: (id, body) => request(`/api/admin/shelters/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteShelter: (id) => request(`/api/admin/shelters/${id}`, { method: 'DELETE' })
};
