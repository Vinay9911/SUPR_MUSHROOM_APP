import React from 'react';
import { Users } from 'lucide-react';

interface AdminCustomersProps {
  orders: any[];
}

export const AdminCustomers: React.FC<AdminCustomersProps> = ({ orders }) => {
  const parseAddr = (raw: string) => {
    try { return JSON.parse(raw); } catch { return null; }
  };

  const customers = (Object.values(orders.reduce((acc: any, order) => {
    const key = order.guest_email || order.user_id;
    if (!key) return acc;
    const addr = parseAddr(order.shipping_address);
    if (!acc[key]) {
      acc[key] = {
        id: key,
        name: addr?.name || '—',
        email: order.guest_email || addr?.email || 'Registered user',
        phone: addr?.phone || '—',
        count: 0,
        spent: 0,
        last: order.created_at,
        isGuest: !!order.guest_email,
      };
    }
    acc[key].count++;
    acc[key].spent += Number(order.total_amount || 0);
    if (addr?.name && acc[key].name === '—') acc[key].name = addr.name;
    if (new Date(order.created_at) > new Date(acc[key].last)) acc[key].last = order.created_at;
    return acc;
  }, {})) as any[]).sort((a, b) => b.spent - a.spent);

  return (
    <div className="bg-white dark:bg-brand-darkCream rounded-xl border border-brand-cream overflow-hidden animate-in fade-in">
      <div className="p-6 border-b border-brand-cream flex items-center justify-between">
        <h2 className="font-bold text-xl flex items-center gap-2 text-brand-text"><Users className="text-brand-brown" /> Customer Database</h2>
        <span className="text-sm text-brand-muted">{customers.length} customers</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[640px]">
          <thead className="bg-brand-light text-xs font-bold text-brand-muted uppercase">
            <tr>
              <th className="p-4">Customer</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4">Last Order</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-cream text-sm">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-brand-light">
                <td className="p-4">
                  <p className="font-bold text-brand-text">{c.name}</p>
                  <span className="text-[10px] text-brand-muted uppercase tracking-wide">{c.isGuest ? 'Guest' : 'Registered'}</span>
                </td>
                <td className="p-4 text-brand-muted">
                  <p className="break-all">{c.email}</p>
                  {c.phone !== '—' && <p className="text-xs">📞 {c.phone}</p>}
                </td>
                <td className="p-4 font-bold text-brand-text">{c.count}</td>
                <td className="p-4 text-brand-brown font-bold">₹{Math.round(c.spent).toLocaleString('en-IN')}</td>
                <td className="p-4 text-brand-muted">{new Date(c.last).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
