import React from 'react';

export const FAQSection = () => {
  return (
    <section className="py-16 bg-brand-cream/30 dark:bg-black">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-serif font-bold text-center mb-12">Frequently Asked Questions About Mushrooms in Delhi NCR</h2>
        <div className="space-y-4">
          {[
            { 
              q: "Where do you deliver mushrooms in Delhi NCR?", 
              a: "We deliver fresh organic mushrooms to Delhi, Noida, Gurugram (Gurgaon), Faridabad, Ghaziabad, and Greater Noida within 24-48 hours. Same-day delivery available for bulk orders in select areas." 
            },
            { 
              q: "Are your mushrooms 100% organic and pesticide-free?", 
              a: "Yes. Our mushrooms are grown in sterile, climate-controlled vertical farms using aeroponic technology. We use zero pesticides, zero soil (which eliminates heavy metal contamination), and maintain pharmaceutical-grade cleanliness standards." 
            },
            { 
              q: "Do you supply mushrooms to restaurants and hotels in Delhi?", 
              a: "Yes! We are a trusted wholesale mushroom supplier for restaurants, hotels, cloud kitchens, and catering services across Delhi NCR. We offer competitive bulk pricing and daily delivery. Call +91-8826986127 for wholesale rates." 
            },
            { 
              q: "What farming method do you use to grow mushrooms?", 
              a: "We use advanced climate-controlled vertical farming combined with aeroponic systems. This modern farming technique allows us to grow premium oyster, button, cremini, and king oyster mushrooms year-round with consistent quality." 
            },
            {
              q: "What types of mushrooms do you sell?",
              a: "We grow and deliver: Fresh Oyster Mushrooms, Button Mushrooms (White Mushrooms), Cremini Mushrooms (Baby Bella), and King Oyster Mushrooms. All varieties are grown organically in our Delhi farm."
            },
            {
              q: "How fresh are the mushrooms when delivered?",
              a: "Our mushrooms are harvested fresh and delivered within 24-48 hours across Delhi NCR. We maintain cold chain logistics to ensure you receive farm-fresh, premium quality mushrooms at your doorstep."
            },
            {
              q: "What is the price of oyster mushrooms in Delhi?",
              a: "Our oyster mushroom prices are competitive and vary based on quantity. For retail orders, check our product page. For wholesale/bulk pricing for restaurants, contact us at +91-8826986127."
            },
            {
              q: "Do you provide mushrooms for bulk or wholesale orders?",
              a: "Yes! We specialize in wholesale mushroom supply for restaurants, hotels, and bulk buyers. We offer special pricing for regular orders and can supply up to 50kg+ daily. Contact us for customized wholesale rates."
            }
          ].map((faq, i) => (
            <details key={i} className="glow-card bg-white dark:bg-brand-darkCream p-6 rounded-xl border border-brand-cream dark:border-brand-cream/20 cursor-pointer group">
              <summary className="font-bold text-lg flex justify-between items-center list-none">
                {faq.q}
                <span className="group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="mt-4 text-brand-muted leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};
