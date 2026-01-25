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

    // ✅ STEP 1: SERVER-SIDE STOCK & PRICE VALIDATION
    let calculatedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const { data: product, error } = await supabase
        .from('products')
        .select('id, price, stock, name, status')
        .eq('id', item.productId)
        .single();

      if (error || !product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 400 }
        );
      }

      // Check stock (skip for pre-orders)
      if (product.status !== 'coming_soon' && product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        );
      }

      // Use SERVER price (not client-submitted price)
      calculatedTotal += product.price * item.quantity;

      validatedItems.push({
        product_id: product.id,
        quantity: item.quantity,
        price: product.price, // ✅ Server-controlled price
      });
    }

    // ✅ STEP 2: SERVER-SIDE COUPON VALIDATION
    let discount = 0;
    if (coupon_code) {
      const { data: coupon } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', coupon_code.toUpperCase())
        .eq('is_active', true)
        .single();

      if (!coupon) {
        return NextResponse.json(
          { error: 'Invalid coupon code' },
          { status: 400 }
        );
      }

      // Check minimum order value
      if (coupon.min_order_value && calculatedTotal < coupon.min_order_value) {
        return NextResponse.json(
          { error: `Minimum order value is ₹${coupon.min_order_value}` },
          { status: 400 }
        );
      }

      // Calculate discount
      discount = Math.round((calculatedTotal * coupon.discount_percentage) / 100);
      
      // Apply max discount cap
      if (coupon.max_discount_amount && discount > coupon.max_discount_amount) {
        discount = coupon.max_discount_amount;
      }
    }

    const finalTotal = calculatedTotal - discount;

    // ✅ STEP 3: CALL DATABASE FUNCTION (ATOMIC TRANSACTION)
    const { data, error: procError } = await supabase.rpc('process_order', {
      p_user_id: user_id,
      p_guest_email: guest_email,
      p_total_amount: finalTotal,
      p_shipping_address: shipping_address,
      p_payment_method: payment_method,
      p_payment_proof_url: payment_proof_url,
      p_coupon_code: coupon_code,
      p_discount_applied: discount,
      p_items: validatedItems,
    });

    if (procError || !data[0]?.success) {
      throw new Error(data[0]?.error_message || 'Order processing failed');
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