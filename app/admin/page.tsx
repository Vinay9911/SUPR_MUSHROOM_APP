'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Loader2, Edit2, Save, X, Eye, Search, Square, CheckSquare, Tag, 
  ExternalLink, AlertTriangle, Plus, Calendar, Users, Download, 
  MapPin, CreditCard, Trash2 
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip } from 'recharts';
import { createClient } from '@/lib/supabase/client'; // ✅ FIXED
import { DataContext } from '@/components/providers/DataProvider'; // ✅ FIXED
import { Product, ProductStatus } from '@/types';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  
  // Loading State
  const [loading, setLoading] = useState(true);

  // App States
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'coupons' | 'customers'>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  
  // We use the Context for Products (assuming DataContext is wrapped at layout level)
  const dataCtx = useContext(DataContext);
  const products = dataCtx?.products || [];
  const refreshProducts = dataCtx?.refreshProducts || (() => {});

  // Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  // Product Form
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ 
    name: '', desc: '', price: '', stock: '', weight: '', images: [] as string[], status: 'active' as ProductStatus 
  });
  const [uploading, setUploading] = useState(false);
  
  // Coupon Form
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponDiscount, setNewCouponDiscount] = useState('');
  const [minOrderVal, setMinOrderVal] = useState('');

  // --- INITIAL DATA FETCHING ---
  useEffect(() => {
    const initData = async () => {
      try {
        // 1. Check Auth
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth'); // Redirect if not logged in
          return;
        }

        // 2. Fetch Orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              quantity,
              price_at_order,
              product_name_snapshot, 
              products (name, images)
            )
          `)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

        // 3. Fetch Coupons
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

  // --- ANALYTICS FUNCTION ---
  const getRevenueData = () => {
    const days = 30;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dailySales = orders
        .filter(o => o.created_at.startsWith(dateStr))
        .reduce((sum, o) => sum + o.total_amount, 0);
      data.push({ name: dateStr.slice(5), sales: dailySales });
    }
    return data;
  };

  // --- ACTIONS (Copied from original logic) ---
  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  };
  
  const fetchCoupons = async () => {
    const { data } = await supabase.from('coupons').select('*').order('created_at', { ascending: false });
    if (data) setCoupons(data);
  };

  const downloadOrdersCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Email', 'Phone', 'Address', 'Total', 'Status', 'Items'];
    const rows = orders.map(o => {
      const details = o.shipping_address || ''; 
      const userEmail = o.guest_email || 'Registered User';
      const userPhone = details.match(/Ph: (.*?),/)?.[1] || 'N/A';
      const items = o.order_items.map((i: any) => `${i.product_name_snapshot} (x${i.quantity})`).join('; ');
      
      return [
        o.id,
        new Date(o.created_at).toLocaleDateString(),
        details.split(',')[0],
        userEmail,
        userPhone,
        `"${details.replace(/"/g, '""')}"`, 
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

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('No canvas context');
        const MAX_WIDTH = 1200;
        let width = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => { if (blob) resolve(blob); else reject('Compression failed'); }, 'image/jpeg', 0.8);
      };
      img.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const newImages: string[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const compressedBlob = await compressImage(file);
        const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' });
        const filePath = `prod_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
        const { error } = await supabase.storage.from('products').upload(filePath, compressedFile);
        if (error) throw error;
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        newImages.push(data.publicUrl);
      }
      setProductForm(prev => ({ ...prev, images: [...prev.images, ...newImages] }));
      toast.success(`${newImages.length} images optimized & uploaded`);
    } catch (error: any) { toast.error("Upload failed: " + error.message); } 
    finally { setUploading(false); }
  };

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setProductForm({ 
        name: p.name, desc: p.description, price: p.price.toString(), stock: p.stock.toString(), weight: p.weight, images: p.images, status: p.status 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (productForm.images.length === 0) throw new Error("At least one image is required");
      
      const payload = {
        name: productForm.name,
        description: productForm.desc,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
        weight: productForm.weight,
        images: productForm.images,
        status: productForm.status,
      };

      if (editingProduct) {
        await supabase.from('products').update(payload).eq('id', editingProduct.id);
        toast.success("Product Updated");
      } else {
        await supabase.from('products').insert({ 
            ...payload, 
            farming_method: 'Modern Farming', 
            slug: productForm.name.toLowerCase().replace(/ /g, '-'), 
            is_deleted: false 
        });
        toast.success("Product Created");
      }
      setEditingProduct(null);
      setProductForm({ name: '', desc: '', price: '', stock: '', weight: '', images: [], status: 'active' });
      refreshProducts();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleSoftDelete = async (id: string) => {
    if (!confirm("Delete this product? It will remain in past orders.")) return;
    const { error } = await supabase.from('products').update({ is_deleted: true, status: 'hidden' }).eq('id', id);
    if (error) toast.error("Failed"); else { toast.success("Deleted"); refreshProducts(); }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.includes(orderSearch) || o.shipping_address?.toLowerCase().includes(orderSearch.toLowerCase());
    const matchesStatus = orderFilter === 'All' || o.status === orderFilter;
    const matchesDate = dateFilter ? o.created_at.startsWith(dateFilter) : true;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const updateOrderStatus = async (orderId: string, status: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    if (selectedOrderDetails?.id === orderId) {
       setSelectedOrderDetails((prev: any) => ({ ...prev, status }));
    }
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) toast.error("Failed to update status");
    else toast.success(`Order marked as ${status}`);
  };

  const toggleSelectOrder = (id: string) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const bulkUpdateStatus = async (status: string) => {
    if (!confirm(`Mark ${selectedOrders.length} orders as ${status}?`)) return;
    const { error } = await supabase.from('orders').update({ status }).in('id', selectedOrders);
    if (error) toast.error("Failed");
    else { toast.success("Updated"); setOrders(prev => prev.map(o => selectedOrders.includes(o.id) ? {...o, status} : o)); setSelectedOrders([]); }
  };

  // --- RENDER ---
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
          <div className="flex bg-white p-1 rounded-xl border border-brand-cream shadow-sm overflow-x-auto max-w-full">
            {['overview', 'orders', 'products', 'customers', 'coupons'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-4 py-2 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-brand-brown text-white' : 'text-brand-muted hover:text-brand-brown'}`}>{tab}</button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-cream">
                <p className="text-xs font-bold text-brand-muted uppercase">Total Revenue</p>
                <p className="text-3xl font-bold text-brand-brown mt-2">₹{orders.reduce((a,c) => a + c.total_amount, 0).toLocaleString()}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-cream">
                <p className="text-xs font-bold text-brand-muted uppercase">Total Orders</p>
                <p className="text-3xl font-bold text-brand-text mt-2">{orders.length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-cream">
                <p className="text-xs font-bold text-brand-muted uppercase">Pending</p>
                <p className="text-3xl font-bold text-amber-500 mt-2">{orders.filter(o=>o.status==='Pending').length}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-cream">
                <p className="text-xs font-bold text-brand-muted uppercase">Unique Customers</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{new Set(orders.map(o=>o.guest_email || o.user_id).filter(Boolean)).size}</p>
              </div>
            </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-cream h-96">
               <h3 className="font-bold text-brand-text mb-4">Sales Analytics (30 Days)</h3>
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={getRevenueData()}>
                   <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                   <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border:'none', boxShadow:'0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                   <Bar dataKey="sales" fill="#5D4037" radius={[4, 4, 0, 0]} />
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4 animate-in fade-in">
             <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-xl border border-brand-cream">
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
                   <option value="Shipped">Shipped</option>
                   <option value="Delivered">Delivered</option>
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

             <div className="bg-white rounded-xl border border-brand-cream overflow-hidden overflow-x-auto">
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
                            {order.guest_email ? `${order.guest_email} (Guest)` : order.shipping_address?.split(',')[0]}
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
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="bg-white rounded-xl border border-brand-cream overflow-hidden animate-in fade-in">
             <div className="p-6 border-b border-brand-cream">
               <h2 className="font-bold text-xl flex items-center gap-2"><Users className="text-brand-brown"/> Customer Database</h2>
             </div>
             <table className="w-full text-left">
               <thead className="bg-brand-light text-xs font-bold text-brand-muted uppercase">
                 <tr><th className="p-4">User ID / Email</th><th className="p-4">Total Orders</th><th className="p-4">Total Spent</th><th className="p-4">Last Order</th></tr>
               </thead>
               <tbody className="divide-y divide-brand-cream text-sm">
                 {Object.values(orders.reduce((acc: any, order) => {
                   const key = order.guest_email || order.user_id;
                   if(!key) return acc;
                   if(!acc[key]) acc[key] = { id: key, count: 0, spent: 0, last: order.created_at };
                   acc[key].count++;
                   acc[key].spent += order.total_amount;
                   if(new Date(order.created_at) > new Date(acc[key].last)) acc[key].last = order.created_at;
                   return acc;
                 }, {})).map((cust: any) => (
                   <tr key={cust.id} className="hover:bg-brand-light">
                     <td className="p-4 font-mono">{cust.id}</td>
                     <td className="p-4 font-bold">{cust.count}</td>
                     <td className="p-4 text-brand-brown font-bold">₹{cust.spent}</td>
                     <td className="p-4 text-brand-muted">{new Date(cust.last).toLocaleDateString()}</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in">
            <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-brand-cream h-fit sticky top-24">
              <h2 className="font-bold text-xl mb-4 text-brand-text">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSaveProduct} className="space-y-4">
                <input required placeholder="Name" value={productForm.name} onChange={e=>setProductForm({...productForm, name: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl focus:border-brand-brown outline-none" />
                <textarea required placeholder="Description" value={productForm.desc} onChange={e=>setProductForm({...productForm, desc: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl h-24 focus:border-brand-brown outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" placeholder="Price (₹)" value={productForm.price} onChange={e=>setProductForm({...productForm, price: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl focus:border-brand-brown outline-none" />
                  <input required type="number" placeholder="Stock" value={productForm.stock} onChange={e=>setProductForm({...productForm, stock: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl focus:border-brand-brown outline-none" />
                </div>
                <input required placeholder="Weight (e.g., 200g)" value={productForm.weight} onChange={e=>setProductForm({...productForm, weight: e.target.value})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl focus:border-brand-brown outline-none" />
                <select value={productForm.status} onChange={(e) => setProductForm({...productForm, status: e.target.value as ProductStatus})} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl focus:border-brand-brown outline-none">
                  <option value="active">Active</option>
                  <option value="hidden">Hidden</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
                
                <div>
                   <label className="text-xs font-bold text-brand-muted uppercase mb-2 block">Images</label>
                   <div className="grid grid-cols-3 gap-2 mb-2">
                     {productForm.images.map((img, i) => (
                       <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-brand-cream">
                         <img src={img} className="w-full h-full object-cover" alt="Product" />
                         <button type="button" onClick={()=>setProductForm(prev=>({...prev, images: prev.images.filter((_,idx)=>idx!==i)}))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                       </div>
                     ))}
                     <label className="border-2 border-dashed border-brand-cream rounded-lg flex items-center justify-center cursor-pointer hover:bg-brand-light aspect-square transition-colors">
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                        {uploading ? <Loader2 className="animate-spin text-brand-brown"/> : <Plus size={24} className="text-brand-muted"/>}
                     </label>
                   </div>
                </div>

                <div className="flex gap-2">
                  <button type="submit" disabled={uploading} className="flex-1 bg-brand-brown text-white font-bold py-3 rounded-xl hover:bg-brand-dark flex items-center justify-center gap-2"><Save size={16}/> Save</button>
                  {editingProduct && <button type="button" onClick={()=>{setEditingProduct(null); setProductForm({name:'',desc:'',price:'',stock:'', weight:'',images:[], status:'active'})}} className="bg-brand-light p-3 rounded-xl hover:bg-brand-cream"><X size={20}/></button>}
                </div>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {products.filter(p=>!p.is_deleted).map(p => (
                <div key={p.id} className={`bg-white p-4 rounded-xl border border-brand-cream flex gap-4 ${p.status === 'hidden' ? 'opacity-60 grayscale' : ''}`}>
                  <img src={p.images[0]} className="w-20 h-20 object-cover rounded-lg bg-brand-light" alt={p.name} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-brand-text">{p.name}</h4>
                      <div className="flex items-center gap-2">
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${p.status==='active'?'bg-green-100 text-green-700':'bg-slate-100 text-slate-600'}`}>{p.status.replace('_',' ')}</span>
                         <button onClick={() => startEdit(p)} className="p-1.5 hover:bg-brand-light rounded-lg"><Edit2 size={16} className="text-brand-muted"/></button>
                      </div>
                    </div>
                    <div className="flex gap-6 mt-2 text-sm text-brand-muted">
                      <span>Stock: <b className={p.stock<5?'text-red-500':''}>{p.stock}</b></span>
                      <span>Price: <b className="text-brand-brown">₹{p.price}</b></span>
                    </div>
                    <div className="mt-2 text-right">
                       <button onClick={()=>handleSoftDelete(p.id)} className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center justify-end gap-1"><Trash2 size={12}/> Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'coupons' && (
           <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-brand-cream flex gap-4 items-end flex-wrap">
               <div className="flex-1 min-w-[150px]">
                 <label className="text-xs font-bold text-brand-muted uppercase">Code</label>
                 <input value={newCouponCode} onChange={e=>setNewCouponCode(e.target.value)} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl mt-1 uppercase focus:border-brand-brown outline-none" placeholder="SUMMER2026" />
               </div>
               <div className="w-24">
                  <label className="text-xs font-bold text-brand-muted uppercase">Disc %</label>
                  <input type="number" value={newCouponDiscount} onChange={e=>setNewCouponDiscount(e.target.value)} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl mt-1 focus:border-brand-brown outline-none" placeholder="10" />
               </div>
               <div className="w-32">
                  <label className="text-xs font-bold text-brand-muted uppercase">Min Order</label>
                  <input type="number" value={minOrderVal} onChange={e=>setMinOrderVal(e.target.value)} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl mt-1 focus:border-brand-brown outline-none" placeholder="Optional" />
               </div>
               <button onClick={async (e) => {
                  e.preventDefault();
                  if (!newCouponCode || !newCouponDiscount) return toast.error("Fill Code & Discount");
                  const {error} = await supabase.from('coupons').insert({
                    code: newCouponCode.toUpperCase(), 
                    discount_percentage: parseInt(newCouponDiscount),
                    min_order_value: minOrderVal ? parseInt(minOrderVal) : 0,
                    is_active: true
                  });
                  if(error) toast.error("Error: " + error.message); 
                  else { toast.success("Added"); fetchCoupons(); setNewCouponCode(''); setNewCouponDiscount(''); setMinOrderVal(''); }
               }} className="bg-brand-brown text-white px-6 py-3 rounded-xl font-bold h-[52px] hover:bg-brand-dark transition-colors">Add</button>
             </div>
             
             <div className="bg-white rounded-2xl border border-brand-cream overflow-hidden">
                {coupons.map(c => (
                  <div key={c.id} className="flex justify-between items-center p-4 border-b border-brand-cream last:border-0 hover:bg-brand-light">
                    <div className="flex items-center gap-4">
                      <Tag className="text-brand-muted" size={20}/>
                      <div>
                        <p className="font-bold text-brand-text font-mono">{c.code}</p>
                        <p className="text-xs text-brand-muted">Min Order: ₹{c.min_order_value || 0} • Used {c.usage_count || 0}x</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold">{c.discount_percentage}% OFF</span>
                      <button onClick={async () => {
                         if(confirm('Delete coupon?')) { await supabase.from('coupons').delete().eq('id', c.id); fetchCoupons(); }
                      }}><X size={16} className="text-brand-muted hover:text-red-500"/></button>
                    </div>
                  </div>
                ))}
             </div>
           </div>
        )}
      </div>

      {selectedOrderDetails && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-brand-cream flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="font-bold text-xl text-brand-text">Order #{selectedOrderDetails.id.slice(0,8)}</h2>
              <button onClick={()=>setSelectedOrderDetails(null)} className="p-1 hover:bg-brand-light rounded-full"><X size={20}/></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="bg-brand-light p-4 rounded-xl border border-brand-cream">
                  <h4 className="font-bold text-brand-muted uppercase text-xs mb-3 flex items-center gap-2"><MapPin size={14}/> Shipping Address</h4>
                  <p className="font-bold text-brand-text whitespace-pre-line text-base">{selectedOrderDetails.shipping_address}</p>
                </div>
                <div className="bg-brand-light p-4 rounded-xl border border-brand-cream">
                    <h4 className="font-bold text-brand-muted uppercase text-xs mb-3 flex items-center gap-2"><CreditCard size={14}/> Payment</h4>
                    <p className="font-bold text-brand-text">{selectedOrderDetails.payment_method}</p>
                    <p className="text-brand-muted text-xs mt-1">Date: {new Date(selectedOrderDetails.created_at).toLocaleString()}</p>
                    <div className="mt-3">
                         <label className="text-xs font-bold text-brand-muted uppercase">Status</label>
                         <select value={selectedOrderDetails.status} onChange={(e) => updateOrderStatus(selectedOrderDetails.id, e.target.value)}
                           className="w-full mt-1 px-2 py-1.5 rounded border border-brand-cream bg-white text-xs font-bold uppercase cursor-pointer">
                            <option value="Pending">Pending</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                         </select>
                    </div>
                </div>
              </div>
              
              {selectedOrderDetails.payment_method === 'UPI' && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-sm text-slate-700 mb-3 flex items-center gap-2"><CheckSquare size={16}/> Payment Verification</h4>
                  {selectedOrderDetails.payment_proof_url ? (
                    <div className="relative group rounded-lg overflow-hidden border border-slate-300 bg-white max-w-sm mx-auto">
                         <img src={selectedOrderDetails.payment_proof_url} className="w-full h-auto object-contain max-h-80" alt="Proof" />
                         <a href={selectedOrderDetails.payment_proof_url} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white font-bold gap-2"><ExternalLink size={18} /> View</a>
                    </div>
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
}