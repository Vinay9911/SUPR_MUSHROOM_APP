// ===================================
// FILE 6: components/ui/AuthModal.tsx (FIXED)
// ===================================

'use client';

import React, { useState, useContext } from 'react';
import { X, Loader2 } from 'lucide-react';
import { AuthContext } from '@/components/providers/AuthProvider';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useContext(AuthContext);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (view === 'login') {
        const { error } = await auth!.signIn(email, password);
        if (error) throw error;
        toast.success("Welcome back!");
        onClose();
      } else if (view === 'signup') {
        const { error } = await auth!.signUp(email, password, name);
        if (error) throw error;
        toast.success("Account created! Please check your email.");
        onClose();
      } else if (view === 'forgot') {
        const { error } = await auth!.resetPassword(email);
        if (error) throw error;
        toast.success("Password reset link sent to your email");
        setView('login');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await auth!.signInWithGoogle();
    } catch (error: any) {
      toast.error("Google sign in failed");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand-dark/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95">
        <h2 className="text-2xl font-serif font-bold text-brand-text mb-2">
          {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Join Supr Mushrooms' : 'Reset Password'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {view === 'signup' && (
            <input type="text" placeholder="Full Name" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-brand-light border border-brand-cream rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-brown" />
          )}
          
          <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-brand-light border border-brand-cream rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-brown" />
          
          {view !== 'forgot' && (
            <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-brand-light border border-brand-cream rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-brown" />
          )}
          
          <button type="submit" disabled={loading} className="w-full bg-brand-brown text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-colors flex justify-center items-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : (view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Reset Link')}
          </button>
        </form>

        {view !== 'forgot' && (
          <div className="mt-4">
            <button onClick={handleGoogleLogin} className="w-full bg-white border border-brand-cream text-brand-text font-medium py-3 rounded-xl hover:bg-brand-light transition-colors flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Sign in with Google
            </button>
          </div>
        )}

        <div className="mt-6 text-center text-sm space-y-2">
          {view === 'login' && (
            <>
              <button onClick={() => setView('forgot')} className="block w-full text-brand-muted hover:text-brand-brown">Forgot password?</button>
              <div className="text-brand-muted">
                Don't have an account? <button onClick={() => setView('signup')} className="text-brand-brown font-bold hover:underline">Sign Up</button>
              </div>
            </>
          )}
          {view === 'signup' && (
            <div className="text-brand-muted">
              Already have an account? <button onClick={() => setView('login')} className="text-brand-brown font-bold hover:underline">Log In</button>
            </div>
          )}
          {view === 'forgot' && (
            <button onClick={() => setView('login')} className="text-brand-brown font-bold hover:underline">Back to Login</button>
          )}
        </div>
        
        <button onClick={onClose} className="absolute top-4 right-4 text-brand-muted hover:text-brand-brown"><X size={20} /></button>
      </div>
    </div>
  );
};
