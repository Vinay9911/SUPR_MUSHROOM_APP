import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    console.log('🚀 Function invoked');
    
    // Check if Resend API key exists
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not found in environment');
    }
    console.log('✅ Resend API key loaded');

    // Parse request
    const payload = await req.json();
    console.log('📦 Payload received:', JSON.stringify(payload, null, 2));
    
    const { record } = payload;
    if (!record || !record.id) {
      throw new Error('No order ID in payload');
    }
    console.log('✅ Order ID:', record.id);

    // Initialize Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Supabase client initialized');

    // Fetch order details
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price_at_order,
          product_name_snapshot
        )
      `)
      .eq('id', record.id)
      .single();

    if (error) {
      console.error('❌ Database error:', error);
      throw error;
    }
    console.log('✅ Order fetched:', order.id);

    // Get email
    let recipientEmail = order.guest_email;
    if (!recipientEmail && order.user_id) {
      const { data: userData } = await supabase.auth.admin.getUserById(order.user_id);
      recipientEmail = userData.user?.email;
    }

    if (!recipientEmail) {
      throw new Error('No email found for order');
    }
    console.log('✅ Recipient email:', recipientEmail);

    // Build email HTML
    const itemsHtml = (order.order_items || [])
      .map((item: any) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">
            ${item.product_name_snapshot || 'Product'}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">
            ₹${item.price_at_order * item.quantity}
          </td>
        </tr>
      `)
      .join('');

    // Send email
    console.log('📧 Sending email via Resend...');
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Supr Mushrooms <onboarding@resend.dev>',
        to: [recipientEmail],
        subject: `Order Confirmation #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #bc6c25; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { padding: 20px; background: #fefae0; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
              th { background: #faedcd; padding: 10px; text-align: left; }
              .total { font-size: 20px; font-weight: bold; color: #bc6c25; text-align: right; padding-top: 10px; }
              .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🍄 Supr Mushrooms</h1>
              </div>
              <div class="content">
                <h2>Thank you for your order!</h2>
                <p><strong>Order ID:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
                <p><strong>Payment:</strong> ${order.payment_method}</p>
                <p><strong>Status:</strong> ${order.status}</p>
                
                <h3>Order Items:</h3>
                <table>
                  <thead><tr><th>Product</th><th>Qty</th><th>Price</th></tr></thead>
                  <tbody>${itemsHtml}</tbody>
                </table>
                
                <div class="total">Total: ₹${order.total_amount}</div>
                
                <h3>Delivery To:</h3>
                <p>${order.shipping_address}</p>
              </div>
              <div class="footer">
                <p>📧 vinayaggarwal271@gmail.com | 📞 +91-8826986127</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });

    const emailResult = await emailRes.json();
    console.log('📧 Resend response:', JSON.stringify(emailResult, null, 2));

    if (!emailRes.ok) {
      throw new Error(`Resend error: ${JSON.stringify(emailResult)}`);
    }

    console.log('✅ Email sent successfully!');
    return new Response(
      JSON.stringify({ success: true, email: recipientEmail, orderId: order.id }),
      { headers: { 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Function error:', error.message);
    console.error('Stack trace:', error.stack);
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});