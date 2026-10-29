import { getDb } from '../db/index.js';
import { PRICING_CONFIG } from '../config/pricing.js';
import { createPaymentOrder, processPaymentVerification } from '../services/paymentService.js';
import { Roadmaps, CostPlans, Reminders } from '../models/index.js';

// Get pricing plans and features comparison
export async function getPricingPlans(req, res) {
  return res.json({
    pricing: PRICING_CONFIG.premiumPlans,
    freeAdvisorDailyLimit: PRICING_CONFIG.advisor.freeDailyMessageLimit
  });
}

// Get current user subscription status
export async function getUserSubscription(req, res) {
  try {
    if (!req.user) {
      return res.json({ plan: 'free', isPremium: false });
    }

    const db = getDb();
    const result = await db.query(
      `SELECT * FROM subscriptions WHERE user_id = $1 AND status = 'active' ORDER BY created_at DESC LIMIT 1`,
      [req.user.id]
    );

    const subscription = result.rows && result.rows[0];
    const isPremium = Boolean(subscription && subscription.plan_tier === 'premium');

    return res.json({
      plan: isPremium ? 'premium' : 'free',
      isPremium,
      subscription: subscription || null
    });
  } catch (err) {
    console.error('Error fetching subscription:', err);
    return res.status(500).json({ error: 'Failed to retrieve subscription status' });
  }
}

// Initiate Upgrade to Premium (Mock / Test Payment Order)
export async function createSubscriptionOrder(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required. Please sign in to upgrade.' });
    }

    const { cycle = 'monthly' } = req.body; // 'monthly' | 'yearly'
    const plan = cycle === 'yearly' ? PRICING_CONFIG.premiumPlans.yearly : PRICING_CONFIG.premiumPlans.monthly;

    const paymentOrder = await createPaymentOrder({
      userId: req.user.id,
      amountInr: plan.amountInr,
      purpose: 'premium_subscription',
      referenceId: plan.id
    });

    return res.json({
      plan,
      paymentOrder
    });
  } catch (err) {
    console.error('Create subscription order error:', err);
    return res.status(500).json({ error: 'Failed to initiate upgrade order' });
  }
}

