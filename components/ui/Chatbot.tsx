'use client';

import React, { useState } from 'react';
import { MessageSquare, Leaf, X, ArrowRight, Phone, Plus } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from 'react-hot-toast';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Namaste! I am the Supr Mushrooms assistant. Ask me about our fresh mushrooms!' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!API_KEY) {
      console.error('Gemini API Key is missing');
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: "Sorry, the AI assistant is not configured. Please contact support." 
      }]);
      setIsTyping(false);
      toast.error("AI configuration missing");
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are the Supr Mushrooms assistant for a premium organic mushroom farm in Delhi NCR. 

Our Products:
- Oyster Mushrooms (Fresh, organic, ₹200/kg)
- Button Mushrooms (White mushrooms, ₹180/kg)
- Cremini Mushrooms (Baby bella, ₹220/kg)
- King Oyster Mushrooms (Premium, ₹250/kg)

We deliver across Delhi, Noida, Gurugram, Ghaziabad within 24-48 hours.
Payment: Cash on Delivery or UPI
Contact: +91-8826986127

User question: ${userMsg}

Provide a helpful, friendly response in 2-3 sentences. Focus on our products and services.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      setMessages(prev => [...prev, { role: 'bot', text }]);
    } catch (error: any) {
      console.error('Chatbot error:', error);
      let errorMessage = "I'm having trouble connecting. Please try again or contact us directly.";
      
      if (error.message?.includes('API_KEY_INVALID')) {
        errorMessage = "Service temporarily unavailable. Please call +91-8826986127 for assistance.";
      } else if (error.message?.includes('RATE_LIMIT')) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      }
      
      setMessages(prev => [...prev, { role: 'bot', text: errorMessage }]);
      toast.error("Connection issue");
    } finally {
      setIsTyping(false);
    }
  };

  const handleMainClick = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setShowOptions(!showOptions);
    }
  };

  const openWhatsapp = () => {
    window.open('https://wa.me/918826986127', '_blank');
    setShowOptions(false);
  };

  const openAIChat = () => {
    setIsOpen(true);
    setShowOptions(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
      
      {showOptions && !isOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-brand-cream overflow-hidden mb-2 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <button onClick={openAIChat} className="flex items-center gap-3 w-full px-6 py-4 hover:bg-brand-light transition-colors border-b border-brand-cream text-left">
            <div className="bg-brand-brown/10 text-brand-brown p-2 rounded-full">
              <Leaf size={18} />
            </div>
            <div>
              <p className="font-bold text-brand-text text-sm">AI Assistant</p>
              <p className="text-xs text-brand-muted">Ask about mushrooms</p>
            </div>
          </button>
          
          <button onClick={openWhatsapp} className="flex items-center gap-3 w-full px-6 py-4 hover:bg-brand-light transition-colors text-left">
            <div className="bg-green-100 text-green-600 p-2 rounded-full">
              <Phone size={18} />
            </div>
            <div>
              <p className="font-bold text-brand-text text-sm">WhatsApp</p>
              <p className="text-xs text-brand-muted">+91 8826986127</p>
            </div>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col border border-brand-cream animate-in slide-in-from-bottom-5">
           <div className="p-4 bg-brand-brown rounded-t-3xl text-white flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Leaf size={18} className="text-white/80" />
                <span className="font-bold text-sm">Supr Assistant</span>
             </div>
             <button onClick={() => setIsOpen(false)}><X size={18} /></button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-light">
             {messages.map((m, i) => (
               <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${m.role === 'user' ? 'bg-brand-brown text-white rounded-tr-none' : 'bg-white border border-brand-cream text-brand-text rounded-tl-none'}`}>
                    {m.text}
                  </div>
               </div>
             ))}
             {isTyping && (
               <div className="flex justify-start">
                 <div className="bg-white border border-brand-cream p-3 rounded-2xl rounded-tl-none">
                   <div className="flex gap-1">
                     <span className="w-2 h-2 bg-brand-brown/40 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                     <span className="w-2 h-2 bg-brand-brown/40 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                     <span className="w-2 h-2 bg-brand-brown/40 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                   </div>
                 </div>
               </div>
             )}
           </div>
           
           <div className="p-3 border-t border-brand-cream bg-white">
             <form onSubmit={(e) => {e.preventDefault(); handleSend()}} className="flex gap-2">
               <input 
                 value={input} 
                 onChange={e=>setInput(e.target.value)} 
                 className="flex-1 bg-brand-light rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-brand-brown" 
                 placeholder="Ask about mushrooms..." 
                 disabled={isTyping}
               />
               <button 
                 type="submit" 
                 disabled={isTyping || !input.trim()}
                 className="bg-brand-brown text-white p-2 rounded-full hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                 <ArrowRight size={18}/>
               </button>
             </form>
           </div>
        </div>
      )}

      <button 
        onClick={handleMainClick} 
        className={`p-4 rounded-full shadow-2xl transition-all hover:scale-110 ${isOpen || showOptions ? 'bg-brand-dark rotate-45' : 'bg-brand-brown'} text-white`}
      >
        {isOpen ? <Plus className="rotate-45" size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
};