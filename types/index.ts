export enum Category {
  MUSHROOMS = 'Mushrooms',
  SAFFRON = 'Saffron',
}

export enum FarmingMethod {
  MODERN = 'Modern Farming',
  AEROPONIC = 'Aeroponic',
}

export type ProductStatus = 'active' | 'hidden' | 'coming_soon';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  farming_method: FarmingMethod;
  images: string[];
  price: number;
  stock: number;
  weight: string;
  status: ProductStatus;
  is_deleted: boolean;
  rating: number;
  reviews_count: number;
  discount_percentage?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
  isPreOrder?: boolean;
}

export interface AuthUser {
  id: string;
  email?: string;
  full_name?: string;
}

export interface WishlistItem {
  id: string;
  product: Product;
}

export interface Coupon {
  id: string;
  code: string;
  discount_percentage: number;
  is_active: boolean;
  usage_count: number;
  min_order_value?: number;
  max_discount_amount?: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_order: number;
  product_name_snapshot: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  guest_email?: string;
  total_amount: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  shipping_address: string;
  payment_method: string;
  created_at: string;
  order_items?: OrderItem[];
  coupon_code?: string;
  discount_applied?: number;
  payment_proof_url?: string; 
}