// Verify and activate subscription
export async function verifySubscriptionPayment(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { orderId, paymentId, cycle = 'monthly', simulateFailure = false } = req.body;
    const paymentResult = await processPaymentVerification({
      orderId,
      paymentId,
      status: simulateFailure ? 'failed' : 'captured',
      simulatedFailure: simulateFailure
    });

    if (!paymentResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Payment simulation failed or was cancelled.',
        payment: paymentResult.payment
      });
    }

    const db = getDb();
    const subId = 'sub_' + Math.random().toString(36).substr(2, 9);
    const durationDays = cycle === 'yearly' ? 365 : 30;
    const endDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString();

    // Insert active subscription into Neon
    await db.query(
      `INSERT INTO subscriptions (id, user_id, plan_tier, billing_cycle, status, end_date)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [subId, req.user.id, 'premium', cycle, 'active', endDate]
    );

    return res.json({
      success: true,
      message: '🎉 Congratulations! Your PawMatch Premium membership is now active.',
      subscription: {
        id: subId,
        plan_tier: 'premium',
        billing_cycle: cycle,
        status: 'active',
        end_date: endDate
      }
    });
  } catch (err) {
    console.error('Subscription verification error:', err);
    return res.status(500).json({ error: 'Failed to verify subscription payment' });
  }
}

// Personalized Readiness Remediation Roadmap (MongoDB)
export async function getRoadmap(req, res) {
  try {
    const userId = req.user ? req.user.id : (req.guest ? req.guest.guestId : 'guest');
    const { petId } = req.query;

    const filter = { userId };
    if (petId) filter.petId = petId;

    const roadmap = await Roadmaps.findOne(filter);
    return res.json({ roadmap: roadmap || null });
  } catch (err) {
    console.error('Error fetching roadmap:', err);
    return res.status(500).json({ error: 'Failed to load roadmap' });
  }
}

export async function saveRoadmap(req, res) {
  try {
    const userId = req.user ? req.user.id : (req.guest ? req.guest.guestId : 'guest');
    const { petId, petName, readinessScore, timelineWeeks, actionSteps } = req.body;

    const existing = await Roadmaps.findOne({ userId, petId });
    if (existing) {
      await Roadmaps.updateOne({ userId, petId }, {
        $set: { petName, readinessScore, timelineWeeks, actionSteps }
      });
      return res.json({ success: true, message: 'Roadmap updated' });
    }

    const created = await Roadmaps.create({
      userId,
      petId,
      petName,
      readinessScore: readinessScore || 70,
      timelineWeeks: timelineWeeks || 4,
      actionSteps: actionSteps || []
    });

    return res.json({ success: true, roadmap: created });
  } catch (err) {
    console.error('Error saving roadmap:', err);
    return res.status(500).json({ error: 'Failed to save roadmap' });
  }
}

// Personalized Cost Plans (MongoDB)
export async function getCostPlan(req, res) {
  try {
    const userId = req.user ? req.user.id : (req.guest ? req.guest.guestId : 'guest');
    const { petId } = req.query;

    const filter = { userId };
    if (petId) filter.petId = petId;

    const plan = await CostPlans.findOne(filter);
    return res.json({ costPlan: plan || null });
  } catch (err) {
    console.error('Error fetching cost plan:', err);
    return res.status(500).json({ error: 'Failed to load cost plan' });
  }
}

export async function saveCostPlan(req, res) {
  try {
    const userId = req.user ? req.user.id : (req.guest ? req.guest.guestId : 'guest');
    const { petId, petName, city, upfrontBudget, monthlyBudget, contingencyFund, customNotes, allocations } = req.body;

    const existing = await CostPlans.findOne({ userId, petId });
    if (existing) {
      await CostPlans.updateOne({ userId, petId }, {
        $set: { petName, city, upfrontBudget, monthlyBudget, contingencyFund, customNotes, allocations }
      });
      return res.json({ success: true, message: 'Cost plan updated' });
    }

    const created = await CostPlans.create({
      userId,
      petId,
      petName,
      city,
      upfrontBudget,
      monthlyBudget,
      contingencyFund,
      customNotes,
      allocations
    });

    return res.json({ success: true, costPlan: created });
  } catch (err) {
    console.error('Error saving cost plan:', err);
    return res.status(500).json({ error: 'Failed to save cost plan' });
  }
}

// Post-Adoption Reminders Tracker (MongoDB)
export async function getReminders(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const reminders = await Reminders.find({ userId: req.user.id });
    return res.json({ reminders: reminders || [] });
  } catch (err) {
    console.error('Error fetching reminders:', err);
    return res.status(500).json({ error: 'Failed to retrieve reminders' });
  }
}

export async function createReminder(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { petName, title, category, dueDate, notes } = req.body;
    if (!petName || !title || !dueDate) {
      return res.status(400).json({ error: 'Pet name, title, and due date are required' });
    }

    const newReminder = await Reminders.create({
      userId: req.user.id,
      petName,
      title,
      category: category || 'vaccination',
      dueDate,
      notes: notes || '',
      completed: false
    });

    return res.status(201).json({ success: true, reminder: newReminder });
  } catch (err) {
    console.error('Error creating reminder:', err);
    return res.status(500).json({ error: 'Failed to save reminder' });
  }
}

export async function toggleReminder(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    const { completed } = req.body;

    await Reminders.updateOne(
      { _id: id, userId: req.user.id },
      { $set: { completed: Boolean(completed) } }
    );

    return res.json({ success: true, message: 'Reminder status updated' });
  } catch (err) {
    console.error('Error updating reminder:', err);
    return res.status(500).json({ error: 'Failed to update reminder' });
  }
}

export async function deleteReminder(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { id } = req.params;
    await Reminders.deleteMany({ _id: id, userId: req.user.id });

    return res.json({ success: true, message: 'Reminder deleted' });
  } catch (err) {
    console.error('Error deleting reminder:', err);
    return res.status(500).json({ error: 'Failed to delete reminder' });
  }
}
