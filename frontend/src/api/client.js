import { auth } from '../firebase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function authHeaders() {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { Authorization: `Bearer ${token}` };
}

async function request(path, { method = 'GET', body, auth: needsAuth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (needsAuth) Object.assign(headers, await authHeaders());

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let detail;
    try {
      const data = await response.json();
      detail = data.detail;
    } catch {
      // response had no JSON body
    }
    throw new Error(detail || `Request failed (${response.status})`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export const api = {
  // Auth + profile
  getMe: () => request('/auth/me'),
  register: (data) => request('/auth/register', { method: 'POST', body: data }),
  getProfile: () => request('/profile'),
  updateProfile: (data) => request('/profile', { method: 'PUT', body: data }),

  // Quests
  getQuests: () => request('/quests'),
  getQuestStreak: () => request('/quests/streak'),
  getQuestActivity: () => request('/quests/activity'),
  createQuest: (data) => request('/quests', { method: 'POST', body: data }),
  updateQuest: (id, data) => request(`/quests/${id}`, { method: 'PATCH', body: data }),
  deleteQuest: (id) => request(`/quests/${id}`, { method: 'DELETE' }),
  completeQuest: (id) => request(`/quests/${id}/complete`, { method: 'POST' }),

  // Wallet
  getWallet: () => request('/wallet'),

  // Gacha
  pullGacha: (times) => request('/gacha/pull', { method: 'POST', body: { times } }),

  // Heroes
  getHeroes: () => request('/heroes', { auth: false }),
  getMyHeroes: () => request('/me/heroes'),

  // Achievements
  getAchievements: () => request('/achievements', { auth: false }),
  getMyAchievements: () => request('/me/achievements'),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'POST' }),
  purgeReadNotifications: () => request('/notifications/read', { method: 'DELETE' }),
};
