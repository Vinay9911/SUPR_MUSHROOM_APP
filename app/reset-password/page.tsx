'use client';

import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client'; // ✅ FIXED
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleUpdate = async () => {
    if (!password) return toast.error("Please enter a password");
    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully!");
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-32 flex justify-center bg-brand-light px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md h-fit border border-brand-cream">
        <h2 className="text-2xl font-serif font-bold text-brand-text mb-2">Set New Password</h2>
        <p className="text-brand-muted text-sm mb-6">Enter your new password below to update your account.</p>
        
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New secure password"
          className="w-full bg-brand-light border border-brand-cream rounded-xl px-4 py-3 text-sm outline-none focus:border-brand-brown mb-4"
        />
        
        <button 
          onClick={handleUpdate} 
          disabled={loading}
          className="w-full bg-brand-brown text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-colors"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </div>
    </div>
  );
}