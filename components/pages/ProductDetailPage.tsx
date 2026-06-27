'use client'

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingBag, Truck, ShieldCheck, Leaf, Heart, Star, MessageSquare } from 'lucide-react';
import { DataContext } from '@/components/providers/DataProvider';
import { CartContext } from '@/components/providers/CartProvider';
import { WishlistContext } from '@/components/providers/WishlistProvider';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';

interface ProductDetailPageProps {
  product: any;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
  const cartContext = useContext(CartContext);
  const wishlistContext = useContext(WishlistContext);
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [showWaitlistInput, setShowWaitlistInput] = useState(false);
  const [submittingWaitlist, setSubmittingWaitlist] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchReviewsAndUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from('product_reviews')
        .select('*, profiles(full_name)')
        .eq('product_id', product.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
      setLoadingReviews(false);
    };

    fetchReviewsAndUser();
  }, [product.id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error('Please log in to submit a review');
    if (!reviewComment.trim()) return toast.error('Please write a comment');

    setSubmittingReview(true);
    const supabase = createClient();
    const { error } = await supabase.from('product_reviews').insert({
      product_id: product.id,
      user_id: user.id,
      rating: reviewRating,
      comment: reviewComment
    });

    if (error) {
      if (error.code === '23505') toast.error('You have already reviewed this product');
      else toast.error('Failed to submit review');
    } else {
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewRating(5);
      // Optimistic update
      setReviews([{ id: Date.now(), rating: reviewRating, comment: reviewComment, created_at: new Date().toISOString(), profiles: { full_name: user.user_metadata?.full_name || 'You' } }, ...reviews]);
    }
    setSubmittingReview(false);
  };

  const isOutOfStock = product.stock === 0;
  const isComingSoon = product.status === 'coming_soon';
  const isWishlisted = wishlistContext?.isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!isOutOfStock && !isComingSoon) {
      cartContext?.addToCart(product, quantity);
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      wishlistContext?.removeFromWishlist(product.id);
    } else {
      wishlistContext?.addToWishlist(product.id);
    }
  };

  const handleWaitlistSubmit = async () => {
    if (!waitlistEmail || !/^\S+@\S+\.\S+$/.test(waitlistEmail)) {
      return toast.error("Please enter a valid email address");
    }
    
    try {
      setSubmittingWaitlist(true);
      const supabase = createClient();
      const { error } = await supabase.from('waitlist').insert({
        product_id: product.id,
        email: waitlistEmail
      });
      
      if (error) {
        if (error.code === '23505') {
          toast.success("You are already on the waitlist!");
        } else {
          throw error;
        }
      } else {
        toast.success("Added to waitlist! We'll notify you.");
        setShowWaitlistInput(false);
        setWaitlistEmail('');
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to join waitlist");
    } finally {
      setSubmittingWaitlist(false);
    }
  };

  return (
    <div className="pt-24 pb-12 bg-white dark:bg-bg-color min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-brown font-medium mb-8 hover:underline">
          <ArrowLeft size={20} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square rounded-3xl overflow-hidden bg-brand-cream border border-brand-cream relative group">
              {isOutOfStock && !isComingSoon && (
                <div className="absolute inset-0 bg-white/60 dark:bg-bg-color/60 z-10 flex items-center justify-center">
                  <span className="bg-brand-dark text-white px-6 py-3 rounded-full font-bold text-lg shadow-xl">Out of Stock</span>
                </div>
              )}
              
              <Image 
                src={product.images[activeImage]} 
                alt={product.name} 
                width={1000}
                height={1000}
                quality={95}
                priority
                className="w-full h-full object-cover"
              />
              
              <button 
                onClick={handleWishlistToggle}
                className="absolute top-4 right-4 p-3 bg-white/90 dark:bg-bg-color/90 hover:bg-white dark:hover:bg-bg-color rounded-full shadow-md text-brand-brown transition-transform hover:scale-110 hidden md:block"
              >
                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
              </button>
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-brand-brown ring-2 ring-brand-brown/20' : 'border-transparent hover:border-brand-cream'}`}
                  >
                    <Image src={img} alt="" width={96} height={96} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
               {isComingSoon ? (
                 <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Coming Soon</span>
               ) : (
                 <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">In Stock</span>
               )}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-text mb-4">{product.name}</h1>
            
            <div className="flex items-end gap-4 mb-8">
              <span className="text-3xl font-bold text-brand-brown">₹{product.price}</span>
              <span className="text-brand-muted mb-1.5">{product.weight}</span>
            </div>

            <p className="text-brand-muted text-lg leading-relaxed mb-8 border-b border-brand-cream pb-8">
              {product.description}
            </p>

            <div className="space-y-6 mb-8">
               {!isComingSoon && (
                <div className="flex items-center gap-6">
                  <span className="text-sm font-bold text-brand-text uppercase tracking-widest">Quantity</span>
                  <div className="flex items-center gap-3 bg-brand-light rounded-full p-1 border border-brand-cream">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full bg-white dark:bg-brand-darkCream flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white dark:hover:text-white transition-colors shadow-sm"
                      disabled={isOutOfStock}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="text-xl font-bold w-8 text-center">{quantity}</span>
                    <button 
                      onClick={() => {
                        if (quantity < product.stock) {
                          setQuantity(quantity + 1);
                        } else {
                          toast.error(`Only ${product.stock} items left in stock!`);
                        }
                      }}
                      className="w-10 h-10 rounded-full bg-white dark:bg-brand-darkCream flex items-center justify-center text-brand-brown hover:bg-brand-brown hover:text-white dark:hover:text-white transition-colors shadow-sm"
                      disabled={isOutOfStock || quantity >= product.stock}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {showWaitlistInput ? (
                  <div className="flex-1 flex gap-2">
                    <input 
                      type="email" 
                      placeholder="Enter your email..." 
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      className="flex-1 px-4 py-4 rounded-full border border-brand-cream focus:border-brand-brown outline-none"
                    />
                    <button 
                      onClick={handleWaitlistSubmit}
                      disabled={submittingWaitlist}
                      className="px-6 py-4 bg-brand-brown text-white rounded-full font-bold hover:bg-brand-dark transition-colors"
                    >
                      {submittingWaitlist ? "Submitting..." : "Submit"}
                    </button>
                    <button 
                      onClick={() => setShowWaitlistInput(false)}
                      className="px-4 py-4 text-brand-muted hover:text-brand-text font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <MagneticButton 
                    onClick={() => isComingSoon || isOutOfStock ? setShowWaitlistInput(true) : handleAddToCart()}
                    className={`flex-1 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-xl transition-all ${
                      isOutOfStock || isComingSoon
                        ? 'bg-brand-brown text-white hover:bg-brand-dark hover:shadow-2xl hover:-translate-y-1' 
                        : 'bg-brand-brown text-white hover:bg-brand-dark hover:shadow-2xl hover:-translate-y-1'
                    }`}
                  >
                    <ShoppingBag size={22} />
                    {isComingSoon ? "Notify Me" : isOutOfStock ? "Notify Me When Available" : "Add to Cart"}
                  </MagneticButton>
                )}
                
                <button 
                  onClick={handleWishlistToggle}
                  className="w-16 h-16 rounded-full border border-brand-cream flex items-center justify-center text-brand-brown hover:bg-brand-light transition-colors md:hidden"
                >
                   <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="flex items-center gap-3 p-4 bg-brand-light rounded-2xl border border-brand-cream/50">
                 <Truck className="text-brand-brown" size={24} />
                 <div>
                   <div className="font-bold text-sm text-brand-text">Next Day</div>
                   <div className="text-xs text-brand-muted">Delivery</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-4 bg-brand-light rounded-2xl border border-brand-cream/50">
                 <Leaf className="text-brand-brown" size={24} />
                 <div>
                   <div className="font-bold text-sm text-brand-text">100% Organic</div>
                   <div className="text-xs text-brand-muted">Certified</div>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-4 bg-brand-light rounded-2xl border border-brand-cream/50">
                 <ShieldCheck className="text-brand-brown" size={24} />
                 <div>
                   <div className="font-bold text-sm text-brand-text">Chemical Free</div>
                   <div className="text-xs text-brand-muted">Lab Tested</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-16 border-t border-brand-cream">
        <h2 className="text-3xl font-serif font-bold text-brand-text mb-8">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Review Form */}
          <div className="lg:col-span-1 bg-brand-light dark:bg-brand-darkCream p-6 rounded-2xl border border-brand-cream dark:border-brand-cream/20 h-fit sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><MessageSquare size={20}/> Write a Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-bold text-brand-muted block mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setReviewRating(star)} className="focus:outline-none">
                        <Star size={24} className={star <= reviewRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-brand-muted block mb-2">Review</label>
                  <textarea 
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="What did you think of these mushrooms?"
                    className="w-full p-3 bg-white dark:bg-bg-color border border-brand-cream dark:border-brand-cream/20 rounded-xl focus:border-brand-brown outline-none h-32 resize-none"
                    required
                  />
                </div>
                <button type="submit" disabled={submittingReview} className="w-full bg-brand-brown text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50">
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="text-center py-6 bg-white dark:bg-bg-color rounded-xl">
                <p className="text-brand-muted mb-2">You must be logged in to leave a review.</p>
                <p className="text-brand-brown font-bold">Use the “Login” button in the top menu to sign in.</p>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {loadingReviews ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-brand-light p-6 rounded-2xl border border-brand-cream dark:border-brand-cream/20 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-20 h-3" />
                      </div>
                    </div>
                    <Skeleton className="w-full h-16" />
                  </div>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((review: any) => (
                <div key={review.id} className="bg-white dark:bg-brand-light p-6 rounded-2xl border border-brand-cream dark:border-brand-cream/20 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-brand-brown text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {review.profiles?.full_name?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <p className="font-bold text-brand-text text-sm">{review.profiles?.full_name || 'Verified Customer'}</p>
                        <p className="text-xs text-brand-muted">{new Date(review.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={16} className={star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-brand-text/80">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-brand-light rounded-2xl border border-brand-cream border-dashed">
                <Star className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-brand-muted">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Sticky Bar (Mobile) */}
      <AnimatePresence>
        {showStickyBar && !isComingSoon && !isOutOfStock && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-bg-color/80 backdrop-blur-md border-t border-brand-cream/50 p-4 z-50 md:hidden shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-safe"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <span className="text-xs text-brand-muted font-medium">Total for {quantity}</span>
                <span className="text-xl font-bold text-brand-brown">₹{product.price * quantity}</span>
              </div>
              
              <div className="flex flex-1 gap-2">
                 <button onClick={handleWishlistToggle} className="p-3 bg-brand-cream rounded-full text-brand-brown">
                    <Heart size={20} fill={isWishlisted ? "currentColor" : "none"}/>
                 </button>
                 <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-brand-brown text-white py-3 rounded-full font-bold text-base flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};