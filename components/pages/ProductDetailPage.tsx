'use client'

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingBag, Truck, ShieldCheck, Leaf, Heart } from 'lucide-react';
import { DataContext } from '@/components/providers/DataProvider';
import { CartContext } from '@/components/providers/CartProvider';
import { WishlistContext } from '@/components/providers/WishlistProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
// 1. Import Haptics
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface ProductDetailPageProps {
  product: any;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const cartContext = useContext(CartContext);
  const wishlistContext = useContext(WishlistContext);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Helper to trigger vibration safely (won't crash on web)
  const triggerHaptic = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (e) {
      // Ignore if on web/not available
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isOutOfStock = product.stock === 0;
  const isComingSoon = product.status === 'coming_soon';
  const isWishlisted = wishlistContext?.isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!isOutOfStock && !isComingSoon) {
      // 2. Trigger Haptic on Add to Cart
      triggerHaptic();
      cartContext?.addToCart(product, quantity);
    }
  };

  const handleWishlistToggle = () => {
    // 3. Trigger Haptic on Wishlist Toggle
    triggerHaptic();
    if (isWishlisted) {
      wishlistContext?.removeFromWishlist(product.id);
    } else {
      wishlistContext?.addToWishlist(product.id);
    }
  };

  return (
    <div className="pt-24 pb-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-brown font-medium mb-8 hover:underline">
          <ArrowLeft size={20} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-brand-cream relative group">
              {isOutOfStock && !isComingSoon && (
                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                  <span className="bg-brand-text text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl">Out of Stock</span>
                </div>
              )}
              
              <Image 
                src={product.images[activeImage]} 
                alt={product.name} 
                width={1000}
                height={1000}
                quality={95}
                priority
                className="w-full h-full object-cover"
              />
              
              <button 
                onClick={handleWishlistToggle}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-md text-brand-brown transition-transform hover:scale-110 hidden md:block"
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-brand-brown ring-2 ring-brand-brown/20' : 'border-transparent hover:border-brand-cream'}`}
                  >
                    <Image src={img} alt="" width={96} height={96} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
               {isComingSoon ? (
                 <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Coming Soon</span>
               ) : (
                 <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">In Stock</span>
               )}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-text mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-8">
              <span className="text-3xl font-bold text-brand-brown">₹{product.price}</span>
              <span className="text-brand-muted mb-1.5">{product.weight}</span>
            </div>

            <p className="text-brand-muted text-lg leading-relaxed mb-8 border-b border-brand-cream pb-8">
              {product.description}
            </p>

            <div className="space-y-6 mb-8">
               {!isComingSoon && (
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-brand-text uppercase tracking-widest">Quantity</span>
                  <div className="flex items-center gap-3 bg-brand-light rounded-full p-1 border border-brand-cream">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white transition-colors shadow-sm"
                      disabled={isOutOfStock}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white transition-colors shadow-sm"
                      disabled={isOutOfStock}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || isComingSoon}
                  className={`flex-1 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${
                    isOutOfStock || isComingSoon
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-brand-brown text-white hover:bg-brand-dark hover:shadow-2xl hover:-translate-y-1'
                  }`}
                >
                  <ShoppingBag size={22} />
                  {isComingSoon ? "Notify Me" : isOutOfStock ? "Out of Stock" : "Add to Cart"}
                </button>
                
                <button 
                  onClick={handleWishlistToggle}
                  className="w-16 h-16 rounded-full border border-brand-cream flex items-center justify-center text-brand-brown hover:bg-brand-light transition-colors md:hidden"
                >
                   <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="flex items-center gap-3 p-4 bg-brand-light rounded-2xl border border-brand-cream/50">
                 <Truck className="text-brand-brown" size={24} />
                 <div>
                   <div className="font-bold text-sm text-brand-text">Next Day</div>
                   <div className="text-xs text-brand-muted">Delivery</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-4 bg-brand-light rounded-2xl border border-brand-cream/50">
                 <Leaf className="text-brand-brown" size={24} />
                 <div>
                   <div className="font-bold text-sm text-brand-text">100% Organic</div>
                   <div className="text-xs text-brand-muted">Certified</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-4 bg-brand-light rounded-2xl border border-brand-cream/50">
                 <ShieldCheck className="text-brand-brown" size={24} />
                 <div>
                   <div className="font-bold text-sm text-brand-text">Chemical Free</div>
                   <div className="text-xs text-brand-muted">Lab Tested</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Sticky Bar (Mobile) */}
      <AnimatePresence>
        {showStickyBar && !isComingSoon && !isOutOfStock && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 md:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-safe"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 font-medium">Total for {quantity}</span>
                <span className="text-xl font-bold text-brand-brown">₹{product.price * quantity}</span>
              </div>
              
              <div className="flex flex-1 gap-2">
                 <button onClick={handleWishlistToggle} className="p-3 bg-gray-100 rounded-full text-brand-brown">
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"}/>
                 </button>
                 <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand-brown text-white py-3 rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};