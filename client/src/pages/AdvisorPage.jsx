import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Sparkles,
  Bot,
  User,
  Send,
  AlertCircle,
  HelpCircle,
  Award,
  ShieldCheck,
  RotateCcw,
  Lock
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  'Is an Indian Indie dog suitable for a 2BHK flat in Mumbai?',
  'How do I care for a double-coated pet during Delhi hot summers?',
  'What is the estimated monthly recurring budget for an Indie in Bengaluru?',
  'How do I train an adult shelter cat to use the litter box?'
];

export default function AdvisorPage() {
  const { user, isPremium } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: 'Namaste! 🐾 I am your PawMatch Pet Care & Adoption Advisor for India.\n\nAsk me anything regarding:\n• Indian native Indie dog and cat care\n• Surviving hot tropical summers & monsoon ticks\n• Flat living & RWA society pet guidelines\n• Realistic monthly food and veterinary costs\n\n*(Note: I provide lifestyle and adoption advice, not veterinary medical diagnosis.)*'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [quotaInfo, setQuotaInfo] = useState(null);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(textToSend) {
    const text = textToSend || input;
    if (!text || text.trim() === '' || loading) return;

    const query = text.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    setLoading(true);

    try {
      const res = await api.sendAdvisorMessage(query, conversationId);
      if (res.conversationId) setConversationId(res.conversationId);
      if (res.quota) setQuotaInfo(res.quota);

      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: res.reply || 'Thank you for your question! Choosing an Indie pet is a compassionate decision.',
          source: res.replySource
        }
      ]);
    } catch (err) {
      if (err.message && (err.message.includes('quota') || err.message.includes('429') || err.message.includes('limit'))) {
        setQuotaExceeded(true);
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content: '⚠️ You have used all 5 free daily questions. To get unlimited 24/7 AI Pet Advisor guidance, customized diet charts, and post-adoption support, please upgrade to PawMatch Premium.',
            isQuota: true
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            content: 'Unable to reach the advisor service right now. Please check your connection and try again.',
            isError: true
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleResetChat() {
    setMessages([
      {
        role: 'model',
        content: 'Conversation reset! How can I assist you with your companion pet adoption journey today?'
      }
    ]);
    setConversationId(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-sand-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Pet Care & Adoption Consultant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-sand-900 tracking-tight">
            PawMatch AI Advisor
          </h1>
          <p className="text-sm text-sand-800 mt-1">
            Empathetic guidance for urban Indian pet parents. Free tier AI with resilient offline knowledge base.
          </p>
          <div className="mt-3 flex items-center gap-2">
            {isPremium ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unlimited Queries (Premium Active)</span>
              </span>
            ) : (
              <div className="inline-flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-full bg-sand-200 text-sand-800 font-semibold">
                  {quotaInfo ? `${quotaInfo.remaining} of ${quotaInfo.limit} free queries left today` : '5 free questions / day'}
                </span>
                <Link to="/pricing" className="font-bold text-brand-600 hover:text-brand-700 underline">
                  Upgrade to Unlimited
                </Link>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="flex items-center gap-1.5 text-xs font-bold text-sand-800 hover:text-brand-600 px-3.5 py-2 rounded-xl bg-sand-100 hover:bg-sand-200 transition-colors flex-shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New Conversation</span>
        </button>
      </div>

      {/* Prominent Medical Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-900 flex items-start gap-3 shadow-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">Veterinary Medical Disclaimer</span>
          <p className="leading-relaxed">
            PawMatch AI Advisor provides lifestyle, adoption, and general routine guidance only. It does <strong>not</strong> provide veterinary medical diagnoses, emergency care, or prescription dosages. For suspected poisoning, trauma, continuous vomiting, or high fever, immediately consult a licensed 24x7 animal hospital.
          </p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-sand-200 shadow-card flex flex-col h-[600px] overflow-hidden">
        
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-sand-50/40">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';

            return (
              <div
                key={idx}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-3xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-brand-500 text-white rounded-tr-none shadow-sm'
                      : 'bg-white border border-sand-200 text-sand-900 rounded-tl-none shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                  {msg.source && (
                    <span className="block text-[10px] text-sand-800 mt-2 italic">
                      Source: {msg.source === 'gemini_api' ? 'Gemini 1.5 Flash' : 'Offline Verified Knowledge Base'}
                    </span>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-full bg-sand-200 text-sand-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-sand-200 rounded-3xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Bar */}
        <div className="p-3 bg-white border-t border-sand-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] font-bold text-sand-800 flex items-center gap-1 flex-shrink-0">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Try asking:</span>
          </span>
          {SUGGESTED_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={loading}
              className="text-xs whitespace-nowrap bg-sand-50 hover:bg-brand-50 hover:text-brand-700 text-sand-800 px-3 py-1 rounded-full border border-sand-200 transition-colors flex-shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        {quotaExceeded ? (
          <div className="p-4 bg-amber-50 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 text-xs text-amber-950">
              <Lock className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>
                <strong>Daily Free Limit Reached (5/5).</strong> Upgrade to PawMatch Premium for unlimited messages, custom nutrition plans, and vaccination tracking.
              </span>
            </div>
            <Link
              to="/pricing"
              className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-soft transition-colors flex-shrink-0"
            >
              Upgrade for ₹299/mo
            </Link>
          </div>
        ) : (
          <div className="p-4 bg-white border-t border-sand-200 flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Type your question about dog/cat breeds, nutrition, flat living, or costs..."
              className="flex-1 bg-sand-50 border border-sand-300 rounded-2xl px-4 py-3 text-xs sm:text-sm text-sand-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="px-5 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-soft transition-colors flex-shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
