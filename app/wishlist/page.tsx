'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { WishlistContext } from '@/context/WishlistContext';
import { DataContext } from '@/context/DataContext';
import { CartContext } from '@/context/CartContext';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useContext(WishlistContext)!;
  const { products } = useContext(DataContext)!;
  const cartCtx = useContext(CartContext);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  const moveToCart = (product: any) => {
    cartCtx?.addToCart(product, 1);
    removeFromWishlist(product.id);
    toast.success("Moved to Cart");
  };

  return (
    <div className="min-h-screen bg-brand-light pt-24 px-4 pb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-text mb-8 flex items-center gap-3">
          <Heart className="text-brand-brown" fill="currentColor" /> My Wishlist
        </h1>
        
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-lg border border-brand-cream">
            <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6 text-brand-brown/40">
               <Heart size={40} />
            </div>
            <h3 className="text-xl font-bold text-brand-text mb-2">Your wishlist is empty</h3>
            <p className="text-brand-muted mb-8">Save your favorites here to order them later.</p>
            <Link href="/" className="inline-flex items-center gap-2 bg-brand-brown text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition-colors">
               Start Shopping <ArrowRight size={18}/>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map(product => (
              <div key={product.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-brand-cream relative group transition-all hover:shadow-xl duration-300">
                <Link href={`/product/${product.id}`} className="block relative aspect-square overflow-hidden">
                   <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.name} />
                   {product.stock === 0 && <div className="absolute inset-0 bg-white/60 flex items-center justify-center font-bold text-brand-text">Out of Stock</div>}
                </Link>
                
                <button onClick={() => removeFromWishlist(product.id)} className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md text-red-400 hover:text-red-600 hover:bg-red-50 z-10 transition-colors">
                  <Trash2 size={16} />
                </button>

                <div className="p-5">
                  <Link href={`/product/${product.id}`}>
                    <h4 className="font-bold text-brand-text mb-1 truncate hover:text-brand-brown transition-colors">{product.name}</h4>
                  </Link>
                  <p className="text-xs text-brand-muted mb-4">{product.weight}</p>
                  
                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-brand-light">
                    <p className="text-brand-brown font-bold text-lg">₹{product.price}</p>
                    <button 
                      onClick={() => moveToCart(product)}
                      disabled={product.stock === 0}
                      className="bg-brand-text text-white p-2.5 rounded-xl hover:bg-brand-brown disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-black/5"
                      title="Move to Cart"
                    >
                      <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}