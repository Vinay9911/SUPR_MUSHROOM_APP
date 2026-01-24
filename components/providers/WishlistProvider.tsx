'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthContext } from './AuthContext';
import { Product } from '../types';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlist: string[]; // Stores product IDs
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createClient();
  const { user } = useContext(AuthContext)!;
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    if (user) fetchWishlist();
    else setWishlist([]);
  }, [user]);

  const fetchWishlist = async () => {
    if (!user) return;
    const { data } = await supabase.from('wishlist').select('product_id').eq('user_id', user.id);
    if (data) setWishlist(data.map((item: any) => item.product_id));
  };

  const addToWishlist = async (productId: string) => {
    if (!user) { toast.error("Please login first"); return; }
    try {
      const { error } = await supabase.from('wishlist').insert({ user_id: user.id, product_id: productId });
      if (error) throw error;
      setWishlist(prev => [...prev, productId]);
      toast.success("Added to Wishlist");
    } catch (err) { toast.error("Could not add to wishlist"); }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;
    try {
      await supabase.from('wishlist').delete().match({ user_id: user.id, product_id: productId });
      setWishlist(prev => prev.filter(id => id !== productId));
      toast.success("Removed from Wishlist");
    } catch (err) { toast.error("Could not remove"); }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};