import React from 'react';

export const DeliveryAreas = () => {
  return (
    <section className="py-16 bg-white dark:bg-bg-color">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">Fresh Mushroom Delivery Across Delhi NCR</h2>
        <p className="text-center text-brand-muted mb-12 max-w-2xl mx-auto">We deliver premium organic mushrooms to homes, restaurants, and wholesalers across the National Capital Region</p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { city: 'Delhi', desc: 'Fresh mushroom delivery across all Delhi areas' },
            { city: 'Noida', desc: 'Same-day mushroom delivery in Noida & Greater Noida' },
            { city: 'Gurugram', desc: 'Premium mushrooms delivered to Gurugram (Gurgaon)' },
            { city: 'Ghaziabad', desc: 'Organic mushrooms delivered fresh in Ghaziabad' },
            { city: 'Faridabad', desc: 'Farm-fresh mushroom delivery in Faridabad' }
          ].map((area, idx) => (
            <div key={idx} className="text-center p-6 bg-brand-light rounded-2xl border border-brand-cream hover:shadow-lg transition-all">
              <h3 className="font-bold text-xl text-brand-brown mb-2">{area.city}</h3>
              <p className="text-sm text-brand-muted">{area.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
