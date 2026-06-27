'use client'

import React, { useContext, useState } from 'react';
import Link from 'next/link';
import { Plus, Minus, Heart, Search, Filter } from 'lucide-react';
import { CartContext } from '@/components/providers/CartProvider';
import { WishlistContext } from '@/components/providers/WishlistProvider';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MagneticButton } from '@/components/ui/MagneticButton';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

interface ShopSectionProps {
  visibleProducts: any[];
}

export const ShopSection: React.FC<ShopSectionProps> = ({ visibleProducts }) => {
  const cartContext = useContext(CartContext);
  const wishlistContext = useContext(WishlistContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredProducts = visibleProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'in_stock') return matchesSearch && product.stock > 0 && product.status !== 'coming_soon';
    if (filterType === 'coming_soon') return matchesSearch && product.status === 'coming_soon';
    
    return matchesSearch;
  });

  const handleWishlistToggle = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlistContext?.isInWishlist(productId)) {
      wishlistContext.removeFromWishlist(productId);
    } else {
      wishlistContext?.addToWishlist(productId);
    }
  };

  return (
    <section id="shop" className="pt-16 md:pt-24 pb-24 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div className="flex-1">
            <h2 className="text-xs md:text-sm font-bold text-brand-green uppercase tracking-widest mb-2">Buy Fresh Mushrooms Delhi NCR</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-text">Premium Organic Mushrooms</h3>
            <p className="text-brand-muted mt-2">Oyster, Button, Cremini & King Oyster Mushrooms - Delivered Across Delhi, Noida, Gurugram, Ghaziabad</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
              <input 
                type="text" 
                placeholder="Search mushrooms..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-3 rounded-xl border border-brand-cream dark:border-brand-cream/20 bg-white dark:bg-brand-light focus:border-brand-brown outline-none transition-colors"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full sm:w-auto pl-10 pr-8 py-3 rounded-xl border border-brand-cream dark:border-brand-cream/20 bg-white dark:bg-brand-light focus:border-brand-brown outline-none appearance-none transition-colors cursor-pointer"
              >
                <option value="all">All Products</option>
                <option value="in_stock">In Stock Only</option>
                <option value="coming_soon">Coming Soon</option>
              </select>
            </div>
          </div>
        </motion.div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-brand-muted text-lg">No mushrooms found matching your criteria.</p>
            <button onClick={() => {setSearchQuery(''); setFilterType('all');}} className="mt-4 text-brand-brown font-bold hover:underline">Clear Filters</button>
          </div>
        ) : (
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {filteredProducts.map((product: any) => {
            const isOutOfStock = product.stock === 0;
            const isComingSoon = product.status === 'coming_soon';
            const cartItem = cartContext?.cart.find(item => item.productId === product.id);
            const quantityInCart = cartItem ? cartItem.quantity : 0;
            const isWishlisted = wishlistContext?.isInWishlist(product.id);

            return (
            <motion.div variants={fadeInUp} key={product.id} className="group bg-white dark:bg-brand-light rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-brand-cream dark:border-brand-cream/20 flex flex-col h-full relative">
              <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden cursor-pointer">
                {isOutOfStock && !isComingSoon && <div className="absolute inset-0 bg-white/60 dark:bg-bg-color/60 z-10 flex items-center justify-center"><span className="bg-brand-dark text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm">Out of Stock</span></div>}
                <Image 
                  src={product.images[0]} 
                  alt={`Fresh ${product.name} - Premium organic mushrooms grown in vertical farm Delhi NCR`}
                  fill 
                  className={`object-cover transition-transform duration-700 ${product.images[1] ? 'group-hover:opacity-0' : 'group-hover:scale-110'}`} 
                />
                {product.images[1] && (
                  <Image 
                    src={product.images[1]} 
                    alt={`Fresh ${product.name} prepared`}
                    fill 
                    className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                  />
                )}
                <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-2 z-10">
                   {isComingSoon && (
                     <div className="bg-slate-800 text-white text-[8px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider w-fit shadow-md border border-white/20">Coming Soon</div>
                   )}
                </div>
                <button onClick={(e) => handleWishlistToggle(e, product.id)} className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-white/80 dark:bg-bg-color/80 hover:bg-white dark:hover:bg-bg-color backdrop-blur-sm rounded-full shadow-sm z-20 text-brand-brown transition-all hover:scale-110" aria-label={`Add ${product.name} to wishlist`}>
                  <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </Link>

              <div className="p-3 md:p-6 flex flex-col flex-grow">
                <Link href={`/product/${product.id}`}>
                  <h4 className="text-sm md:text-lg font-bold text-brand-text mb-1 md:mb-2 group-hover:text-brand-brown transition-colors line-clamp-2 leading-tight">{product.name}</h4>
                </Link>
                <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-brand-muted mb-2 md:mb-4">
                  <span>{product.weight}</span>
                </div>
                <div className="mt-auto pt-2 md:pt-4 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
                  <div>
                    <span className="hidden md:block text-sm text-brand-muted font-medium">{isComingSoon ? "Expected Price" : "Price"}</span>
                    <div className="text-base md:text-xl font-bold text-brand-brown">₹{product.price}</div>
                  </div>
                  {!isComingSoon && (
                    quantityInCart > 0 ? (
                      <div className="flex items-center justify-between md:justify-start gap-2 bg-brand-brown text-white rounded-lg md:rounded-xl p-1 shadow-lg shadow-brand-brown/20" onClick={(e) => e.preventDefault()}>
                         <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); cartContext?.updateQuantity(product.id, quantityInCart - 1); }} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-white/20 rounded-md md:rounded-lg transition-colors" aria-label="Decrease quantity"><Minus size={14} className="md:w-4 md:h-4"/></button>
                         <span className="font-bold text-xs md:text-sm w-4 text-center">{quantityInCart}</span>
                         <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); cartContext?.updateQuantity(product.id, quantityInCart + 1); }} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-white/20 rounded-md md:rounded-lg transition-colors" aria-label="Increase quantity"><Plus size={14} className="md:w-4 md:h-4"/></button>
                      </div>
                    ) : (
                      <MagneticButton disabled={isOutOfStock} onClick={(e) => { e.preventDefault(); if (!isOutOfStock) { cartContext?.addToCart(product, 1); }}} className={`w-full md:w-12 h-8 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center transition-all ${isOutOfStock ? 'bg-gray-200 text-brand-muted cursor-not-allowed' : 'bg-brand-brown text-white hover:bg-brand-dark hover:-translate-y-1 shadow-lg shadow-brand-brown/20'}`} aria-label={`Add ${product.name} to cart`}>
                        <Plus size={18} className="md:w-5 md:h-5" />
                      </MagneticButton>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )})}
        </motion.div>
        )}
      </div>
    </section>
  );
};
