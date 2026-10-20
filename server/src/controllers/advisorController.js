import { sendAdvisorMessage, getConversation, DISCLAIMER_TEXT } from '../services/advisorService.js';

export async function sendMessage(req, res) {
  try {
    const { message, conversationId } = req.body;
    if (!message || message.trim() === '') {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const userId = req.user ? req.user.id : (req.guest ? req.guest.guestId : null);
    const result = await sendAdvisorMessage(conversationId, message.trim(), userId);

    return res.json(result);
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
