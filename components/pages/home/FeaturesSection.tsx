import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, ShieldCheck, Truck, Sparkles, Leaf, DollarSign } from 'lucide-react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const FeaturesSection = () => {
  return (
    <section id="labs" className="py-16 md:py-24 bg-white dark:bg-bg-color">
      <div className="max-w-7xl mx-auto px-4">
         <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12 md:mb-16">
          <h2 className="text-xs md:text-sm font-bold text-brand-brown uppercase tracking-widest mb-3">Climate-Controlled Vertical Farming</h2>
          <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-text mb-6">Modern Aeroponic Mushroom Farming in Delhi</h3>
          <p className="text-brand-muted max-w-2xl mx-auto text-sm md:text-base">
            Our premium mushrooms are grown in sterile, climate-controlled vertical farms using advanced aeroponic technology. No soil, no pesticides, no heavy metals - just pure, organic nutrition delivered across Delhi NCR.
          </p>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            { icon: Cpu, title: "Climate-Controlled Vertical Farm", desc: "Advanced IoT sensors monitor temperature and humidity 24/7 ensuring optimal growing conditions for premium organic mushrooms." },
            { icon: ShieldCheck, title: "Zero Contamination Guarantee", desc: "HEPA-filtered air systems and strict sterile protocols ensure chemical-free, pesticide-free mushrooms grown in Delhi." },
            { icon: Truck, title: "Fast Delivery Delhi NCR", desc: "Farm-fresh mushrooms delivered within 24-48 hours to Delhi, Noida, Gurugram, Ghaziabad and Faridabad." },
            { icon: Sparkles, title: "Premium Quality Organic", desc: "Hand-picked premium oyster, button, cremini and king oyster mushrooms grown using modern farming techniques." },
            { icon: Leaf, title: "100% Natural Aeroponic", desc: "Grown using aeroponic vertical farming - no soil contamination, no heavy metals, completely organic and natural." },
            { icon: DollarSign, title: "Best Price for Bulk Orders", desc: "Competitive wholesale pricing for restaurants, hotels and bulk buyers across Delhi NCR region." }
          ].map((feature, idx) => (
            <motion.div key={idx} variants={fadeInUp} className="p-6 md:p-8 bg-brand-light rounded-3xl border border-brand-cream hover:bg-brand-cream hover:shadow-xl dark:hover:border-brand-brown/40 dark:hover:shadow-brand-brown/10 hover:-translate-y-1 transition-all duration-300 group cursor-default">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 group-hover:scale-110 transition-transform"><feature.icon size={24} className="md:w-[28px] md:h-[28px]" /></div>
              <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-brand-text">{feature.title}</h4>
              <p className="text-brand-muted text-xs md:text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
