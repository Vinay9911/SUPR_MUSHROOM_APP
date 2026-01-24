'use client';

import React, { createContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Product, Category, FarmingMethod } from '../types';

interface DataContextType {
  products: Product[];
  loading: boolean;
  refreshProducts: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // 1. Fetch from 'products' table ONLY (No joins needed anymore)
      const { data: productsData, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;

      const formattedProducts: Product[] = productsData.map((p: any) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        category: p.category_id ? Category.MUSHROOMS : Category.SAFFRON,
        farming_method: p.farming_method as FarmingMethod,
        images: p.images || [],
        
        // NEW FIELDS (Directly from product table)
        price: p.price || 0,
        stock: p.stock || 0,
        weight: p.weight || 'Default',
        status: p.status || 'active',
        is_deleted: p.is_deleted || false,
        
        rating: p.rating || 5,
        reviews_count: p.reviews_count || 0,
        discount_percentage: p.discount_percentage,
      }));

      setProducts(formattedProducts);
    } catch (err) { 
      console.error("Error fetching products:", err); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <DataContext.Provider value={{ products, loading, refreshProducts: fetchProducts }}>
      {children}
    </DataContext.Provider>
  );
};