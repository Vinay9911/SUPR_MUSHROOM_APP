'use client';

import React, { useState, useContext } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChefHat, Sparkles, ShoppingCart, Loader2 } from 'lucide-react';

import { CartContext } from '@/components/providers/CartProvider';
import toast from 'react-hot-toast';

export default function AIChefPage() {
  
  const cartContext = useContext(CartContext);
  const cart = cartContext?.cart || [];
  
  const [recipe, setRecipe] = useState('');
  const [loading, setLoading] = useState(false);
  
  const generateRecipe = async () => {
    
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!API_KEY) return toast.error("API Key missing");

    setLoading(true);
    setRecipe('');
    
    try {
      const ingredients = cart.length > 0 
        ? cart.map(i => i.product.name).join(', ') 
        : "Oyster Mushrooms, Shiitake Mushrooms";

      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      const prompt = `You are a Michelin Star Chef specializing in vegetarian organic cuisine. 
      Create a unique, healthy recipe using these main ingredients: ${ingredients}. 
      Format nicely with: 
      1. Creative Name 
      2. Ingredients List 
      3. Step-by-Step Instructions. 
      Keep it under 300 words.`;

      const result = await model.generateContent(prompt);
      setRecipe(result.response.text());
    } catch (error) {
      console.error(error);
      toast.error("Chef is busy. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light pt-24 pb-20 px-4">
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top-5 duration-700">
          <div className="w-16 h-16 bg-brand-brown rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-brand-brown/30 rotate-3">
            <ChefHat size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-text mb-4">The Organic AI Chef</h1>
          <p className="text-lg text-brand-muted max-w-2xl mx-auto">
            Don't know what to cook? Our AI Chef creates custom gourmet recipes based on the fresh mushrooms in your cart.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-brand-cream shadow-xl shadow-brand-brown/5 relative overflow-hidden">
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 bg-brand-light p-6 rounded-2xl border border-brand-cream">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-brown/10 text-brand-brown rounded-full"><ShoppingCart size={20}/></div>
                <div>
                  <h3 className="font-bold text-brand-text">Your Pantry</h3>
                  <p className="text-sm text-brand-muted">
                    {cart.length > 0 ? `${cart.length} items selected` : 'Using default ingredients'}
                  </p>
                </div>
              </div>
              <button 
                onClick={generateRecipe} 
                disabled={loading}
                className="bg-brand-brown text-white px-8 py-3 rounded-xl font-bold hover:bg-brand-dark transition-all flex items-center gap-2 shadow-lg hover:shadow-brand-brown/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={18} /> Generate Recipe</>}
              </button>
            </div>

            {recipe ? (
              <div className="bg-white p-8 rounded-2xl border border-brand-cream shadow-sm animate-in fade-in slide-in-from-bottom-5">
                <div className="prose prose-brown max-w-none">
                  <div className="whitespace-pre-wrap font-sans text-brand-text leading-relaxed">
                    {recipe.split('**').map((part, i) => 
                      i % 2 === 1 ? <span key={i} className="font-bold text-brand-brown text-lg block mt-4 mb-2">{part}</span> : part
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-brand-cream rounded-2xl bg-brand-light/30">
                <p className="text-brand-muted italic">Click "Generate Recipe" to start cooking!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}