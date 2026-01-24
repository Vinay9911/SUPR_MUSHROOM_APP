// ===================================
// FILE 3: components/pages/UserOrdersPage.tsx (NEW FILE - CREATE THIS)
// ===================================

'use client';

import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface UserOrdersPageProps {
  orders: any[];
}

export const UserOrdersPage: React.FC<UserOrdersPageProps> = ({ orders }) => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const getStatusStep = (status: string) => {
    if (status === 'Delivered') return 3;
    if (status === 'Shipped') return 2;
    return 1;
  };

  return (
    <div className="min-h-screen bg-brand-light py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-text mb-8">Order History</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-lg border border-brand-cream">
             <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6 text-brand-brown">
                <Package size={40} />
             </div>
             <h3 className="text-xl font-bold text-brand-text mb-2">No orders yet</h3>
             <Link href="/" className="inline-flex items-center gap-2 bg-brand-brown text-white px-8 py-3 rounded-full font-bold hover:bg-brand-dark transition-colors mt-6">
                Start Shopping <ArrowRight size={18}/>
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => {
              const step = getStatusStep(order.status);
              const isExpanded = expandedOrder === order.id;
              return (
              <div key={order.id} className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all border border-brand-cream overflow-hidden">
                <div className="p-6 md:p-8 cursor-pointer" onClick={() => setExpandedOrder(isExpanded ? null : order.id)}>
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-6 gap-4">
                    <div>
                      <span className="font-mono text-xs text-brand-brown/60 font-bold block mb-1 tracking-wider">ORDER #{order.id.slice(0,8).toUpperCase()}</span>
                      <p className="font-serif font-bold text-3xl text-brand-text">₹{order.total_amount}</p>
                      <p className="text-xs text-brand-muted mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-left sm:text-right">
                       <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${step === 3 ? 'bg-green-100 text-green-700' : 'bg-brand-light text-brand-brown'}`}>
                         {order.status}
                       </span>
                    </div>
                  </div>

                  {/* Tracking Timeline */}
                  <div className="relative flex items-center justify-between mb-2 mt-4 px-2">
                     <div className="absolute left-0 top-1/2 w-full h-1 bg-brand-cream -z-0 rounded-full"></div>
                     <div className={`absolute left-0 top-1/2 h-1 bg-brand-brown -z-0 transition-all duration-1000 rounded-full`} style={{width: step === 1 ? '0%' : step === 2 ? '50%' : '100%'}}></div>
                     {[Clock, Truck, CheckCircle].map((Icon, i) => (
                       <div key={i} className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white transition-colors ${step >= i + 1 ? 'bg-brand-brown text-white' : 'bg-brand-cream text-brand-muted'}`}>
                          <Icon size={14}/>
                       </div>
                     ))}
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    {isExpanded ? <ChevronUp className="text-brand-muted"/> : <ChevronDown className="text-brand-muted"/>}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-brand-light border-t border-brand-cream p-6 md:p-8 animate-in slide-in-from-top-2">
                    <h4 className="font-bold text-sm uppercase text-brand-muted mb-4">Items in Order</h4>
                    <div className="space-y-4">
                      {order.order_items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-center bg-white p-3 rounded-xl border border-brand-cream">
                           <img src={item.products?.images?.[0]} className="w-12 h-12 rounded-lg object-cover bg-brand-light" alt="Product" />
                           <div className="flex-1">
                             <p className="font-bold text-brand-text text-sm">{item.product_name_snapshot || item.products?.name || "Product"}</p>
                             <p className="text-xs text-brand-muted">Qty: {item.quantity}</p>
                           </div>
                           <p className="font-bold text-brand-brown">₹{item.price_at_order * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-brand-cream/50 flex justify-between text-sm">
                       <span className="text-brand-muted">Payment Method</span>
                       <span className="font-bold">{order.payment_method}</span>
                    </div>
                    {order.coupon_code && (
                      <div className="mt-2 flex justify-between text-sm text-green-600">
                         <span>Coupon Applied</span>
                         <span className="font-bold">{order.coupon_code}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};