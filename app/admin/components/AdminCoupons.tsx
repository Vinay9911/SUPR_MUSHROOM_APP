import React, { useState } from 'react';
import { Tag, X, Power } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface AdminCouponsProps {
  coupons: any[];
  fetchCoupons: () => Promise<void>;
}

export const AdminCoupons: React.FC<AdminCouponsProps> = ({ coupons, fetchCoupons }) => {
  const supabase = createClient();
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [minOrder, setMinOrder] = useState('');
  const [maxDiscount, setMaxDiscount] = useState('');

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!code || !discount) return toast.error('Fill Code & Discount');
    const pct = parseInt(discount);
    if (isNaN(pct) || pct < 1 || pct > 100) return toast.error('Discount must be 1–100%');

    const { error } = await supabase.from('coupons').insert({
      code: code.toUpperCase().trim(),
      discount_percentage: pct,
      min_order_value: minOrder ? parseInt(minOrder) : 0,
      max_discount_amount: maxDiscount ? parseInt(maxDiscount) : null,
      is_active: true,
    });
    if (error) toast.error('Error: ' + error.message);
    else {
      toast.success('Coupon added');
      fetchCoupons();
      setCode(''); setDiscount(''); setMinOrder(''); setMaxDiscount('');
    }
  };

  const toggleActive = async (c: any) => {
    const { error } = await supabase.from('coupons').update({ is_active: !c.is_active }).eq('id', c.id);
    if (error) toast.error('Failed to update'); else fetchCoupons();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete coupon?')) return;
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (error) toast.error('Failed to delete'); else fetchCoupons();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in">
      {/* Create */}
      <div className="bg-white dark:bg-brand-darkCream p-6 rounded-2xl shadow-sm border border-brand-cream">
        <h2 className="font-bold text-lg text-brand-text mb-4">Create Coupon</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase">Code</label>
            <input value={code} onChange={e => setCode(e.target.value)} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl mt-1 uppercase focus:border-brand-brown outline-none" placeholder="SUMMER25" />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase">Disc %</label>
            <input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl mt-1 focus:border-brand-brown outline-none" placeholder="10" />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase">Min Order ₹</label>
            <input type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl mt-1 focus:border-brand-brown outline-none" placeholder="0" />
          </div>
          <div>
            <label className="text-xs font-bold text-brand-muted uppercase">Max ₹ Off</label>
            <input type="number" value={maxDiscount} onChange={e => setMaxDiscount(e.target.value)} className="w-full p-3 bg-brand-light border border-brand-cream rounded-xl mt-1 focus:border-brand-brown outline-none" placeholder="Cap (opt)" />
          </div>
        </div>
        <button onClick={handleAdd} className="mt-4 bg-brand-brown text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-dark transition-colors">Add Coupon</button>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-brand-darkCream rounded-2xl border border-brand-cream overflow-hidden">
        {coupons.length === 0 && <p className="p-6 text-sm text-brand-muted">No coupons yet.</p>}
        {coupons.map(c => (
          <div key={c.id} className="flex flex-wrap justify-between items-center gap-3 p-4 border-b border-brand-cream last:border-0 hover:bg-brand-light">
            <div className="flex items-center gap-4">
              <Tag className={c.is_active ? 'text-brand-brown' : 'text-brand-muted'} size={20} />
              <div>
                <p className="font-bold text-brand-text font-mono flex items-center gap-2">
                  {c.code}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${c.is_active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-gray-200 text-gray-500 dark:bg-white/10 dark:text-brand-muted'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </p>
                <p className="text-xs text-brand-muted">
                  Min ₹{c.min_order_value || 0}
                  {c.max_discount_amount ? ` • Max ₹${c.max_discount_amount} off` : ''} • Used {c.usage_count || 0}×
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-bold">{c.discount_percentage}% OFF</span>
              <button onClick={() => toggleActive(c)} title={c.is_active ? 'Deactivate' : 'Activate'} className="p-2 rounded-lg hover:bg-brand-cream text-brand-muted hover:text-brand-brown transition-colors"><Power size={16} /></button>
              <button onClick={() => handleDelete(c.id)} title="Delete" className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><X size={16} className="text-brand-muted hover:text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
