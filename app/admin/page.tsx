'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DataContext } from '@/components/providers/DataProvider';
import { ADMIN_EMAIL } from '@/lib/config';
import toast from 'react-hot-toast';

import { AdminOverview } from './components/AdminOverview';
import { AdminOrders } from './components/AdminOrders';
import { AdminProducts } from './components/AdminProducts';
import { AdminCustomers } from './components/AdminCustomers';
import { AdminCoupons } from './components/AdminCoupons';

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  
  // Loading State
  const [loading, setLoading] = useState(true);

  // App States
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'customers'>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  
  // We use the Context for Products
  const dataCtx = useContext(DataContext);
  const products = dataCtx?.products || [];
  const refreshProducts = dataCtx?.refreshProducts || (() => {});

  // --- INITIAL DATA FETCHING ---
  useEffect(() => {
    const initData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.email !== ADMIN_EMAIL) {
          router.push('/'); 
          return;
        }

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`*, order_items (quantity, price_at_order, product_name_snapshot, products (name, images))`)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

        const { data: couponsData, error: couponsError } = await supabase
          .from('coupons')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (couponsError) throw couponsError;
        setCoupons(couponsData || []);

      } catch (error: any) {
        toast.error("Failed to load admin data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, [router, supabase]);

  const fetchCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (data) setCoupons(data);
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    const previousStatus = orders.find(o => o.id === orderId)?.status;
    // optimistic update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) {
      // revert on failure so the UI never shows a status that wasn't saved
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: previousStatus } : o));
      toast.error("Failed to update status");
    } else {
      toast.success(`Order marked as ${status}`);
    }
  };

  const downloadOrdersCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'Address', 'Total', 'Status', 'Items'];
    const rows = orders.map(o => {
      let parsedAddress: any = { phone: 'N/A', name: '', address: '' };
      try {
        parsedAddress = JSON.parse(o.shipping_address);
      } catch {
        const detailsStr = o.shipping_address || '';
        parsedAddress.phone = detailsStr.match(/Ph: (.*?),/)?.[1] || 'N/A';
        parsedAddress.name = detailsStr.split(',')[0] || '';
        parsedAddress.address = detailsStr;
      }
      
      const userEmail = o.guest_email || 'Registered User';
      const items = o.order_items.map((i: any) => `${i.product_name_snapshot} (x${i.quantity})`).join('; ');
      
      return [
        o.id,
        new Date(o.created_at).toLocaleDateString(),
        parsedAddress.name,
        userEmail,
        parsedAddress.phone,
        `"${parsedAddress.address.replace(/"/g, '""')}"`, 
        o.total_amount,
        o.status,
        `"${items.replace(/"/g, '""')}"`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `orders_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-brown" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pt-24 pb-20 px-4 sm:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-serif font-bold text-brand-text">Admin Dashboard</h1>
          <div className="flex bg-white dark:bg-brand-darkCream p-1 rounded-xl border border-brand-cream shadow-sm overflow-x-auto max-w-full">
            {['overview', 'orders', 'products', 'customers', 'coupons'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-brand-brown text-white' : 'text-brand-muted hover:text-brand-brown'}`}>{tab}</button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && <AdminOverview orders={orders} products={products} />}
        {activeTab === 'orders' && <AdminOrders orders={orders} setOrders={setOrders} updateOrderStatus={updateOrderStatus} downloadOrdersCSV={downloadOrdersCSV} />}
        {activeTab === 'products' && <AdminProducts products={products} refreshProducts={refreshProducts} />}
        {activeTab === 'customers' && <AdminCustomers orders={orders} />}
        {activeTab === 'coupons' && <AdminCoupons coupons={coupons} fetchCoupons={fetchCoupons} />}
      </div>
    </div>
  );
}