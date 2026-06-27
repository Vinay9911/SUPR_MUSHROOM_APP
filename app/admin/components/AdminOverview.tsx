import React from 'react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { IndianRupee, ShoppingBag, Clock, Users, TrendingUp, PackageCheck, AlertTriangle, Trophy } from 'lucide-react';

interface AdminOverviewProps {
  orders: any[];
  products?: any[];
}

const STATUS_STYLES: Record<string, string> = {
  Pending: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  Processing: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400',
  Shipped: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  Delivered: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  Cancelled: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
};

export const AdminOverview: React.FC<AdminOverviewProps> = ({ orders, products = [] }) => {
  const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

  const nonCancelled = orders.filter(o => o.status !== 'Cancelled');
  const totalRevenue = nonCancelled.reduce((a, o) => a + Number(o.total_amount || 0), 0);
  const realizedRevenue = orders.filter(o => o.status === 'Delivered').reduce((a, o) => a + Number(o.total_amount || 0), 0);
  const avgOrderValue = nonCancelled.length ? totalRevenue / nonCancelled.length : 0;
  const uniqueCustomers = new Set(orders.map(o => o.guest_email || o.user_id).filter(Boolean)).size;

  const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  const lowStock = products
    .filter((p: any) => !p.is_deleted && Number(p.stock) <= 5)
    .sort((a: any, b: any) => Number(a.stock) - Number(b.stock));

  // Top selling products (by quantity) from order items
  const productSales: Record<string, { name: string; qty: number; revenue: number }> = {};
  orders.forEach(o => {
    (o.order_items || []).forEach((it: any) => {
      const name = it.product_name_snapshot || it.products?.name || 'Unknown';
      if (!productSales[name]) productSales[name] = { name, qty: 0, revenue: 0 };
      productSales[name].qty += Number(it.quantity || 0);
      productSales[name].revenue += Number(it.price_at_order || 0) * Number(it.quantity || 0);
    });
  });
  const topProducts = Object.values(productSales).sort((a, b) => b.qty - a.qty).slice(0, 5);

  // Revenue for the last 6 months (robust even when there are no recent orders)
  const getMonthlyData = () => {
    const months: { name: string; sales: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleString('en-US', { month: 'short' });
      const sales = orders
        .filter(o => o.status !== 'Cancelled' && (o.created_at || '').startsWith(key))
        .reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
      months.push({ name: label, sales });
    }
    return months;
  };
  const monthlyData = getMonthlyData();
  const hasChartData = monthlyData.some(m => m.sales > 0);

  const Kpi = ({ icon: Icon, label, value, accent }: any) => (
    <div className="bg-white dark:bg-brand-darkCream p-5 rounded-2xl shadow-sm border border-brand-cream">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-brand-muted uppercase tracking-wide">{label}</p>
        <Icon size={18} className={accent} />
      </div>
      <p className="text-2xl md:text-3xl font-bold text-brand-text mt-2">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi icon={IndianRupee} label="Total Revenue" value={inr(totalRevenue)} accent="text-brand-brown" />
        <Kpi icon={PackageCheck} label="Realized (Delivered)" value={inr(realizedRevenue)} accent="text-emerald-500" />
        <Kpi icon={ShoppingBag} label="Total Orders" value={orders.length} accent="text-brand-brown" />
        <Kpi icon={TrendingUp} label="Avg Order Value" value={inr(avgOrderValue)} accent="text-blue-500" />
        <Kpi icon={Clock} label="Pending" value={statusCounts['Pending'] || 0} accent="text-amber-500" />
        <Kpi icon={Users} label="Unique Customers" value={uniqueCustomers} accent="text-blue-600" />
        <Kpi icon={AlertTriangle} label="Low Stock Items" value={lowStock.length} accent="text-red-500" />
        <Kpi icon={PackageCheck} label="Delivered Orders" value={statusCounts['Delivered'] || 0} accent="text-emerald-500" />
      </div>

      {/* Status breakdown */}
      <div className="bg-white dark:bg-brand-darkCream p-5 rounded-2xl shadow-sm border border-brand-cream">
        <p className="text-xs font-bold text-brand-muted uppercase mb-3">Order Status Breakdown</p>
        <div className="flex flex-wrap gap-2">
          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
            <span key={s} className={`px-3 py-1.5 rounded-full text-xs font-bold ${STATUS_STYLES[s]}`}>
              {s}: {statusCounts[s] || 0}
            </span>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-brand-darkCream p-6 rounded-2xl shadow-sm border border-brand-cream h-96">
        <h3 className="font-bold text-brand-text mb-4">Revenue — Last 6 Months</h3>
        {hasChartData ? (
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--brand-cream))" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} stroke="rgb(var(--brand-muted))" />
              <YAxis fontSize={11} tickLine={false} axisLine={false} stroke="rgb(var(--brand-muted))" tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000) + 'k' : v}`} />
              <Tooltip
                cursor={{ fill: 'rgb(var(--brand-cream) / 0.4)' }}
                formatter={(v: any) => [inr(Number(v)), 'Revenue']}
                contentStyle={{ borderRadius: '12px', border: '1px solid rgb(var(--brand-cream))', background: 'rgb(var(--bg-color))', color: 'rgb(var(--brand-text))' }}
              />
              <Bar dataKey="sales" fill="rgb(var(--brand-brown))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[85%] flex flex-col items-center justify-center text-center text-brand-muted">
            <TrendingUp size={36} className="mb-3 opacity-40" />
            <p className="font-medium">No sales recorded in the last 6 months.</p>
            <p className="text-sm">New orders will appear here automatically.</p>
          </div>
        )}
      </div>

      {/* Top products + Low stock */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-brand-darkCream p-6 rounded-2xl shadow-sm border border-brand-cream">
          <h3 className="font-bold text-brand-text mb-4 flex items-center gap-2"><Trophy size={18} className="text-brand-brown" /> Top Selling Products</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-brand-muted">No sales yet.</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-3 text-brand-text">
                    <span className="w-6 h-6 rounded-full bg-brand-light text-brand-brown font-bold grid place-items-center text-xs">{i + 1}</span>
                    {p.name}
                  </span>
                  <span className="text-brand-muted"><b className="text-brand-text">{p.qty}</b> sold · {inr(p.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-brand-darkCream p-6 rounded-2xl shadow-sm border border-brand-cream">
          <h3 className="font-bold text-brand-text mb-4 flex items-center gap-2"><AlertTriangle size={18} className="text-red-500" /> Low Stock Alerts</h3>
          {lowStock.length === 0 ? (
            <p className="text-sm text-brand-muted">All products are well stocked. ✅</p>
          ) : (
            <div className="space-y-3">
              {lowStock.slice(0, 6).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="text-brand-text">{p.name}</span>
                  <span className={`font-bold ${Number(p.stock) === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                    {Number(p.stock) === 0 ? 'Out of stock' : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
