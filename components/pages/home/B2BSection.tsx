import React from 'react';
import { Phone } from 'lucide-react';

export const B2BSection = () => {
  return (
    <section className="py-16 bg-brand-cream/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white dark:bg-bg-color rounded-3xl p-8 md:p-12 shadow-xl border border-brand-cream dark:border-brand-cream/20">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-4">Wholesale Mushroom Supplier for Restaurants & Hotels in Delhi NCR</h2>
          <p className="text-center text-brand-muted mb-8 max-w-3xl mx-auto">
            Premium bulk supply of fresh organic mushrooms to restaurants, hotels, cloud kitchens, and catering services across Delhi NCR. Competitive wholesale pricing, consistent quality, and reliable daily delivery.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-brand-light rounded-2xl">
              <h4 className="font-bold text-lg mb-2">Restaurant Supply</h4>
              <p className="text-sm text-brand-muted">Daily fresh mushroom delivery for restaurants and fine dining establishments</p>
            </div>
            <div className="text-center p-6 bg-brand-light rounded-2xl">
              <h4 className="font-bold text-lg mb-2">Hotel Catering</h4>
              <p className="text-sm text-brand-muted">Bulk mushroom orders for hotels and large-scale catering services</p>
            </div>
            <div className="text-center p-6 bg-brand-light rounded-2xl">
              <h4 className="font-bold text-lg mb-2">Wholesale Dealers</h4>
              <p className="text-sm text-brand-muted">Competitive pricing for vegetable wholesalers and distributors</p>
            </div>
          </div>
          
          <div className="text-center">
            <a href="tel:+918826986127" className="inline-flex items-center gap-2 bg-brand-brown text-white px-8 py-4 rounded-full font-bold hover:bg-brand-dark transition-all shadow-lg">
              <Phone size={20} /> Call for Bulk Orders: +91-8826986127
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
