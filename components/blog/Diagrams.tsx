import React from 'react';
import {
  Sprout, ShieldCheck, Snowflake, Truck, Home, ChevronRight,
  Droplets, Layers, Thermometer, ShoppingCart, CreditCard, CheckCircle2,
  Mail, Search, Check, X,
} from 'lucide-react';

/* ---------- shared bits ---------- */

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-brand-darkCream border border-brand-cream rounded-2xl ${className}`}>{children}</div>
);

function FlowSteps({ steps }: { steps: { icon: any; title: string; desc: string }[] }) {
  return (
    <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-1">
      {steps.map((s, i) => (
        <React.Fragment key={i}>
          <Card className="flex-1 min-w-0 p-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-brand-brown/10 text-brand-brown grid place-items-center mb-2">
              <s.icon size={22} />
            </div>
            <div className="text-[10px] font-bold text-brand-muted tracking-widest">STEP {i + 1}</div>
            <div className="font-bold text-brand-text text-sm mt-1 leading-tight">{s.title}</div>
            <div className="text-xs text-brand-muted mt-1 leading-snug">{s.desc}</div>
          </Card>
          {i < steps.length - 1 && (
            <div className="hidden md:flex items-center justify-center text-brand-brown/50 shrink-0">
              <ChevronRight size={22} />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ---------- diagrams ---------- */

function FarmToDoor() {
  return (
    <FlowSteps
      steps={[
        { icon: Sprout, title: 'Harvested', desc: 'Picked at peak freshness' },
        { icon: ShieldCheck, title: 'Quality Check', desc: 'Sorted & inspected' },
        { icon: Snowflake, title: 'Cold Packed', desc: 'Sealed to lock freshness' },
        { icon: Truck, title: 'Dispatched', desc: 'Same-day across NCR' },
        { icon: Home, title: 'Delivered', desc: 'At your door in 24h' },
      ]}
    />
  );
}

function PlatformFlow() {
  return (
    <FlowSteps
      steps={[
        { icon: Search, title: 'Browse', desc: 'Explore fresh varieties' },
        { icon: ShoppingCart, title: 'Add to Cart', desc: 'Pick your quantity' },
        { icon: CreditCard, title: 'Checkout', desc: 'COD or UPI' },
        { icon: CheckCircle2, title: 'Confirmed', desc: 'Order placed securely' },
        { icon: Mail, title: 'Email + Deliver', desc: 'Confirmation + 24h delivery' },
      ]}
    />
  );
}

function HowToOrder() {
  const steps = [
    'Browse the Shop and open any mushroom you like.',
    'Choose a quantity and tap “Add to Cart”.',
    'Open the cart, then checkout with Cash on Delivery or UPI.',
    'Get an instant email confirmation — fresh delivery within 24 hours.',
  ];
  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <Card key={i} className="flex items-center gap-4 p-4">
          <span className="w-9 h-9 shrink-0 rounded-full bg-brand-brown text-white grid place-items-center font-bold">{i + 1}</span>
          <span className="text-brand-text text-sm">{s}</span>
        </Card>
      ))}
    </div>
  );
}

function Aeroponic() {
  const cols = [
    { icon: Droplets, title: 'Misted Roots', desc: 'Roots are fed a fine nutrient mist — no soil, so no heavy metals or pests.' },
    { icon: Layers, title: 'Vertical Stacks', desc: 'Crops grow in stacked layers, producing far more per square foot.' },
    { icon: Thermometer, title: 'Climate Controlled', desc: 'Temperature, humidity and air are tuned for clean, year-round growth.' },
  ];
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      {cols.map((c, i) => (
        <Card key={i} className="p-5">
          <div className="w-12 h-12 rounded-xl bg-brand-green/15 text-brand-green grid place-items-center mb-3"><c.icon size={22} /></div>
          <div className="font-bold text-brand-text">{c.title}</div>
          <p className="text-sm text-brand-muted mt-1 leading-relaxed">{c.desc}</p>
        </Card>
      ))}
    </div>
  );
}

function NutritionChart() {
  // per 100 g of oyster mushrooms (illustrative bar widths)
  const rows = [
    { label: 'Calories', value: '33 kcal', pct: 18, note: 'very low' },
    { label: 'Protein', value: '3 g', pct: 55 },
    { label: 'Dietary fibre', value: '2.3 g', pct: 42 },
    { label: 'Vitamin D', value: '~7% DV', pct: 35 },
    { label: 'Antioxidants', value: 'High', pct: 80, note: 'phenolics & flavonoids' },
  ];
  return (
    <Card className="p-6">
      <div className="text-xs font-bold text-brand-muted uppercase tracking-wide mb-4">Oyster mushrooms — per 100 g</div>
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-brand-text font-medium">{r.label}{r.note ? <span className="text-brand-muted font-normal"> · {r.note}</span> : ''}</span>
              <span className="text-brand-brown font-bold">{r.value}</span>
            </div>
            <div className="h-2.5 rounded-full bg-brand-cream overflow-hidden">
              <div className="h-full rounded-full bg-brand-brown" style={{ width: `${r.pct}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StorageGuide() {
  const dos = ['Use a paper bag with a paper towel inside', 'Store on the bottom shelf of the fridge', 'Keep them dry until you cook', 'Cook within 7–10 days'];
  const donts = ['Seal them in plastic (traps moisture)', 'Wash before storing (makes them slimy)', 'Use the humid crisper drawer', 'Pile them in a deep airtight box'];
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/10 p-5">
        <div className="font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2"><Check size={18} /> Do</div>
        <ul className="space-y-2">
          {dos.map((d) => <li key={d} className="flex gap-2 text-sm text-brand-text"><Check size={16} className="text-emerald-600 mt-0.5 shrink-0" />{d}</li>)}
        </ul>
      </div>
      <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 p-5">
        <div className="font-bold text-red-700 dark:text-red-400 mb-3 flex items-center gap-2"><X size={18} /> Don’t</div>
        <ul className="space-y-2">
          {donts.map((d) => <li key={d} className="flex gap-2 text-sm text-brand-text"><X size={16} className="text-red-500 mt-0.5 shrink-0" />{d}</li>)}
        </ul>
      </div>
    </div>
  );
}

