import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import brandLogo from '../assets/logo.png';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  const handleShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="bg-brand-dark text-brand-cream py-16 px-4 sm:px-6 lg:px-8 mt-auto border-t border-brand-brown/30 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Brand Column */}
        <div className="col-span-1 flex flex-col items-center md:items-start">
          <div className="mb-6">
            <img src={brandLogo} alt="Supr Mushrooms" className="-mt-4 md:-mt-7 h-[90px] md:h-[100px] w-auto object-contain brightness-0 invert opacity-90" />
          </div>
          <p className="text-sm leading-relaxed text-brand-cream/80 max-w-xs mx-auto md:mx-0">Delivering the freshest, scientifically farmed mushrooms in Delhi NCR. Grown in sterile, chemical-free environments for pure taste and nutrition.</p>
        </div>

        {/* Links Column */}
        <div className="flex flex-col items-center md:items-start pt-8 md:pt-12">
          <h4 className="text-white font-serif font-bold text-xl mb-6">Explore</h4>
          <ul className="space-y-4 text-sm text-brand-cream/80 w-full">
            <li><a href="#shop" onClick={handleShopClick} className="hover:text-white hover:underline transition-colors block p-1">Shop Fresh Mushrooms</a></li>
            <li><a href="#labs" onClick={(e) => { e.preventDefault(); document.getElementById('labs')?.scrollIntoView({ behavior: 'smooth' }); }} className="hover:text-white hover:underline transition-colors block p-1">Our Process</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="flex flex-col items-center md:items-start pt-8 md:pt-12">
          <h4 className="text-white font-serif font-bold text-xl mb-6">Contact Us</h4>
          <div className="flex flex-col gap-4 w-full max-w-xs md:max-w-none">
             {/* Phone */}
             <a href="tel:+918826986127" className="flex items-center gap-3 bg-black/20 hover:bg-brand-brown transition-colors p-3 rounded-xl text-white group border border-white/10 justify-center md:justify-start">
                <div className="bg-white/10 group-hover:bg-white/20 p-2 rounded-lg transition-colors"><Phone size={18} /></div>
                <span className="text-sm font-medium">+91 8826986127</span>
             </a>

             {/* Email - FIXED FONT SIZE */}
             <a href="mailto:vinayaggarwal271@gmail.com" className="flex items-center gap-3 bg-black/20 hover:bg-brand-brown transition-colors p-3 rounded-xl text-white group border border-white/10 justify-center md:justify-start">
                <div className="bg-white/10 group-hover:bg-white/20 p-2 rounded-lg transition-colors"><Mail size={18} /></div>
                <span className="text-sm font-medium text-left break-all">vinayaggarwal271@gmail.com</span>
             </a>

             {/* WhatsApp - NEW */}
             <a href="https://wa.me/918826986127" target="_blank" rel="noreferrer" className="flex items-center gap-3 bg-black/20 hover:bg-brand-green transition-colors p-3 rounded-xl text-white group border border-white/10 justify-center md:justify-start">
                <div className="bg-white/10 group-hover:bg-white/20 p-2 rounded-lg transition-colors"><MessageCircle size={18} /></div>
                <span className="text-sm font-medium">WhatsApp Us</span>
             </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 flex justify-center text-xs text-brand-cream/60">
        <p>© 2026 Supr Mushrooms. All rights reserved.</p>
      </div>
    </footer>
  );
};