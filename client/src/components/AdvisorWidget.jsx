import React, { useState, useRef, useEffect } from 'react';
import { api } from '../lib/api.js';
import { Sparkles, X, Send, Bot, User, AlertCircle, RefreshCw } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  'Is an Indie dog good for a 2BHK in Mumbai?',
  'How do I deal with heavy shedding in hot weather?',
  'What are realistic vet costs in Delhi?',
  'Can an Indie cat be left alone during work hours?'
];

export default function AdvisorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: 'Namaste! 🐾 I am your PawMatch Pet Care & Adoption Advisor. Ask me anything about choosing a companion, Indian climate care, or apartment pet-proofing.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  async function handleSend(textToSend) {
    const text = textToSend || input;
    if (!text || text.trim() === '' || loading) return;

    const userMessage = text.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await api.sendAdvisorMessage(userMessage, conversationId);
      if (res.conversationId) {
        setConversationId(res.conversationId);
      }
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: res.reply || 'Thank you for your question! Adopting an Indian Indie pet is a great choice.',
          source: res.replySource
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: 'Sorry, I encountered a temporary connection glitch. Please feel free to ask again!',
          isError: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-full shadow-hover font-bold text-sm tracking-wide transition-all transform hover:scale-105 active:scale-95 group"
          aria-label="Open AI Pet Advisor"
        >
          <Sparkles className="w-4 h-4 fill-white/80 group-hover:rotate-12 transition-transform" />
          <span>Ask Pet Advisor</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] md:w-[420px] h-[550px] bg-white rounded-2xl shadow-2xl border border-sand-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-brand-500 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm flex items-center gap-1.5">
                  <span>PawMatch AI Advisor</span>
                  <span className="text-[10px] bg-emerald-500/80 text-white px-1.5 py-0.2 rounded font-medium">Free</span>
                </h3>
                <p className="text-[11px] text-white/80">Lifestyle & Adoption Consultant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 text-white/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Vet Disclaimer Strip */}
          <div className="bg-amber-50 border-b border-amber-100 px-3 py-1.5 text-[11px] text-amber-800 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
            <span>Provides lifestyle guidance only. For medical emergencies, always visit a vet.</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-sand-50/50">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={idx}
                  className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-brand-500 text-white rounded-tr-none'
                        : 'bg-white border border-sand-200 text-sand-900 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                    {msg.source && (
                      <span className="block text-[10px] text-sand-800 mt-1.5 italic">
                        via {msg.source === 'gemini_api' ? 'Gemini AI' : 'Offline Knowledge Base'}
                      </span>
                    )}
                  </div>
                  {isUser && (
                    <div className="w-7 h-7 rounded-full bg-sand-200 text-sand-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-sand-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Chips (show only when 1 or 2 messages) */}
          {messages.length <= 3 && (
            <div className="px-3 py-2 bg-white border-t border-sand-100 overflow-x-auto flex gap-1.5 no-scrollbar">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="text-[11px] whitespace-nowrap bg-sand-100 hover:bg-brand-50 hover:text-brand-700 text-sand-800 px-2.5 py-1 rounded-full border border-sand-200 transition-colors flex-shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-sand-200 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="Ask about breeds, diet, costs, or climate..."
              className="flex-1 text-xs sm:text-sm bg-sand-50 border border-sand-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white flex items-center justify-center transition-smooth flex-shrink-0"
              aria-label="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
