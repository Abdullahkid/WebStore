'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AddressForm from '@/components/address/AddressForm';
import { Address } from '@/lib/types';
import { showToast } from '@/lib/toast';
import { ArrowLeft } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.downxtown.com';

export default function AddressPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingAddress, setIsFetchingAddress] = useState(true);
  const [existingAddress, setExistingAddress] = useState<Address | null>(null);
  const [firebaseIdToken, setFirebaseIdToken] = useState<string | null>(null);
  
  // Get checkout parameters from URL or sessionStorage
  let productId = searchParams.get('productId');
  let variantId = searchParams.get('variantId');
  let quantity = searchParams.get('quantity');
  let customerId = searchParams.get('customerId');

  // If not in URL, check sessionStorage for checkoutIntent
  if (!productId && typeof window !== 'undefined') {
    const checkoutIntent = sessionStorage.getItem('checkoutIntent');
    if (checkoutIntent) {
      try {
        const intent = JSON.parse(checkoutIntent);
        productId = intent.productId;
        variantId = intent.variantId;
        quantity = intent.quantity?.toString();
        customerId = intent.customerId || localStorage.getItem('userId');
      } catch (e) {
        console.error('Error parsing checkoutIntent:', e);
      }
    }
  }

  useEffect(() => {
    initializeAuth();
  }, [router]);

  const initializeAuth = async () => {
    try {
      const customToken = localStorage.getItem('authToken');
      const accountType = localStorage.getItem('accountType');

      if (!customToken) {
        showToast('Please login to continue', 'error');
        router.push('/login?redirect=/address');
        return;
      }

      // Only personal users need to provide address
      if (accountType !== 'PERSONAL') {
        showToast('This page is only for personal users', 'info');
        router.push('/');
        return;
      }

      // Sign in with custom token to get Firebase ID token
      const userCredential = await signInWithCustomToken(auth, customToken);
      const idToken = await userCredential.user.getIdToken();

      setFirebaseIdToken(idToken);
      fetchExistingAddress(idToken);
    } catch (error) {
      console.error('Authentication error:', error);
      showToast('Authentication failed. Please login again.', 'error');
      localStorage.removeItem('authToken');
      router.push('/login?redirect=/address');
    }
  };

  const getFirebaseIdToken = async (): Promise<string | null> => {
    console.log('🔐 getFirebaseIdToken: START');
    try {
      console.log('🔐 Firebase Auth instance:', auth);

      const user = auth.currentUser;
      console.log('🔐 Current user:', user);
      console.log('🔐 User UID:', user?.uid);

      if (!user) {
        console.error('🔐 ERROR: No user logged in');
        throw new Error('No user logged in');
      }

      console.log('🔐 Attempting to get ID token...');
      // Force refresh to get a fresh token (true = forceRefresh)
      const idToken = await user.getIdToken(true);
      console.log('🔐 ID Token retrieved successfully');
      console.log('🔐 Token length:', idToken?.length);
      console.log('🔐 Token (first 50 chars):', idToken?.substring(0, 50));

      return idToken;
    } catch (error) {
      console.error('🔐 ERROR getting Firebase ID token:', error);
      return null;
    }
  };

  const fetchExistingAddress = async (initialToken: string) => {
    try {
      setIsFetchingAddress(true);
      const response = await fetch(`${API_BASE_URL}/user/address`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${initialToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data) {
          setExistingAddress(data);
        }
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      // Don't show error toast, just let user add new address
    } finally {
      setIsFetchingAddress(false);
    }
  };

  const handleSubmit = async (address: Address) => {
    console.log('🚀 handleSubmit CALLED');
    console.log('🚀 Address received:', address);

    setIsLoading(true);

    try {
      console.log('🚀 About to get Firebase ID token...');
      // Get fresh token for this request
      const token = await getFirebaseIdToken();

      // DEBUG: Log the token value
      console.log('=== DEBUG: handleSubmit ===');
      console.log('Token:', token);
      console.log('Token length:', token?.length);
      console.log('Address being sent:', address);
      console.log('========================');

      if (!token) {
        console.error('❌ No token received!');
        showToast('Authentication required', 'error');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/address`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();

      if (response.ok) {
        showToast('Address saved successfully!', 'success');
        setExistingAddress(address);

        // Check if we need to redirect to checkout
        if (productId && quantity) {
          // Navigate to checkout with product details
          const userId = customerId || auth.currentUser?.uid || localStorage.getItem('userId') || '';
          const checkoutParams = new URLSearchParams({
            customerId: userId,
            productId,
            quantity,
            ...(variantId && { variantId }),
          });
          
          // Clear the checkout intent from sessionStorage
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('checkoutIntent');
          }
          
          setTimeout(() => {
            router.push(`/checkout?${checkoutParams.toString()}`);
          }, 1500);
        } else {
          // Redirect to home or previous page after short delay
          setTimeout(() => {
            router.push('/');
          }, 1500);
        }
      } else {
        showToast(data.message || 'Failed to save address', 'error');
      }
    } catch (error) {
      console.error('Error saving address:', error);
      showToast('An error occurred while saving address', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    // Continue without saving - redirect to checkout
    if (productId && quantity) {
      const userId = customerId || auth.currentUser?.uid || localStorage.getItem('userId') || '';
      const checkoutParams = new URLSearchParams({
        customerId: userId,
        productId,
        quantity,
        ...(variantId && { variantId }),
      });
      
      // Clear the checkout intent from sessionStorage
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('checkoutIntent');
      }
      
      router.push(`/checkout?${checkoutParams.toString()}`);
    } else {
      // No checkout intent, go home
      router.push('/');
    }
  };

  const handleClear = async () => {
    setIsLoading(true);
    try {
      // Get fresh token for this request
      const token = await getFirebaseIdToken();
      if (!token) {
        showToast('Authentication required', 'error');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/user/address`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        showToast('Address cleared successfully', 'success');
        setExistingAddress(null);
      } else {
        showToast('Failed to clear address', 'error');
      }
    } catch (error) {
      console.error('Error clearing address:', error);
      showToast('An error occurred while clearing address', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#00BCD4] to-[#0097A7] mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-[#00BCD4] hover:text-[#00838F] font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#00BCD4] to-[#0097A7] mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">D</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Manage Shipping Address</h1>
          <p className="text-slate-600">
            {existingAddress
              ? 'Update your delivery address'
              : 'Add your delivery address to continue'}
          </p>
        </div>

        {/* Address Form */}
        <AddressForm
          initialAddress={existingAddress}
          onSubmit={handleSubmit}
          onContinue={handleContinue}
          onClear={existingAddress ? handleClear : undefined}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
