import React, { useState, useEffect } from 'react';
import { Search, Calendar, Download, Square, CheckSquare, Eye, ExternalLink, AlertTriangle, MapPin, CreditCard, X } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminOrdersProps {
  orders: any[];
  setOrders: React.Dispatch<React.SetStateAction<any[]>>;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  downloadOrdersCSV: () => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ orders, setOrders, updateOrderStatus, downloadOrdersCSV }) => {
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const supabase = createClient();

  // payment_proofs is a private bucket — generate a short-lived signed URL on demand.
  useEffect(() => {
    let active = true;
    const proof: string | undefined = selectedOrderDetails?.payment_proof_url;
    setProofUrl(null);
    if (!proof) return;
    const marker = '/payment_proofs/';
    const idx = proof.indexOf(marker);
    const path = idx >= 0 ? proof.slice(idx + marker.length) : proof;
    supabase.storage.from('payment_proofs').createSignedUrl(path, 3600).then(({ data }) => {
      if (active) setProofUrl(data?.signedUrl ?? null);
    });
    return () => { active = false; };
  }, [selectedOrderDetails]);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.includes(orderSearch) || o.shipping_address?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderFilter === 'All' || o.status === orderFilter;
    const matchesDate = dateFilter ? o.created_at.startsWith(dateFilter) : true;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const bulkUpdateStatus = async (status: string) => {
    if (!confirm(`Mark ${selectedOrders.length} orders as ${status}?`)) return;
    // For simplicity in the component, we loop updateOrderStatus, or we could pass a bulk update prop.
    // In a real scenario, passing bulk update is better. We'll do it sequentially here for the UI.
    for (const id of selectedOrders) {
      await updateOrderStatus(id, status);
    }
    setSelectedOrders([]);
  };

  return (
    <div className="space-y-4 animate-in fade-in">
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white dark:bg-brand-darkCream p-4 rounded-xl border border-brand-cream">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 text-brand-muted" size={18}/>
            <input value={orderSearch} onChange={e=>setOrderSearch(e.target.value)} placeholder="Search ID or Address..." className="w-full pl-10 p-2.5 bg-brand-light border border-brand-cream rounded-lg outline-none"/>
          </div>
          <div className="flex items-center gap-2 bg-brand-light border border-brand-cream rounded-lg px-3">
             <Calendar size={16} className="text-brand-muted"/>
             <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="bg-transparent outline-none text-sm py-2"/>
          </div>
          <select value={orderFilter} onChange={e=>setOrderFilter(e.target.value)} className="p-2.5 bg-brand-light border border-brand-cream rounded-lg outline-none cursor-pointer">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button onClick={downloadOrdersCSV} className="flex items-center gap-2 px-4 py-2 bg-brand-brown text-white rounded-lg text-sm font-bold hover:bg-brand-dark transition-colors whitespace-nowrap">
             <Download size={16}/> Export CSV
          </button>
        </div>
        {selectedOrders.length > 0 && (
          <div className="flex gap-2 items-center animate-in slide-in-from-right">
            <span className="text-sm font-bold text-brand-muted">{selectedOrders.length} selected</span>
            <button onClick={()=>bulkUpdateStatus('Shipped')} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">Mark Shipped</button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-brand-darkCream rounded-xl border border-brand-cream overflow-hidden overflow-x-auto">
         <table className="w-full text-left border-collapse min-w-[800px]">
           <thead className="bg-brand-light text-xs font-bold text-brand-muted uppercase">
             <tr>
               <th className="p-4 w-10"><Square size={16}/></th>
               <th className="p-4">Order ID</th>
               <th className="p-4">Customer</th>
               <th className="p-4">Date</th>
               <th className="p-4">Total</th>
               <th className="p-4">Status</th>
               <th className="p-4">Actions</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-brand-cream text-sm">
             {filteredOrders.map(order => (
               <tr key={order.id} className="hover:bg-brand-light transition-colors">
                 <td className="p-4">
                   <button onClick={()=>toggleSelectOrder(order.id)}>
                     {selectedOrders.includes(order.id) ? <CheckSquare className="text-brand-brown" size={18}/> : <Square className="text-brand-muted" size={18}/>}
                   </button>
                 </td>
                 <td className="p-4 font-mono text-brand-text">#{order.id.slice(0,8)}</td>
                 <td className="p-4 max-w-xs truncate" title={order.shipping_address}>
                     {order.guest_email ? `${order.guest_email} (Guest)` : (
                       (() => {
                         try { return JSON.parse(order.shipping_address).name; }
                         catch { return order.shipping_address?.split(',')[0]; }
                       })()
                     )}
                 </td>
                 <td className="p-4 text-brand-muted">{new Date(order.created_at).toLocaleDateString()}</td>
                 <td className="p-4 font-bold text-brand-brown">₹{order.total_amount}</td>
                 <td className="p-4">
                    <select 
                      value={order.status} 
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`px-2 py-1 rounded text-xs font-bold border-none outline-none cursor-pointer ${order.status==='Pending'?'bg-amber-100 text-amber-700':order.status==='Shipped'?'bg-blue-100 text-blue-700':order.status==='Delivered'?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                 </td>
                 <td className="p-4"><button onClick={()=>setSelectedOrderDetails(order)} className="text-brand-muted hover:text-brand-brown flex items-center gap-1"><Eye size={16}/> View</button></td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>

      {selectedOrderDetails && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-brand-darkCream rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-brand-cream flex justify-between items-center sticky top-0 bg-white dark:bg-brand-darkCream z-10">
              <h2 className="font-bold text-xl text-brand-text">Order #{selectedOrderDetails.id.slice(0,8)}</h2>
              <button onClick={()=>setSelectedOrderDetails(null)} className="p-1 hover:bg-brand-light rounded-full"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-brand-light p-4 rounded-xl border border-brand-cream">
                  <h4 className="font-bold text-brand-muted uppercase text-xs mb-3 flex items-center gap-2"><MapPin size={14}/> Shipping Address</h4>
                  {(() => {
                    try {
                      const addr = JSON.parse(selectedOrderDetails.shipping_address);
                      return (
                        <div className="text-base text-brand-text">
                          <p className="font-bold">{addr.name}</p>
                          <p>{addr.address}</p>
                          <p className="mt-2 text-sm">📞 {addr.phone}</p>
                          <p className="text-sm">✉️ {addr.email}</p>
                        </div>
                      );
                    } catch {
                      return <p className="font-bold text-brand-text whitespace-pre-line text-base">{selectedOrderDetails.shipping_address}</p>;
                    }
                  })()}
                </div>
                <div className="bg-brand-light p-4 rounded-xl border border-brand-cream">
                    <h4 className="font-bold text-brand-muted uppercase text-xs mb-3 flex items-center gap-2"><CreditCard size={14}/> Payment</h4>
                    <p className="font-bold text-brand-text">{selectedOrderDetails.payment_method}</p>
                    <p className="text-brand-muted text-xs mt-1">Date: {new Date(selectedOrderDetails.created_at).toLocaleString()}</p>
                    <div className="mt-3">
                         <label className="text-xs font-bold text-brand-muted uppercase">Status</label>
                         <select value={selectedOrderDetails.status} onChange={(e) => {
                            updateOrderStatus(selectedOrderDetails.id, e.target.value);
                            setSelectedOrderDetails({...selectedOrderDetails, status: e.target.value});
                         }}
                           className="w-full mt-1 px-2 py-1.5 rounded border border-brand-cream bg-white dark:bg-brand-darkCream text-xs font-bold uppercase cursor-pointer">
                            <option value="Pending">Pending</option><option value="Processing">Processing</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                         </select>
                    </div>
                </div>
              </div>
              
              {selectedOrderDetails.payment_method === 'UPI' && (
                <div className="bg-brand-light p-4 rounded-xl border border-brand-cream">
                  <h4 className="font-bold text-sm text-brand-text mb-3 flex items-center gap-2"><CheckSquare size={16}/> Payment Verification</h4>
                  {selectedOrderDetails.payment_proof_url ? (
                    proofUrl ? (
                      <div className="relative group rounded-lg overflow-hidden border border-brand-cream bg-white dark:bg-brand-darkCream max-w-sm mx-auto">
                           <img src={proofUrl} className="w-full h-auto object-contain max-h-80" alt="Proof" />
                           <a href={proofUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold gap-2"><ExternalLink size={18} /> View</a>
                      </div>
                    ) : <div className="text-brand-muted text-sm">Loading proof…</div>
                  ) : <div className="text-red-600 font-bold text-sm"><AlertTriangle size={16} className="inline"/> No Screenshot</div>}
                </div>
              )}
              
              <div className="border border-brand-cream rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-brand-light border-b border-brand-cream"><tr><th className="p-3">Product</th><th className="p-3">Qty</th><th className="p-3 text-right">Price</th></tr></thead>
                  <tbody className="divide-y divide-brand-cream">
                    {selectedOrderDetails.order_items?.map((item: any, i: number) => (
                      <tr key={i}>
                        <td className="p-3 flex items-center gap-3">
                           <img src={item.products?.images?.[0]} className="w-10 h-10 rounded bg-brand-light object-cover" alt="Item" />
                           <p className="font-medium text-brand-text">{item.product_name_snapshot || item.products?.name}</p>
                        </td>
                        <td className="p-3 text-brand-muted">x{item.quantity}</td>
                        <td className="p-3 text-right font-medium text-brand-brown">₹{item.price_at_order * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
