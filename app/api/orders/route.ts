import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json();
  const { items, shipping_address, payment_method, user_id, guest_email } = body;

  // 1. Validate Stock & Price on Server (Security)
  let totalCalculated = 0;
  
  for (const item of items) {
    const { data: product } = await supabase
      .from('products')
      .select('price, stock, name')
      .eq('id', item.productId)
      .single();

    if (!product) {
      return NextResponse.json({ error: `Product not found` }, { status: 400 });
    }

    if (product.stock < item.quantity) {
      return NextResponse.json({ error: `Not enough stock for ${product.name}` }, { status: 400 });
    }

    totalCalculated += product.price * item.quantity;
  }

  // 2. Create Order
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id,
      guest_email,
      total_amount: totalCalculated, // Use server-calculated total
      status: 'Pending',
      shipping_address,
      payment_method
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 3. Create Order Items
  const orderItemsData = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    price_at_order: item.product.price, // Snapshot price
    product_name_snapshot: item.product.name
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItemsData);

  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  return NextResponse.json({ success: true, orderId: order.id });
}