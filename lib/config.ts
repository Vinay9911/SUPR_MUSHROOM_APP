export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Single source of truth for the admin identity. NEXT_PUBLIC_ so the client
// (AuthProvider/admin page) and the server (middleware) always agree.
export const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'vinayaggarwal271@gmail.com';
export const CURRENCY = '₹';
export const SHIPPING_COST = 0; // Free shipping
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://supr-mushroom.vercel.app';