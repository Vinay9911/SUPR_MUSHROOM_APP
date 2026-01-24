'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
// FIXED: Changed '../types' to '@/types'
import { Product, CartItem } from '@/types';
import { createClient } from '@/lib/supabase/client';
// FIXED: Changed './AuthContext' to './AuthProvider'
import { AuthContext } from './AuthProvider';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  isLoading: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  validateStock: () => Promise<boolean>;
  total: number;
  cartCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createClient();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // FIXED: Ensure AuthContext is imported from AuthProvider
  const { user } = useContext(AuthContext)!;

  // 1. INITIAL LOAD
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      if (user) {
        const { data } = await supabase.from('carts').select('items').eq('user_id', user.id).single();
        if (data?.items) {
          setCart(data.items);
        } else {
          // Sync local to DB if just logged in
          const local = localStorage.getItem('supr_cart');
          if (local) {
            const parsed = JSON.parse(local);
            setCart(parsed);
            await supabase.from('carts').upsert({ user_id: user.id, items: parsed });
          }
        }
      } else {
        const savedCart = localStorage.getItem('supr_cart');
        if (savedCart) try { setCart(JSON.parse(savedCart)); } catch (e) { console.error(e); }
      }
      setIsLoading(false);
    };
    loadCart();
  }, [user]);

  // 2. PERSISTENCE
  useEffect(() => {
    if (user) {
      const saveToDb = async () => {
        await supabase.from('carts').upsert({ user_id: user.id, items: cart }, { onConflict: 'user_id' });
      };
      saveToDb();
    } else {
      localStorage.setItem('supr_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  // 3. REAL-TIME STOCK SYNC
  useEffect(() => {
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'products' }, (payload) => {
        const updatedProduct = payload.new as Product;
        setCart(prev => {
          const needsUpdate = prev.some(item => item.productId === updatedProduct.id);
          if (!needsUpdate) return prev;

          return prev.map(item => {
            if (item.productId === updatedProduct.id) {
               // Update price/info dynamically
               const newItem = { ...item, product: { ...item.product, ...updatedProduct } };
               
               // Only reduce stock if it's NOT a pre-order
               if (!item.isPreOrder && updatedProduct.stock < item.quantity) {
                 toast.error(`Stock alert: ${updatedProduct.name} only has ${updatedProduct.stock} left.`);
                 newItem.quantity = updatedProduct.stock;
               }
               return newItem;
            }
            return item;
          }).filter(item => item.isPreOrder || item.quantity > 0);
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const validateStock = async (): Promise<boolean> => {
    setIsLoading(true);
    let isValid = true;
    const updatedCart = [...cart];
    if (updatedCart.length === 0) { setIsLoading(false); return true; }

    const productIds = cart.map(item => item.productId);
    const { data: products } = await supabase
      .from('products')
      .select('id, stock, name, price, is_deleted, status')
      .in('id', productIds);

    if (!products) { setIsLoading(false); return true; }

    for (let i = 0; i < updatedCart.length; i++) {
      const item = updatedCart[i];
      const remoteProduct = products.find(p => p.id === item.productId);

      if (!remoteProduct || remoteProduct.is_deleted) {
        toast.error(`${item.product.name} is no longer available.`);
        updatedCart.splice(i, 1);
        i--; isValid = false; continue;
      }

      // Check Pre-Order Status
      if (remoteProduct.status === 'coming_soon') {
        updatedCart[i].isPreOrder = true;
      } else {
        updatedCart[i].isPreOrder = false;
        // Standard Stock Check
        if (remoteProduct.stock < item.quantity) {
          toast.error(`Stock update: Only ${remoteProduct.stock} left of ${item.product.name}.`);
          updatedCart[i].quantity = remoteProduct.stock;
          isValid = false;
          if (remoteProduct.stock === 0) {
             updatedCart.splice(i, 1);
             i--;
          }
        }
      }
      
      // Sync Price
      if (remoteProduct.price !== item.product.price) {
          updatedCart[i].product.price = remoteProduct.price;
      }
    }

    if (!isValid) setCart(updatedCart);
    setIsLoading(false);
    return isValid;
  };

  const addToCart = async (product: Product, quantity: number) => {
    setIsLoading(true);
    const isPreOrder = product.status === 'coming_soon';

    // Skip stock check for pre-orders
    if (!isPreOrder) {
      const { data: freshProd } = await supabase.from('products').select('stock').eq('id', product.id).single();
      const actualStock = freshProd ? freshProd.stock : product.stock;
      
      const existingItem = cart.find(item => item.productId === product.id);
      const currentQty = existingItem ? existingItem.quantity : 0;
      
      if (currentQty + quantity > actualStock) {
        toast.error(`Sorry, only ${actualStock} units available right now!`);
        setIsLoading(false);
        return;
      }
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.productId === product.id);
      if (existingItem) {
        return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      }
      return [...prev, { id: product.id, productId: product.id, quantity, product, isPreOrder }];
    });
    
    setIsCartOpen(true);
    setIsLoading(false);
    toast.success(isPreOrder ? 'Pre-order added!' : 'Added to Cart!');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) { removeFromCart(productId); return; }
    
    const item = cart.find(i => i.productId === productId);
    if (!item) return;

    if (!item.isPreOrder && quantity > item.product.stock) {
      toast.error(`Max stock reached (${item.product.stock})`);
      return;
    }
    setCart(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, isCartOpen, isLoading, setIsCartOpen, addToCart, removeFromCart, updateQuantity, clearCart, validateStock, total, cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};