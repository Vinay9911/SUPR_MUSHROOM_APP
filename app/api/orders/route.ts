import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  
  try {
    const body = await request.json();
    const { 
      items, 
      shipping_address, 
      payment_method, 
      payment_proof_url,
      coupon_code,
      user_id, 
      guest_email 
    } = body;

    // 1. Validate Items & Calculate Total Server-Side
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const { data: product, error } = await supabase
        .from('products')
        .select('id, price, stock, name, status')
        .eq('id', item.productId)
        .single();

      if (error || !product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }

      // Stock Check (Skip for 'coming_soon')
      if (product.status !== 'coming_soon' && product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${product.name}` }, { status: 400 });
      }

      calculatedTotal += product.price * item.quantity;

      validatedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price: product.price // Crucial: Using server price
      });
    }

    // 2. Validate Coupon Server-Side
    let discount = 0;
    if (coupon_code) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (!coupon) {
        return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
      }

      if (coupon.min_order_value && calculatedTotal < coupon.min_order_value) {
        return NextResponse.json({ error: `Coupon requires minimum order of ₹${coupon.min_order_value}` }, { status: 400 });
      }

      discount = Math.round((calculatedTotal * coupon.discount_percentage) / 100);
      
      if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
        discount = coupon.max_discount_amount;
      }
    }

    const finalTotal = calculatedTotal - discount;

    // 3. Call Database RPC (Atomic Transaction)
    const { data, error: procError } = await supabase.rpc('process_order', {
      p_user_id: user_id,
      p_guest_email: guest_email,
      p_shipping_address: shipping_address,
      p_payment_method: payment_method,
      p_payment_proof_url: payment_proof_url,
      p_coupon_code: coupon_code,
      p_discount_applied: discount,
      p_total_amount: finalTotal,
      p_items: validatedItems,
    });

    if (procError) {
      console.error('RPC Error:', procError);
      throw new Error(procError.message);
    }

    if (!data || !data[0]?.success) {
      throw new Error(data?.[0]?.error_message || 'Order processing failed unexpectedly');
    }

    return NextResponse.json({
      success: true,
      orderId: data[0].order_id,
      message: 'Order placed successfully',
    });

  } catch (error: any) {
    console.error('Order API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}