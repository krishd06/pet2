import { GoogleGenerativeAI } from '@google/generative-ai';
import { FaqItems, AdvisorConversations } from '../models/index.js';
import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_INSTRUCTION = `You are "PawMatch Advisor", an empathetic, expert pet lifestyle and responsible-adoption consultant specialized in urban India.

Core Guidelines:
1. Promote Responsible Adoption: Actively advocate adopting indigenous Indian Indie (Desi) dogs and cats over buying foreign imported breeds. Highlight their natural immunity, climate adaptability, and gentle temperament.
2. Discourage Impulse Buying: Warn against purchasing pets as status symbols, gifts, or impulse purchases from unlicensed breeders or pet shops.
3. Strict Veterinary Boundary: NEVER provide medical diagnoses, medication dosages, or treatment plans. If a user describes physical illness, poisoning, vomiting, high fever, or trauma, firmly state: "I cannot provide veterinary medical diagnoses. Please immediately take your pet to the nearest licensed 24x7 animal hospital or clinic."
4. Urban Indian Context: Offer realistic advice tailored to Indian apartments, Resident Welfare Association (RWA) rules, balcony net-proofing, monsoon tick prevention, and hot tropical summers.
5. Tone: Warm, compassionate, direct, and encouraging. Always include the standard disclaimer that this is lifestyle guidance, not medical care.`;

export const DISCLAIMER_TEXT = 'PawMatch AI Advisor provides general pet care education and lifestyle matching guidance. It is not a veterinary diagnostic service. For medical conditions, emergencies, or illnesses, always consult a licensed veterinarian.';

/**
 * Keyword-based fallback search using MongoDB FaqItems
 */
async function fallbackKeywordAnswer(userMessage = '') {
  const normalized = userMessage.toLowerCase();
  const allFaqs = await FaqItems.find({});

  let bestMatch = null;
  let maxScore = 0;

  for (const faq of allFaqs) {
    const keywords = faq.keywords || [];
    let score = 0;
    for (const kw of keywords) {
      if (normalized.includes(kw.toLowerCase())) {
        score += 2;
      }
    }
    // Also check question text
    if (faq.question && normalized.includes(faq.question.toLowerCase().slice(0, 15))) {
      score += 4;
    }

    if (score > maxScore) {
      maxScore = score;
      bestMatch = faq;
    }
  }

  if (bestMatch && maxScore > 0) {
    return {
      text: `${bestMatch.answer}\n\n*(Note: Powered by PawMatch Knowledge Base offline fallback)*`,
      source: 'knowledge_base_faq'
    };
  }

  // General fallback guidance
  return {
    text: `Thank you for reaching out to PawMatch India! 🐾\n\nAdopting a pet is a wonderful 10 to 15-year life commitment. We strongly advocate adopting native Indian Indie dogs and cats—they have natural immunity to Indian climates, minimal genetic health complications, and thrive in apartment living with two daily walks.\n\nFor medical questions or emergencies, please visit a local licensed vet clinic immediately.\n\n*(Powered by PawMatch Knowledge Base)*`,
    source: 'knowledge_base_default'
  };
}

/**
 * Send message to AI Advisor with Gemini API and keyword fallback
 */
export async function sendAdvisorMessage(conversationId, userMessage, userId = null) {
  const convId = conversationId || 'conv_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

  // 1. Retrieve existing conversation from database
  let conversation = await AdvisorConversations.findOne({ conversationId: convId });
  if (!conversation) {
    conversation = {
      conversationId: convId,
      userId: userId || null,
      messages: []
    };
    await AdvisorConversations.create(conversation);
  }

  const existingMessages = conversation.messages || [];

  // Keep last ~10 messages as context
  const recentHistory = existingMessages.slice(-10);

  let assistantReply = '';
  let replySource = 'gemini_api';

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '' && !apiKey.includes('placeholder')) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        systemInstruction: SYSTEM_INSTRUCTION
      });

      // Format history for Gemini chat
      const chatHistory = recentHistory.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const chat = model.startChat({ history: chatHistory });
      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      assistantReply = response.text();
    } catch (err) {
      console.warn('Gemini API call failed or rate-limited; falling back to keyword knowledge base:', err.message);
      const fb = await fallbackKeywordAnswer(userMessage);
      assistantReply = fb.text;
      replySource = fb.source;
    }
  } else {
    // Zero-cost keyword fallback
    const fb = await fallbackKeywordAnswer(userMessage);
    assistantReply = fb.text;
    replySource = fb.source;
  }

  // 2. Append new messages to conversation
  const userMsgObj = { role: 'user', content: userMessage, timestamp: new Date() };
  const modelMsgObj = { role: 'model', content: assistantReply, timestamp: new Date() };

  await AdvisorConversations.updateOne(
    { conversationId: convId },
    {
      $set: {
        userId: userId || conversation.userId,
        messages: [...existingMessages, userMsgObj, modelMsgObj]
      }
    },
    { upsert: true }
  );

  return {
    conversationId: convId,
    reply: assistantReply,
    replySource,
    disclaimer: DISCLAIMER_TEXT
  };
}

/**
 * Get conversation history by ID
 */
export async function getConversation(conversationId) {
  const conversation = await AdvisorConversations.findOne({ conversationId });
  if (!conversation) {
    return { conversationId, messages: [] };
  }
  return {
    conversationId: conversation.conversationId,
    messages: conversation.messages || [],
    disclaimer: DISCLAIMER_TEXT
  };
}
