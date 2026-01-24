'use client';

import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Image from 'next/image';
import { ShoppingBag, Menu, X, User, LayoutDashboard, Heart, Home, Store, LogOut, ChevronRight } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { AuthModal } from './AuthModal';
import brandLogo from '../assets/logo.png';

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  const cartContext = useContext(CartContext);
  const { user, isAdmin, signOut } = useContext(AuthContext)!;
  const navigate = useNavigate();
  const location = useLocation();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleCartClick = () => {
    cartContext?.setIsCartOpen(true);
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const scrollToTop = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed w-full z-50 bg-white border-b border-brand-cream/50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            
            {/* --- BRAND LOGO SECTION --- */}
            <button onClick={scrollToTop} className="flex items-center gap-2 group focus:outline-none shrink-0">
              <Image 
                src={brandLogo} 
                alt="Supr Mushrooms" 
                width={160}
                height={80}
                className="h-10 md:h-20 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </button>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={scrollToTop} className="text-sm font-medium text-brand-muted hover:text-brand-brown transition-colors">Home</button>
              <button onClick={() => scrollToSection('shop')} className="text-sm font-medium text-brand-muted hover:text-brand-brown transition-colors">Shop</button>
              
              {user ? (
                 <div className="flex items-center gap-4">
                    <Link to="/orders" className="text-sm font-bold text-brand-text hover:text-brand-brown">My Orders</Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-1 text-sm font-bold text-brand-brown hover:text-brand-dark bg-brand-light px-3 py-1 rounded-full border border-brand-brown/20">
                        <LayoutDashboard size={14}/> Admin
                      </Link>
                    )}
                    <button onClick={() => signOut()} className="text-sm font-medium text-red-500 hover:text-red-600">Logout</button>
                 </div>
              ) : (
                <button onClick={() => setIsAuthOpen(true)} className="flex items-center gap-2 text-sm font-bold text-brand-text hover:text-brand-brown">
                  <User size={18}/> Login
                </button>
              )}

              {/* Wishlist Button */}
              <Link 
                to="/wishlist" 
                className="relative p-3 bg-brand-light rounded-full hover:bg-brand-cream text-brand-brown transition-all hover:scale-105"
              >
                <Heart size={20} />
              </Link>

              {/* Cart Button */}
              <button 
                onClick={handleCartClick}
                className="relative p-3 bg-brand-light rounded-full hover:bg-brand-cream text-brand-brown transition-all hover:scale-105"
              >
                <ShoppingBag size={20} />
                {cartContext && cartContext.cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-green text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {cartContext.cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Actions (Cart + Menu Toggle) */}
            <div className="md:hidden flex items-center gap-3">
               <button onClick={handleCartClick} className="relative p-2 text-brand-text hover:text-brand-brown transition-colors">
                <ShoppingBag size={24} />
                {cartContext && cartContext.cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-green text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {cartContext.cartCount}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMenuOpen(true)} 
                className="p-2 text-brand-text hover:bg-brand-light rounded-full transition-colors"
              >
                <Menu size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* --- MOBILE DRAWER MENU --- */}
        <div 
          className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 md:hidden ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Drawer Panel - FIXED: Solid bg-white, increased z-index */}
        <div 
          className={`fixed top-0 right-0 z-[70] h-full w-[85%] max-w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full bg-white">
            {/* Drawer Header */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-white">
              <span className="text-xl font-serif font-bold text-brand-text">Menu</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="p-2 -mr-2 text-brand-muted hover:text-brand-text hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Drawer Content - FIXED: Reduced padding (p-3) so items fit on screen */}
            <div className="flex-1 overflow-y-auto py-4 px-4 space-y-2 bg-white">
              <button onClick={scrollToTop} className="flex items-center gap-4 w-full p-3 rounded-xl text-brand-text hover:bg-brand-light transition-colors group">
                <Home size={20} className="text-brand-muted group-hover:text-brand-brown"/>
                <span className="font-medium text-lg">Home</span>
              </button>
              
              <button onClick={() => scrollToSection('shop')} className="flex items-center gap-4 w-full p-3 rounded-xl text-brand-text hover:bg-brand-light transition-colors group">
                <Store size={20} className="text-brand-muted group-hover:text-brand-brown"/>
                <span className="font-medium text-lg">Shop</span>
              </button>
              
              <Link to="/wishlist" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-4 w-full p-3 rounded-xl text-brand-text hover:bg-brand-light transition-colors group">
                <Heart size={20} className="text-brand-muted group-hover:text-brand-brown"/>
                <span className="font-medium text-lg">Wishlist</span>
              </Link>

              {user && (
                 <Link to="/orders" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-4 w-full p-3 rounded-xl text-brand-text hover:bg-brand-light transition-colors group">
                   <ShoppingBag size={20} className="text-brand-muted group-hover:text-brand-brown"/>
                   <span className="font-medium text-lg">My Orders</span>
                 </Link>
              )}

              {user && isAdmin && (
                <Link to="/admin" onClick={()=>setIsMenuOpen(false)} className="flex items-center gap-4 w-full p-3 rounded-xl bg-brand-light/50 text-brand-brown hover:bg-brand-light transition-colors">
                   <LayoutDashboard size={20}/>
                   <span className="font-bold text-lg">Admin Dashboard</span>
                </Link>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-5 border-t border-gray-100 bg-white">
              {user ? (
                 <button 
                   onClick={()=>{signOut(); setIsMenuOpen(false)}} 
                   className="flex items-center justify-between w-full p-4 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors"
                 >
                   <span className="flex items-center gap-2"><LogOut size={18}/> Logout</span>
                 </button>
              ) : (
                 <button 
                   onClick={()=>{setIsAuthOpen(true); setIsMenuOpen(false)}} 
                   className="flex items-center justify-between w-full p-4 rounded-xl bg-brand-brown text-white font-bold hover:bg-brand-dark shadow-lg shadow-brand-brown/20 transition-all"
                 >
                   <span className="flex items-center gap-2"><User size={18}/> Login / Signup</span>
                   <ChevronRight size={18} />
                 </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};