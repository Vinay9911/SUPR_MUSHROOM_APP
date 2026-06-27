import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });
    }

    const supabase = await createClient();
    
    // Only fetch the requested coupon server-side
    const { data: coupon, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 404 });
    }

    // Return the coupon details needed for client-side display calculation
    return NextResponse.json({ 
      coupon: {
        code: coupon.code,
        discount_percentage: coupon.discount_percentage,
        min_order_value: coupon.min_order_value,
        max_discount_amount: coupon.max_discount_amount
      } 
    });
  } catch (error: any) {
    console.error('Coupon validation error:', error);
    return NextResponse.json(
      { error: 'Failed to validate coupon' },
      { status: 500 }
    );
  }
}
