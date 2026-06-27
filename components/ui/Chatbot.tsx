'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Leaf, X, ArrowRight, Phone, ChefHat, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/types';

// --- STATIC KNOWLEDGE BASE ---
const KNOWLEDGE_BASE = {
  service: {
    delivery_areas: ["Delhi", "Noida", "Gurugram", "Ghaziabad"],
    delivery_time: "24-48 hours",
    shipping_cost: "Free Shipping on all orders",
    payment_methods: ["Cash on Delivery (COD)", "UPI"],
    contact_phone: "+91-8826986127",
    company: "Supr Mushrooms"
  },
  farming: {
    method: "Aeroponic (Soil-less, clean, and vertical farming)",
    benefits: "Pesticide-free, nutrient-rich, and grown in a controlled environment.",
    location: "Delhi NCR"
  },
  usage_tips: {
    storage: "Keep in a paper bag in the refrigerator. Do not wash until ready to cook.",
    shelf_life: "5-7 days if stored properly.",
    health: "High in protein, Vitamin D, and antioxidants."
  }
};

type Message = { role: 'user' | 'assistant'; text: string };
type Tab = 'support' | 'chef';

export const Chatbot: React.FC = () => {
  // UI State
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('support');
  const [isTyping, setIsTyping] = useState(false);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);

  // Chat State
  const [supportMessages, setSupportMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Namaste! 🙏 I am the Supr Support. How can I help you with orders or fresh mushrooms today? 🍄' }
  ]);
  const [chefMessages, setChefMessages] = useState<Message[]>([
    { role: 'assistant', text: 'Bon Appétit! 👨‍🍳 I am your Mushroom Chef. Need a tasty recipe or cooking tip? 🍳' }
  ]);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- 1. FETCH REAL-TIME PRODUCTS (LAZY LOAD) ---
  useEffect(() => {
    if (!isOpen) return; // Only fetch when chat is opened

    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products for chatbot", error);
      }
    };

    if (products.length === 0) {
      fetchProducts();
    }
  }, [isOpen, products.length]);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [supportMessages, chefMessages, activeTab, isTyping]);

  // --- 2. ROBUST SYSTEM PROMPT ---
  const getSystemPrompt = (tab: Tab) => {
    const productList = products.length > 0
      ? products.map(p => `- ${p.name}: ₹${p.price}/${p.weight} | Status: ${p.stock > 0 ? 'In Stock' : 'Out of Stock'}`).join('\n')
      : "Product data loading...";

    if (tab === 'support') {
      return `You are the Friendly Customer Support Agent for ${KNOWLEDGE_BASE.service.company}. 🍄

      YOUR KNOWLEDGE:
      - STOCK & PRICES:\n${productList}
      - FARMING: We use ${KNOWLEDGE_BASE.farming.method}. It is ${KNOWLEDGE_BASE.farming.benefits}.
      - DELIVERY: ${KNOWLEDGE_BASE.service.delivery_areas.join(', ')} within ${KNOWLEDGE_BASE.service.delivery_time}.
      - CONTACT: ${KNOWLEDGE_BASE.service.contact_phone}

      CRITICAL INSTRUCTIONS:
      1. FORMATTING: Do NOT use markdown (no **bold**, no *italics*). Send plain text only.
      2. Tone: Be warm, helpful, and use EMOJIS (😊, 🍄, 🚛).
      3. Ordering: If a user wants to buy, say: "You can order directly on this website! 🛒 Or WhatsApp us at ${KNOWLEDGE_BASE.service.contact_phone}."
      4. Keep answers concise (2-3 sentences).`;
    } else {
      return `You are a Passionate 5-Star Chef specializing in Mushrooms & Saffron. 👨‍🍳

      INGREDIENTS AVAILABLE:\n${productList}

      INSTRUCTIONS:
      1. FORMATTING: Do NOT use markdown (no **bold**, no *italics*, no headers #). Send plain text only.
      2. Provide delicious, short recipe ideas.
      3. Use appetizing emojis (🥘, 🤤, 🧂, 🌿).
      4. Focus on flavor and texture.`;
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const currentTab = activeTab;

    const newMessage: Message = { role: 'user', text: userText };
    if (currentTab === 'support') setSupportMessages(prev => [...prev, newMessage]);
    else setChefMessages(prev => [...prev, newMessage]);

    setInput('');
    setIsTyping(true);

    try {
      const currentHistory = currentTab === 'support' ? supportMessages : chefMessages;
      const recentHistory = currentHistory.slice(-4).map(m => ({
        role: m.role,
        content: m.text
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: getSystemPrompt(currentTab) },
            ...recentHistory,
            { role: 'user', content: userText }
          ],
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'API Error');

      const botText = data.text || "I'm having trouble thinking right now. 😵‍💫";

      const botMessage: Message = { role: 'assistant', text: botText };
      if (currentTab === 'support') setSupportMessages(prev => [...prev, botMessage]);
      else setChefMessages(prev => [...prev, botMessage]);

    } catch (error) {
      // Handled gracefully below — warn (not error) so it doesn't trip the dev overlay
      console.warn('Chat API unavailable:', error);
      const errorMsg: Message = { role: 'assistant', text: "Oops! My connection is a bit fuzzy. 📶 Please try again." };
      if (currentTab === 'support') setSupportMessages(prev => [...prev, errorMsg]);
      else setChefMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Helper to remove any Markdown that slips through
  const cleanText = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/__/g, '').replace(/###/g, '');
  };

  const handleMainClick = () => {
    if (isOpen) setIsOpen(false);
    else setShowOptions(!showOptions);
  };

  const openWhatsapp = () => {
    window.open(`https://wa.me/${KNOWLEDGE_BASE.service.contact_phone.replace(/[^0-9]/g, '')}`, '_blank');
    setShowOptions(false);
  };

  const openAIChat = () => {
    setIsOpen(true);
    setShowOptions(false);
  };

  const currentMessages = activeTab === 'support' ? supportMessages : chefMessages;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4 font-sans">

      {/* Quick options popup */}
      <AnimatePresence>
        {showOptions && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="bg-white/90 dark:bg-bg-color/90 backdrop-blur-xl rounded-2xl shadow-xl border border-brand-cream dark:border-white/10 overflow-hidden mb-2 w-64 origin-bottom-right"
          >
            <button onClick={openAIChat} className="flex items-center gap-3 w-full px-5 py-4 hover:bg-brand-light dark:hover:bg-white/5 transition-colors border-b border-brand-cream dark:border-white/10 text-left">
              <div className="bg-brand-brown/10 text-brand-brown p-2 rounded-full"><Leaf size={18} /></div>
              <div><p className="font-bold text-brand-text text-sm">AI Assistant</p><p className="text-xs text-brand-muted">Support &amp; Recipes</p></div>
            </button>
            <button onClick={openWhatsapp} className="flex items-center gap-3 w-full px-5 py-4 hover:bg-brand-light dark:hover:bg-white/5 transition-colors text-left">
              <div className="bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400 p-2 rounded-full"><Phone size={18} /></div>
              <div><p className="font-bold text-brand-text text-sm">WhatsApp</p><p className="text-xs text-brand-muted">{KNOWLEDGE_BASE.service.contact_phone}</p></div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="bg-white/95 dark:bg-bg-color/95 backdrop-blur-xl w-[90vw] sm:w-96 h-[550px] rounded-3xl shadow-2xl flex flex-col border border-brand-cream dark:border-white/10 overflow-hidden origin-bottom-right"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-brand-brown to-brand-dark text-white flex justify-between items-center shadow-md relative overflow-hidden">
              <div className="absolute -right-6 -top-10 w-28 h-28 bg-white/10 rounded-full blur-2xl" />
              <div className="flex items-center gap-2 relative z-10">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
                  <Leaf size={20} className="text-white/90" />
                </motion.div>
                <div><h3 className="font-bold text-sm leading-tight">Supr Assistant</h3><p className="text-[10px] text-white/70">Powered by Llama 3</p></div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors relative z-10"><X size={20} /></button>
            </div>

            {/* Tabs */}
            <div className="flex bg-brand-cream dark:bg-white/5 p-1 m-2 rounded-xl">
              <button onClick={() => setActiveTab('support')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'support' ? 'bg-white dark:bg-brand-darkCream text-brand-brown shadow-sm' : 'text-brand-muted hover:text-brand-text'}`}><HelpCircle size={14} /> Support</button>
              <button onClick={() => setActiveTab('chef')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'chef' ? 'bg-white dark:bg-brand-darkCream text-brand-brown shadow-sm' : 'text-brand-muted hover:text-brand-text'}`}><ChefHat size={14} /> Master Chef</button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-light/40 dark:bg-transparent">
              {currentMessages.map((m, i) => (
                <motion.div
                  key={`${activeTab}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 rounded-2xl text-sm max-w-[85%] shadow-sm whitespace-pre-wrap leading-relaxed ${m.role === 'user' ? 'bg-brand-brown text-white rounded-tr-none' : 'bg-white dark:bg-brand-darkCream border border-brand-cream dark:border-white/10 text-brand-text rounded-tl-none'}`}>
                    {cleanText(m.text)}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white dark:bg-brand-darkCream border border-brand-cream dark:border-white/10 p-3 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-brand-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-brand-cream dark:border-white/10 bg-white/50 dark:bg-transparent">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2 relative">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="flex-1 bg-brand-cream dark:bg-white/5 rounded-full pl-4 pr-12 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-brown/50 transition-all text-brand-text placeholder:text-brand-muted"
                  placeholder={activeTab === 'support' ? "Ask about orders... 🛒" : "Ask for recipes... 🥘"}
                  disabled={isTyping}
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  type="submit"
                  disabled={isTyping || !input.trim()}
                  className="absolute right-1.5 top-1.5 bottom-1.5 aspect-square bg-brand-brown text-white rounded-full grid place-items-center hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ArrowRight size={18} />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating action button */}
      <motion.button
        suppressHydrationWarning
        onClick={handleMainClick}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={{ rotate: isOpen || showOptions ? 90 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        aria-label="Open assistant"
        className={`p-4 rounded-full shadow-2xl shadow-brand-brown/30 text-white ${isOpen || showOptions ? 'bg-brand-dark' : 'bg-brand-brown'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
};
