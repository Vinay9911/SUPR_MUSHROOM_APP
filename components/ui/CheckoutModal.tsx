'use client';

import React, { useContext, useState, useEffect } from 'react';
import { X, ArrowRight, Loader2, CreditCard, Banknote, Tag, Upload, Copy, Check } from 'lucide-react';
import { CartContext } from '@/components/providers/CartProvider';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { Coupon } from '@/types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const supabase = createClient();
  const cartContext = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ name: '', address: '', phone: '', email: '' });
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        // 1. Get User
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
           setFormData(prev => ({ ...prev, email: user.email || '' }));
        }
      };
      fetchData();
    }
  }, [isOpen]); // Removed supabase dependency to prevent re-runs

  if (!isOpen || !cartContext) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText("8826986127@kotak");
    setCopied(true);
    toast.success("UPI ID Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentFile(e.target.files[0]);
    }
  };

  const validateCoupon = (coupon: Coupon) => {
    if (coupon.min_order_value && cartContext.total < coupon.min_order_value) {
      toast.error(`Order needs to be at least ₹${coupon.min_order_value} to use this coupon`);
      return false;
    }
    return true;
  };

  const applyCouponLogic = (coupon: Coupon) => {
    if (!validateCoupon(coupon)) return;

    let discountAmount = Math.round((cartContext.total * coupon.discount_percentage) / 100);
    if (coupon.max_discount_amount && discountAmount > coupon.max_discount_amount) {
      discountAmount = coupon.max_discount_amount;
    }

    setDiscount(discountAmount);
    setAppliedCoupon(coupon.code);
    setCouponCode(coupon.code);
    toast.success(`Coupon ${coupon.code} applied! Saved ₹${discountAmount}`);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setLoading(true);
    
    try {
      const response = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      });

      const data = await response.json();

      if (response.ok && data.coupon) {
        applyCouponLogic(data.coupon);
      } else {
        toast.error(data.error || "Invalid or expired coupon");
        setAppliedCoupon(null);
        setDiscount(0);
      }
    } catch (error) {
      toast.error("Failed to validate coupon");
      setAppliedCoupon(null);
      setDiscount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartContext.cart.length === 0) return;

    if (paymentMethod === 'UPI' && !paymentFile) {
      toast.error("Please upload the payment screenshot");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);

    try {
      // 1. Client-side Stock Check (UX only)
      const isStockValid = await cartContext.validateStock();
      if (!isStockValid) {
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      const userId = user?.id || null;

      // 2. Upload Payment Proof (if UPI)
      let paymentProofUrl = null;
      if (paymentMethod === 'UPI' && paymentFile) {
        const fileName = `${Date.now()}_${paymentFile.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
        const { error: uploadError } = await supabase.storage
          .from('payment_proofs')
          .upload(fileName, paymentFile);
        
        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);
        
        const { data: publicUrlData } = supabase.storage
          .from('payment_proofs')
          .getPublicUrl(fileName);
          
        paymentProofUrl = publicUrlData.publicUrl;
      }

      // 3. Call Secure API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_email: !userId ? formData.email : null,
          shipping_address: JSON.stringify({
            name: formData.name,
            address: formData.address,
            phone: formData.phone,
            email: formData.email
          }),
          payment_method: paymentMethod === 'UPI' ? 'UPI' : 'Cash on Delivery',
          payment_proof_url: paymentProofUrl,
          coupon_code: appliedCoupon,
          items: cartContext.cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            // Price is NOT sent here intentionally
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Order processing failed');
      }

      toast.success('Order placed successfully! Check your email.');
      cartContext.clearCart();
      onClose();
      
      // Reset State
      setDiscount(0);
      setAppliedCoupon(null);
      setCouponCode('');
      setFormData({ name: '', address: '', phone: '', email: '' });
      setPaymentFile(null);

    } catch (error: any) {
      console.error("Order Error:", error);
      toast.error(error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-bg-color rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-brand-cream flex justify-between items-center bg-brand-light">
          <h2 className="font-bold text-lg text-brand-text">Checkout</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 grid md:grid-cols-2 gap-8">
          
          {/* Left Column: Summary */}
          <div>
            <h3 className="font-bold text-brand-muted text-xs uppercase tracking-wider mb-4">Order Summary</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
              {cartContext.cart.map(item => (
                <div key={item.productId} className="flex gap-3 bg-brand-light p-2 rounded-xl border border-brand-cream">
                  <img src={item.product.images[0]} className="w-16 h-16 rounded-lg object-cover bg-white dark:bg-bg-color" alt={item.product.name} />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-sm text-brand-text line-clamp-1">{item.product.name}</p>
                      {item.isPreOrder && (
                        <span className="text-[10px] bg-blue-900 text-white px-1.5 py-0.5 rounded font-bold">PRE-ORDER</span>
                      )}
                    </div>
                    <span className="text-xs text-brand-muted">Qty: {item.quantity}</span>
                  </div>
                  <div className="font-bold text-sm flex items-end pb-1 text-brand-text">₹{item.product.price * item.quantity}</div>
                </div>
              ))}
            </div>
            
            {/* Coupon Section */}
            <div className="mt-6 pt-4 border-t border-brand-cream">
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Apply Coupon</label>
              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-2.5 text-brand-muted" size={16}/>
                  <input 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="w-full pl-10 pr-3 py-2 bg-brand-light border border-brand-cream rounded-xl text-sm uppercase focus:outline-none focus:border-gray-400"
                    disabled={!!appliedCoupon}
                  />
                </div>
                {appliedCoupon ? (
                  <button onClick={() => {setAppliedCoupon(null); setDiscount(0); setCouponCode('');}} className="text-red-500 text-sm font-bold px-3 hover:text-red-600">Remove</button>
                ) : (
                  <button onClick={handleApplyCoupon} type="button" className="bg-gray-800 text-white px-4 rounded-xl text-sm font-bold hover:bg-black transition-colors">Apply</button>
                )}
              </div>
            </div>

            {/* Totals */}
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm text-brand-muted"><span>Subtotal</span><span>₹{cartContext.total}</span></div>
              {discount > 0 && <div className="flex justify-between text-sm text-green-600 font-bold"><span>Discount</span><span>-₹{discount}</span></div>}
              <div className="flex justify-between font-bold text-lg text-brand-text pt-2 border-t border-brand-cream"><span>Total</span><span>₹{cartContext.total - discount}</span></div>
            </div>
          </div>

          {/* Right Column: Form */}
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="font-bold text-brand-muted text-xs uppercase tracking-wider">Shipping Details</h3>
               <span className="text-[10px] bg-brand-cream px-2 py-1 rounded border border-brand-cream text-brand-muted">
                 {formData.email && !cartContext.isLoading ? 'Verified' : 'Guest'}
               </span>
            </div>
            
            <input required placeholder="Full Name" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="w-full p-3 bg-brand-light dark:bg-black/20 border border-brand-cream dark:border-gray-800 rounded-xl outline-none focus:border-gray-400 text-sm"/>
            <input required type="email" placeholder="Email (Required)" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} className="w-full p-3 bg-brand-light dark:bg-black/20 border border-brand-cream dark:border-gray-800 rounded-xl outline-none focus:border-gray-400 text-sm"/>
            <input required placeholder="Phone Number" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} className="w-full p-3 bg-brand-light dark:bg-black/20 border border-brand-cream dark:border-gray-800 rounded-xl outline-none focus:border-gray-400 text-sm"/>
            <textarea required placeholder="Full Address with Pincode" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} className="w-full p-3 bg-brand-light dark:bg-black/20 border border-brand-cream dark:border-gray-800 rounded-xl outline-none focus:border-gray-400 h-20 text-sm resize-none"/>
            
            <h3 className="font-bold text-brand-muted text-xs uppercase tracking-wider mb-2 mt-6">Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
               <button type="button" onClick={()=>setPaymentMethod('COD')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'COD' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white dark:bg-brand-light border-brand-cream dark:border-brand-cream/20 text-brand-muted dark:text-brand-muted hover:border-gray-300 dark:hover:border-brand-cream/40'}`}>
                  <Banknote size={24}/> <span className="text-xs font-bold">Cash on Delivery</span>
               </button>
               <button type="button" onClick={()=>setPaymentMethod('UPI')} className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'UPI' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white dark:bg-brand-light border-brand-cream dark:border-brand-cream/20 text-brand-muted dark:text-brand-muted hover:border-gray-300 dark:hover:border-brand-cream/40'}`}>
                  <CreditCard size={24}/> <span className="text-xs font-bold">Pay via UPI</span>
               </button>
            </div>

            {paymentMethod === 'UPI' && (
               <div className="bg-brand-light dark:bg-black/20 border border-brand-cream dark:border-gray-800 rounded-xl p-4 animate-in slide-in-from-top-2">
                  <p className="text-xs text-brand-muted uppercase font-bold mb-2">1. Send Payment To:</p>
                  <div className="flex items-center gap-2 bg-white dark:bg-brand-light p-3 rounded-lg border border-brand-cream dark:border-brand-cream/20 mb-4">
                     <span className="font-mono font-bold text-brand-text flex-1">8826986127@kotak</span>
                     <button type="button" onClick={copyToClipboard} className="text-brand-muted hover:text-black">
                        {copied ? <Check size={18} className="text-green-500"/> : <Copy size={18}/>}
                     </button>
                  </div>

                  <p className="text-xs text-brand-muted uppercase font-bold mb-2">2. Upload Screenshot:</p>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 dark:border-brand-cream/30 border-dashed rounded-xl cursor-pointer bg-white dark:bg-brand-light hover:bg-brand-light dark:hover:bg-brand-cream/10 transition-colors">
                     {paymentFile ? (
                        <div className="flex items-center gap-2 text-green-600 font-bold text-sm">
                           <Check size={16} /> {paymentFile.name.slice(0, 20)}...
                        </div>
                     ) : (
                        <div className="flex flex-col items-center gap-1 text-brand-muted">
                           <Upload size={20} />
                           <span className="text-xs">Click to upload screenshot</span>
                        </div>
                     )}
                     <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
               </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-brand-cream bg-brand-light">
          <button form="checkout-form" disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading ? <Loader2 className="animate-spin"/> : (
               paymentMethod === 'COD' ? <span>Place Order (COD) <ArrowRight className="inline" size={18}/></span> : <span>Confirm Payment <ArrowRight className="inline" size={18}/></span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};