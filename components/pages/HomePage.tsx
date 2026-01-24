'use client'

import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Cpu, ShieldCheck, Leaf, Plus, Minus, Loader2, Truck, Sparkles, DollarSign, Phone, Mail, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { DataContext } from '../context/DataContext';
import { WishlistContext } from '../context/WishlistContext';
import { SEO } from '../components/SEO';
import { motion } from 'framer-motion'; 
import heroGif from '../assets/hero-animation.gif'; 

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

export const Home: React.FC = () => {
  const cartContext = useContext(CartContext);
  const dataContext = useContext(DataContext);
  const wishlistContext = useContext(WishlistContext);
  const { products, loading } = dataContext!;
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, loading]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-brand-brown"><Loader2 className="animate-spin" size={48} /></div>;

  const visibleProducts = products.filter(p => !p.is_deleted && p.status !== 'hidden');

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Supr Mushrooms",
    "url": window.location.origin,
    "logo": "https://suprmushrooms.com/logo.png",
    "description": "Scientifically farmed premium mushrooms in Delhi NCR. 100% Natural, Chemical-free, and delivered fresh.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-8826986127",
      "contactType": "Customer Service",
      "areaServed": "IN",
      "availableLanguage": "en"
    },
    "sameAs": [
      "https://instagram.com/suprmushrooms",
      "https://facebook.com/suprmushrooms"
    ]
  };

  const handleWishlistToggle = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlistContext?.isInWishlist(productId)) {
      wishlistContext.removeFromWishlist(productId);
    } else {
      wishlistContext?.addToWishlist(productId);
    }
  };

  return (
    <div className="pb-0 bg-brand-light w-full overflow-x-hidden">
      <SEO 
        title="Fresh Lab-Grown Mushrooms Delhi" 
        description="Buy fresh Oyster and Shiitake mushrooms in Delhi NCR. Grown in sterile environments, chemical-free, and delivered farm-to-table in 24 hours."
        schema={organizationSchema}
      />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-brand-light via-brand-cream to-brand-darkCream pt-20">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-32 pb-20 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="space-y-6 md:space-y-8 z-10 order-1 md:order-1 text-center md:text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-brown/10 rounded-full border border-brand-brown/20 mx-auto md:mx-0">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-brown opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-brown"></span>
              </span>
              <span className="text-xs font-bold text-brand-brown uppercase tracking-widest">Premium Fresh Harvest</span>
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-7xl font-serif font-bold text-brand-text leading-[1.1]">
              Pure Nutrition. <br />
              <span className="text-brand-brown italic">Untouched by Toxins.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-base md:text-lg text-brand-muted max-w-lg leading-relaxed mx-auto md:mx-0">
              Forget store-bought. Eat mushrooms as nature intended—grown in sterile environments without heavy metals or chemicals.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center md:justify-start gap-4">
              <button onClick={() => document.getElementById('shop')?.scrollIntoView({behavior: 'smooth'})} className="bg-brand-brown text-white px-8 py-3 md:py-4 rounded-full font-bold text-base md:text-lg hover:bg-brand-dark hover:shadow-lg hover:shadow-brand-brown/30 transition-all flex items-center gap-2 group">
                Shop Fresh <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 md:gap-8 pt-8 border-t border-brand-brown/10">
              <div><div className="text-2xl md:text-3xl font-serif font-bold text-brand-text">100%</div><div className="text-[10px] md:text-xs text-brand-muted uppercase tracking-wider font-bold">Natural</div></div>
              <div><div className="text-2xl md:text-3xl font-serif font-bold text-brand-text">0%</div><div className="text-[10px] md:text-xs text-brand-muted uppercase tracking-wider font-bold">Soil Use</div></div>
              <div><div className="text-2xl md:text-3xl font-serif font-bold text-brand-text">0%</div><div className="text-[10px] md:text-xs text-brand-muted uppercase tracking-wider font-bold">Pesticides</div></div>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
            className="relative z-10 order-2 md:order-2 mt-8 md:mt-0 flex justify-center"
          >
             <div className="absolute inset-0 bg-brand-cream/40 blur-[60px] md:blur-[90px] rounded-full transform translate-x-4 md:translate-x-10"></div>
             <img 
  src={heroGif} 
  alt="Fresh Mushrooms Animation" 
  className="relative w-[80%] md:w-[115%] h-auto max-w-[300px] md:max-w-none mx-auto md:mx-0 object-contain md:scale-125 md:translate-x-10"
/>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="labs" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
           <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="text-center mb-12 md:mb-16">
            <h2 className="text-xs md:text-sm font-bold text-brand-brown uppercase tracking-widest mb-3">Our Process</h2>
            <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-text mb-6">Farming for the Future</h3>
            <p className="text-brand-muted max-w-2xl mx-auto text-sm md:text-base">
              Our mushrooms are grown in clean-room environments using sterilized high-grade substrates. No pesticides. No heavy metals.
            </p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: Cpu, title: "Precision Monitoring", desc: "IoT sensors monitor temperature and humidity 24/7." },
              { icon: ShieldCheck, title: "Zero Contamination", desc: "HEPA-filtered air and strict entry protocols." },
              { icon: Truck, title: "Fast Delivery", desc: "Fresh mushrooms delivered within 24-48 hours." },
              { icon: Sparkles, title: "Premium Quality", desc: "Hand-picked, farm-fresh mushrooms." },
              { icon: Leaf, title: "100% Natural", desc: "Grown naturally without harmful chemicals." },
              { icon: DollarSign, title: "Best Prices", desc: "Competitive pricing with regular discounts." }
            ].map((feature, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="p-6 md:p-8 bg-brand-light rounded-3xl border border-brand-cream hover:bg-brand-cream hover:shadow-xl transition-all duration-300 group cursor-default">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-brand-brown rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 group-hover:scale-110 transition-transform"><feature.icon size={24} className="md:w-[28px] md:h-[28px]" /></div>
                <h4 className="text-lg md:text-xl font-bold mb-2 md:mb-4 text-brand-text">{feature.title}</h4>
                <p className="text-brand-muted text-xs md:text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Shop Section */}
      <section id="shop" className="pt-16 md:pt-24 pb-24 bg-brand-light">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
            <div>
              <h2 className="text-xs md:text-sm font-bold text-brand-green uppercase tracking-widest mb-2">Fresh Harvest</h2>
              <h3 className="text-3xl md:text-5xl font-serif font-bold text-brand-text">Our Products</h3>
            </div>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {visibleProducts.map(product => {
              const isOutOfStock = product.stock === 0;
              const isComingSoon = product.status === 'coming_soon';
              const cartItem = cartContext?.cart.find(item => item.productId === product.id);
              const quantityInCart = cartItem ? cartItem.quantity : 0;
              const isWishlisted = wishlistContext?.isInWishlist(product.id);

              return (
              <motion.div variants={fadeInUp} key={product.id} className="group bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-brand-cream flex flex-col h-full relative">
                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden cursor-pointer">
                  {isOutOfStock && !isComingSoon && <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center"><span className="bg-brand-text text-white px-3 py-1 md:px-4 md:py-2 rounded-full font-bold text-xs md:text-sm">Out of Stock</span></div>}
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 flex flex-col gap-2 z-10">
                     {isComingSoon && (
                       <div className="bg-slate-800 text-white text-[8px] md:text-[10px] font-bold px-2 py-1 md:px-3 md:py-1.5 rounded-full uppercase tracking-wider w-fit shadow-md border border-white/20">Coming Soon</div>
                     )}
                  </div>
                  <button onClick={(e) => handleWishlistToggle(e, product.id)} className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full shadow-sm z-20 text-brand-brown transition-all hover:scale-110">
                    <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
                  </button>
                </Link>

                <div className="p-3 md:p-6 flex flex-col flex-grow">
                  <Link to={`/product/${product.id}`}>
                    <h4 className="text-sm md:text-lg font-bold text-brand-text mb-1 md:mb-2 group-hover:text-brand-brown transition-colors line-clamp-2 leading-tight">{product.name}</h4>
                  </Link>
                  <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-brand-muted mb-2 md:mb-4">
                    <span>{product.weight}</span>
                  </div>
                  <div className="mt-auto pt-2 md:pt-4 flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
                    <div>
                      <span className="hidden md:block text-sm text-brand-muted font-medium">{isComingSoon ? "Expected Price" : "Price"}</span>
                      <div className="text-base md:text-xl font-bold text-brand-brown">₹{product.price}</div>
                    </div>
                    {!isComingSoon && (
                      quantityInCart > 0 ? (
                        <div className="flex items-center justify-between md:justify-start gap-2 bg-brand-brown text-white rounded-lg md:rounded-xl p-1 shadow-lg shadow-brand-brown/20" onClick={(e) => e.preventDefault()}>
                           <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); cartContext?.updateQuantity(product.id, quantityInCart - 1); }} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-white/20 rounded-md md:rounded-lg transition-colors"><Minus size={14} className="md:w-4 md:h-4"/></button>
                           <span className="font-bold text-xs md:text-sm w-4 text-center">{quantityInCart}</span>
                           <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); cartContext?.updateQuantity(product.id, quantityInCart + 1); }} className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center hover:bg-white/20 rounded-md md:rounded-lg transition-colors"><Plus size={14} className="md:w-4 md:h-4"/></button>
                        </div>
                      ) : (
                        <button disabled={isOutOfStock} onClick={(e) => { e.preventDefault(); if (!isOutOfStock) { cartContext?.addToCart(product, 1); }}} className={`w-full md:w-12 h-8 md:h-12 rounded-lg md:rounded-2xl flex items-center justify-center transition-all ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-brand-brown text-white hover:bg-brand-dark hover:-translate-y-1 shadow-lg shadow-brand-brown/20'}`}>
                          <Plus size={18} className="md:w-5 md:h-5" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            )})}
          </motion.div>
        </div>
      </section>

      {/* CONTACT BANNER SECTION */}
      <section className="py-16 md:py-20 px-4 bg-brand-light">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center min-h-[300px] md:min-h-[400px]">
          <h2 className="flex flex-col items-center font-sans font-black leading-[0.9] text-[#8b4513] uppercase mb-6 md:mb-8 tracking-normal">
            <span className="text-4xl md:text-[6.5rem]">Want to</span>
            <span className="text-5xl md:text-[8.5rem] mt-2">Connect?</span>
          </h2>
          <p className="font-sans font-medium text-sm md:text-2xl text-[#8b4513] uppercase mb-8 md:mb-12 tracking-wide max-w-3xl">Call us, or just pop our notification up on WhatsApp or email.</p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-24 w-full">
            <a href="tel:+918826986127" className="flex items-center gap-3 md:gap-4 group no-underline transition-transform hover:scale-105 duration-300">
              <Phone className="w-6 h-6 md:w-10 md:h-10 text-black group-hover:text-[#8b4513] transition-colors duration-300" strokeWidth={2.5} />
              <span className="font-sans font-bold text-xl md:text-4xl text-black group-hover:text-[#8b4513] transition-colors duration-300">+91-8826986127</span>
            </a>
            <a href="mailto:vinayaggarwal271@gmail.com" className="flex items-center gap-3 md:gap-4 group no-underline transition-transform hover:scale-105 duration-300 max-w-[90vw]">
              <Mail className="w-6 h-6 md:w-10 md:h-10 text-black group-hover:text-[#8b4513] transition-colors duration-300 shrink-0" strokeWidth={2.5} />
              {/* FIXED: Text Size upgraded to text-sm on mobile (not text-[10px]) and removed break-all unless strictly needed */}
              <span className="font-sans font-bold text-sm sm:text-lg md:text-4xl text-black group-hover:text-[#8b4513] transition-colors duration-300 uppercase text-left">
                VINAYAGGARWAL271@GMAIL.COM
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};