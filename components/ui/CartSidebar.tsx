'use client';

import React, { useContext, useEffect, useState } from 'react';
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartContext } from '@/components/providers/CartProvider';
import Image from 'next/image';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose, onCheckout }) => {
  const cartContext = useContext(CartContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isMounted || !cartContext) return null;

  const { cart, updateQuantity, removeFromCart, total, cartCount } = cartContext;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <div 
        className={`fixed top-0 right-0 z-[70] h-full w-full md:w-[400px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-brand-cream bg-white">
            <div className="flex items-center gap-3">
              <div className="bg-brand-brown/10 p-2 rounded-full text-brand-brown">
                <ShoppingBag size={20} />
              </div>
              <h2 className="font-serif font-bold text-xl text-brand-text">Your Cart ({cartCount})</h2>
            </div>
            <button onClick={onClose} className="p-2 text-brand-muted hover:text-brand-brown hover:bg-brand-light rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-brand-light/30">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                <ShoppingBag size={64} className="text-brand-brown/20" />
                <p className="font-medium text-brand-muted">Your cart is empty</p>
                <button onClick={onClose} className="text-brand-brown font-bold hover:underline">Start Shopping</button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="flex gap-4 bg-white p-3 rounded-2xl border border-brand-cream shadow-sm">
                  <div className="relative w-20 h-20 bg-brand-light rounded-xl overflow-hidden flex-shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-sm text-brand-text line-clamp-2">{item.product.name}</h3>
                      <button onClick={() => removeFromCart(item.productId)} className="text-brand-muted hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex items-end justify-between">
                      <div className="flex items-center gap-3 bg-brand-light rounded-lg border border-brand-cream p-1">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white rounded-md text-brand-brown hover:bg-brand-brown hover:text-white transition-colors shadow-sm"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-white rounded-md text-brand-brown hover:bg-brand-brown hover:text-white transition-colors shadow-sm"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <p className="font-bold text-brand-brown">₹{item.product.price * item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-brand-cream bg-white space-y-4 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-center text-lg">
                <span className="text-brand-muted font-medium">Subtotal</span>
                <span className="font-bold text-brand-text text-xl">₹{total}</span>
              </div>
              <p className="text-xs text-brand-muted text-center">Shipping & taxes calculated at checkout</p>
              <button 
                onClick={() => { onClose(); onCheckout(); }}
                className="w-full bg-brand-brown text-white py-4 rounded-xl font-bold text-lg hover:bg-brand-dark transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-brand-brown/20"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};