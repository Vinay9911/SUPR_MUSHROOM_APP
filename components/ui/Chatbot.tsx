'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Leaf, X, ArrowRight, Phone, ChefHat, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product } from '@/types'; 

// --- CONFIGURATION ---
// SECURE FIX: Now using environment variable
const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY || '';
const GROQ_MODEL = 'llama-3.1-8b-instant';

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

  // --- 1. FETCH REAL-TIME PRODUCTS ---
  useEffect(() => {
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
    fetchProducts();
  }, []);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [supportMessages, chefMessages, activeTab, isTyping]);

  // --- 2. ROBUST SYSTEM PROMPT ---
  const getSystemPrompt = (tab: Tab) => {
    // Dynamic Product List
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
    
    if (!GROQ_API_KEY) {
      toast.error("AI Service Unavailable (Missing Key)");
      return;
    }
    
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

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: getSystemPrompt(currentTab) },
            ...recentHistory,
            { role: 'user', content: userText }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error?.message || 'API Error');

      const botText = data.choices[0]?.message?.content || "I'm having trouble thinking right now. 😵‍💫";

      const botMessage: Message = { role: 'assistant', text: botText };
      if (currentTab === 'support') setSupportMessages(prev => [...prev, botMessage]);
      else setChefMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Groq API Error:', error);
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
      
      {showOptions && !isOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-brand-cream overflow-hidden mb-2 animate-in slide-in-from-bottom-2 fade-in duration-200 w-64">
          <button onClick={openAIChat} className="flex items-center gap-3 w-full px-5 py-4 hover:bg-brand-light transition-colors border-b border-gray-100 text-left">
            <div className="bg-brand-brown/10 text-brand-brown p-2 rounded-full"><Leaf size={18} /></div>
            <div><p className="font-bold text-gray-800 text-sm">AI Assistant</p><p className="text-xs text-gray-500">Support & Recipes</p></div>
          </button>
          <button onClick={openWhatsapp} className="flex items-center gap-3 w-full px-5 py-4 hover:bg-brand-light transition-colors text-left">
            <div className="bg-green-100 text-green-600 p-2 rounded-full"><Phone size={18} /></div>
            <div><p className="font-bold text-gray-800 text-sm">WhatsApp</p><p className="text-xs text-gray-500">{KNOWLEDGE_BASE.service.contact_phone}</p></div>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="bg-white w-[90vw] sm:w-96 h-[550px] rounded-3xl shadow-2xl flex flex-col border border-brand-cream animate-in slide-in-from-bottom-5 overflow-hidden">
           <div className="p-4 bg-brand-brown text-white flex justify-between items-center shadow-md">
             <div className="flex items-center gap-2">
                <Leaf size={20} className="text-white/90" />
                <div><h3 className="font-bold text-sm leading-tight">Supr Assistant</h3><p className="text-[10px] text-white/70">Powered by Llama 3</p></div>
             </div>
             <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors"><X size={20} /></button>
           </div>
           
           <div className="flex bg-gray-100 p-1 m-2 rounded-xl">
              <button onClick={() => setActiveTab('support')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'support' ? 'bg-white text-brand-brown shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><HelpCircle size={14} /> Support</button>
              <button onClick={() => setActiveTab('chef')} className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${activeTab === 'chef' ? 'bg-white text-brand-brown shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><ChefHat size={14} /> Master Chef</button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
             {currentMessages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-sm max-w-[85%] shadow-sm ${m.role === 'user' ? 'bg-brand-brown text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                    {/* CLEANED TEXT RENDERING */}
                    {cleanText(m.text)}
                  </div>
               </div>
             ))}
             {isTyping && (
               <div className="flex justify-start">
                 <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                   <div className="flex gap-1">
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                     <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                   </div>
                 </div>
               </div>
             )}
             <div ref={messagesEndRef} />
           </div>
           
           <div className="p-3 border-t border-gray-100 bg-white">
             <form onSubmit={(e) => {e.preventDefault(); handleSend()}} className="flex gap-2 relative">
               <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 bg-gray-100 rounded-full pl-4 pr-10 py-3 text-sm outline-none focus:ring-2 focus:ring-brand-brown/50 transition-all text-gray-800 placeholder:text-gray-400" placeholder={activeTab === 'support' ? "Ask about orders... 🛒" : "Ask for recipes... 🥘"} disabled={isTyping}/>
               <button type="submit" disabled={isTyping || !input.trim()} className="absolute right-1.5 top-1.5 bg-brand-brown text-white p-1.5 rounded-full hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"><ArrowRight size={18}/></button>
             </form>
           </div>
        </div>
      )}

      <button onClick={handleMainClick} className={`p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 ${isOpen || showOptions ? 'bg-brand-dark rotate-90' : 'bg-brand-brown'} text-white`}>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};