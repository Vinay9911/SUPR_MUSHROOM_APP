import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { SporeBackground } from '@/components/ui/SporeBackground';
import { GlowingBorder } from '@/components/ui/GlowingBorder';

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

export const HeroSection = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Background moves slower than content
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Image moves faster than background to create depth
  const yImage = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section ref={ref} suppressHydrationWarning className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-light via-brand-cream to-brand-darkCream dark:from-[#07080B] dark:via-[#07080B] dark:to-[#0B0E15] pt-20">
      <motion.div style={{ y: yBg }} className="absolute inset-0 bg-brand-light/50 dark:bg-transparent z-0" />
      <SporeBackground className="absolute inset-0 z-0 pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-32 pb-20 grid md:grid-cols-2 gap-8 md:gap-12 items-center z-10">
        
        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
          className="space-y-6 md:space-y-8 z-10 order-1 md:order-1 text-center md:text-left"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-brown/10 rounded-full border border-brand-brown/20 mx-auto md:mx-0">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-brown opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-brown"></span>
            </span>
            <span className="text-xs font-bold text-brand-brown uppercase tracking-widest">Fresh Mushrooms Delhi NCR</span>
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-7xl font-serif font-bold text-brand-text leading-[1.1]">
            Fresh Organic Mushrooms <br />
            <span className="text-brand-brown italic">Delivered Across Delhi NCR</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-base md:text-lg text-brand-muted max-w-lg leading-relaxed mx-auto md:mx-0">
            Premium oyster, button, cremini & king oyster mushrooms grown in climate-controlled vertical farms. Farm-fresh delivery to Delhi, Noida, Gurugram, Ghaziabad within 24 hours. 100% organic, zero pesticides.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center md:justify-start gap-4">
            <GlowingBorder radius="rounded-full">
              <MagneticButton onClick={() => document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'})} className="bg-brand-brown text-white px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-brown/30 transition-all flex items-center gap-2 group">
                Order Fresh Mushrooms <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </MagneticButton>
            </GlowingBorder>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-brand-brown/10">
            <div><div className="text-2xl md:text-3xl font-serif font-bold text-brand-text">100%</div><div className="text-[10px] md:text-xs text-brand-muted uppercase tracking-wider font-bold">Organic</div></div>
            <div><div className="text-2xl md:text-3xl font-serif font-bold text-brand-text">24hr</div><div className="text-[10px] md:text-xs text-brand-muted uppercase tracking-wider font-bold">Delivery NCR</div></div>
            <div><div className="text-2xl md:text-3xl font-serif font-bold text-brand-text">0%</div><div className="text-[10px] md:text-xs text-brand-muted uppercase tracking-wider font-bold">Pesticides</div></div>
          </motion.div>
        </motion.div>

        <motion.div 
          style={{ y: yImage }}
          className="relative z-10 order-2 md:order-2 mt-8 md:mt-0 flex justify-center"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="relative w-full flex justify-center"
          >
            <div className="absolute inset-0 bg-brand-cream/40 dark:bg-brand-darkCream blur-[60px] md:blur-[90px] rounded-full transform translate-x-4 md:translate-x-10"></div>
            <Image 
              src="/hero-animation.gif" 
              alt="Fresh organic mushrooms from vertical farm in Delhi NCR" 
              width={400}
              height={400}
              className="relative w-[80%] md:w-[115%] h-auto max-w-[300px] md:max-w-none mx-auto md:mx-0 object-contain md:scale-125 md:translate-x-10"
              priority
              unoptimized
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
