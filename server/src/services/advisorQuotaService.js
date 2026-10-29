import { getDb } from '../db/index.js';
import { PRICING_CONFIG } from '../config/pricing.js';

// In-memory daily usage tracker (keyed by `${userId_or_ip}_${YYYY-MM-DD}`)
const dailyUsageMap = new Map();

export async function checkAndIncrementAdvisorUsage(userId, user) {
  // If user object indicates active premium subscription, unlimited
  if (user && user.isPremium) {
    return { allowed: true, isPremium: true, remaining: -1 };
  }

  // Check Neon database for active subscription if userId is present
  if (userId && !userId.startsWith('guest_')) {
    const db = getDb();
    const subRes = await db.query(
      `SELECT id FROM subscriptions WHERE user_id = $1 AND plan_tier = 'premium' AND status = 'active'`,
      [userId]
    );
    if (subRes.rows && subRes.rows.length > 0) {
      return { allowed: true, isPremium: true, remaining: -1 };
    }
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const usageKey = `${userId || 'anon'}_${todayStr}`;
  const currentUsage = dailyUsageMap.get(usageKey) || 0;
  const maxLimit = PRICING_CONFIG.advisor.freeDailyMessageLimit;

  if (currentUsage >= maxLimit) {
    return {
      allowed: false,
      isPremium: false,
      currentUsage,
      maxLimit,
      remaining: 0
    };
  }

  dailyUsageMap.set(usageKey, currentUsage + 1);

  return {
    allowed: true,
    isPremium: false,
    currentUsage: currentUsage + 1,
    maxLimit,
    remaining: maxLimit - (currentUsage + 1)
  };
}
