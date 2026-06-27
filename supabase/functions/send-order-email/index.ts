// FILE: supabase/functions/send-order-email/index.ts

// Deno built-in serve is used below
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import nodemailer from 'npm:nodemailer@6.9.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log('🚀 Function invoked (Gmail SMTP)');

    // 1. Load Secrets
    const SMTP_EMAIL = Deno.env.get('SMTP_EMAIL');
    const SMTP_PASSWORD = Deno.env.get('SMTP_PASSWORD');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!SMTP_EMAIL || !SMTP_PASSWORD) {
      throw new Error('Missing SMTP_EMAIL or SMTP_PASSWORD secrets');
    }

    // 2. Parse Payload
    const payload = await req.json();
    const { record } = payload;

    if (!record || !record.id) {
      throw new Error('No order ID in payload');
    }
    console.log('📦 Processing Order ID:', record.id);

    // 3. Fetch Order Details
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

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

    if (error || !order) {
      throw new Error(`Order fetch failed: ${error?.message}`);
    }

    // 4. Determine Recipient Email
    let recipientEmail = order.guest_email;

    // If no guest email, try to fetch from User Profile
    if (!recipientEmail && order.user_id) {
      const { data: userData } = await supabase.auth.admin.getUserById(order.user_id);
      recipientEmail = userData.user?.email;
    }

    if (!recipientEmail) {
      console.error('❌ No email found for this order. Skipping.');
      return new Response(JSON.stringify({ message: 'No email found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 5. Parse the shipping address (stored as JSON) into a clean block
    let addressHtml = String(order.shipping_address ?? '');
    let customerName = '';
    try {
      const a = JSON.parse(order.shipping_address);
      customerName = a.name || '';
      addressHtml = [
        a.name ? `<strong>${a.name}</strong>` : '',
        a.address || '',
        a.phone ? `📞 ${a.phone}` : '',
        a.email ? `✉️ ${a.email}` : '',
      ].filter(Boolean).join('<br/>');
    } catch (_e) {
      // shipping_address wasn't JSON — fall back to the raw string
    }

    // 6. Build HTML items table + totals
    const items = order.order_items || [];
    const subtotal = items.reduce(
      (sum: number, i: any) => sum + Number(i.price_at_order) * Number(i.quantity),
      0
    );
    const discount = Number(order.discount_applied || 0);

    const itemsHtml = items
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

    // 7. Configure Gmail Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SMTP_EMAIL,
        pass: SMTP_PASSWORD,
      },
    });

    // 8. Send Email
    console.log(`📧 Sending email to ${recipientEmail} from ${SMTP_EMAIL}...`);

    const info = await transporter.sendMail({
      from: `"Supr Mushrooms" <${SMTP_EMAIL}>`, // Sends as "Supr Mushrooms"
      to: recipientEmail,
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
            .totals { width: 100%; margin-top: 8px; }
            .totals td { padding: 4px 8px; }
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
              <h2>Thank you${customerName ? `, ${customerName}` : ''}!</h2>
              <p>Your order has been received and is now being processed.</p>
              <p><strong>Order ID:</strong> #${order.id.slice(0, 8).toUpperCase()}</p>
              <p><strong>Payment:</strong> ${order.payment_method}</p>
              <p><strong>Status:</strong> ${order.status}</p>

              <h3>Order Items:</h3>
              <table>
                <thead><tr><th>Product</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Price</th></tr></thead>
                <tbody>${itemsHtml}</tbody>
              </table>

              <table class="totals">
                <tr><td>Subtotal</td><td style="text-align:right;">₹${subtotal}</td></tr>
                ${discount > 0 ? `<tr><td style="color:#15803d;">Discount${order.coupon_code ? ` (${order.coupon_code})` : ''}</td><td style="text-align:right; color:#15803d;">-₹${discount}</td></tr>` : ''}
              </table>

              <div class="total">Total: ₹${order.total_amount}</div>

              <h3>Delivery To:</h3>
              <p>${addressHtml}</p>
            </div>
            <div class="footer">
              <p>📧 ${SMTP_EMAIL} | 📞 +91-8826986127</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Email sent successfully:', info.messageId);

    return new Response(
      JSON.stringify({ success: true, messageId: info.messageId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