function MushroomTypes() {
  const types = [
    { name: 'Button', flavour: 'Mild', best: 'Everyday cooking, salads, curries' },
    { name: 'Cremini', flavour: 'Earthy, savoury', best: 'Stews, soups, pasta' },
    { name: 'Oyster', flavour: 'Delicate, umami', best: 'Stir-fries, soups' },
    { name: 'King Oyster', flavour: 'Meaty, mild', best: 'Grilling, roasting, “steaks”' },
  ];
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {types.map((t) => (
        <Card key={t.name} className="p-5">
          <div className="font-bold text-brand-brown text-lg">{t.name}</div>
          <div className="text-xs text-brand-muted mt-2 uppercase tracking-wide">Flavour</div>
          <div className="text-sm text-brand-text">{t.flavour}</div>
          <div className="text-xs text-brand-muted mt-2 uppercase tracking-wide">Best for</div>
          <div className="text-sm text-brand-text">{t.best}</div>
        </Card>
      ))}
    </div>
  );
}

/* ---------- dispatcher ---------- */

export function BlogDiagram({ name }: { name: string }) {
  switch (name) {
    case 'farm-to-door': return <FarmToDoor />;
    case 'platform-flow': return <PlatformFlow />;
    case 'how-to-order': return <HowToOrder />;
    case 'aeroponic': return <Aeroponic />;
    case 'nutrition': return <NutritionChart />;
    case 'storage': return <StorageGuide />;
    case 'mushroom-types': return <MushroomTypes />;
    default: return null;
  }
}
