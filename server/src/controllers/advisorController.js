import { sendAdvisorMessage, getConversation, DISCLAIMER_TEXT } from '../services/advisorService.js';
import { checkAndIncrementAdvisorUsage } from '../services/advisorQuotaService.js';

export async function sendMessage(req, res) {
  try {
    const { message, conversationId } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const userId = req.user ? req.user.id : (req.guest ? req.guest.guestId : req.ip);

    // Enforce daily quota for free tier
    const quota = await checkAndIncrementAdvisorUsage(userId, req.user);
    if (!quota.allowed) {
      return res.status(429).json({
        error: 'Daily free message limit reached',
        limitReached: true,
        maxLimit: quota.maxLimit,
        reply: `🔒 You have reached your daily limit of ${quota.maxLimit} free AI Advisor questions.\n\n✨ Upgrade to **PawMatch Premium** for unlimited 24x7 pet care guidance, personalized readiness remediation roadmaps, and custom city expense forecasters.`,
        isLimitReached: true,
        disclaimer: DISCLAIMER_TEXT
      });
    }

    const result = await sendAdvisorMessage(conversationId, message.trim(), userId);

    return res.json({
      ...result,
      quota: {
        isPremium: quota.isPremium,
        remainingToday: quota.remaining
      }
    });
  } catch (err) {
    console.error('Advisor message error:', err);
    return res.status(500).json({
      error: 'Failed to process advisor message',
      disclaimer: DISCLAIMER_TEXT
    });
  }
}

export async function getConversationHistory(req, res) {
  try {
    const { id } = req.params;
    const history = await getConversation(id);
    return res.json(history);
  } catch (err) {
    console.error('Get conversation error:', err);
    return res.status(500).json({ error: 'Failed to load conversation' });
  }
}
