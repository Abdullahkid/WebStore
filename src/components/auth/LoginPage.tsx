'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Phone, Lock, User, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { showToast } from '@/lib/toast';
import { AccountType } from '@/types/user';
import { authService } from '@/lib/auth/authService';
import { userStorage } from '@/lib/storage/userStorage';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [accountType, setAccountType] = useState<AccountType>(AccountType.PERSONAL);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validatePhoneNumber = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit phone number');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = (pass: string): boolean => {
    if (pass.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    // Validate inputs
    const isPhoneValid = validatePhoneNumber(phoneNumber);
    const isPasswordValid = validatePassword(password);

    if (!isPhoneValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const fullPhoneNumber = `+91${cleanPhone}`;

      // Use authService for login
      const loginResponse = await authService.loginWithPhonePassword(fullPhoneNumber, password, accountType);

      if (loginResponse.success) {
        // Check if there's a buy now intent saved
        const buyNowIntent = sessionStorage.getItem('buyNowIntent');
        const checkoutIntent = sessionStorage.getItem('checkoutIntent');

        if (buyNowIntent || checkoutIntent) {
          // User was trying to buy something - check if they have address
          const hasAddress = await userStorage.hasAddress();

          if (!hasAddress) {
            showToast('Please add your delivery address', 'info');
            router.push('/address');
            return;
          }

          // Has address - redirect to checkout
          const intent = JSON.parse(buyNowIntent || checkoutIntent || '{}');
          const userId = localStorage.getItem('userId');
          const checkoutParams = new URLSearchParams({
            customerId: userId || '',
            productId: intent.productId || '',
            quantity: intent.quantity?.toString() || '1',
            ...(intent.variantId && { variantId: intent.variantId }),
          });

          // Clear the intent
          sessionStorage.removeItem('buyNowIntent');
          sessionStorage.removeItem('checkoutIntent');

          router.push(`/checkout?${checkoutParams.toString()}`);
          return;
        }

        // Check if personal user has an address for normal login flow
        if (loginResponse.accountType === AccountType.PERSONAL) {
          const hasAddress = await userStorage.hasAddress();

          if (!hasAddress) {
            showToast('Please add your delivery address', 'info');
            router.push('/address');
            return;
          }
        }

        // Redirect to original page or home
        router.push(redirectPath);
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      showToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(cleaned);
    if (phoneError) setPhoneError('');
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (passwordError) setPasswordError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#00BCD4] to-[#0097A7] mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">D</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome Back!</h1>
          <p className="text-slate-600">Sign in to continue your journey.</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          {/* Account Type Selector */}
          <div className="mb-6">
            <p className="text-sm text-slate-600 text-center mb-3">I'm logging in as a</p>
            <div className="flex gap-2 p-1 bg-slate-100 rounded-full">
              <button
                onClick={() => setAccountType(AccountType.PERSONAL)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold transition-all duration-200 ${accountType === AccountType.PERSONAL
                  ? 'bg-[#00BCD4] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <User className="w-4 h-4" />
                Personal
              </button>
              <button
                onClick={() => setAccountType(AccountType.BUSINESS)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full font-semibold transition-all duration-200 ${accountType === AccountType.BUSINESS
                  ? 'bg-[#00BCD4] text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Building2 className="w-4 h-4" />
                Business
              </button>
            </div>
          </div>

          {/* Phone Number Field */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-600">
                <Phone className="w-5 h-5 text-[#00BCD4]" />
                <span className="text-base font-medium">+91</span>
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="XXXXX XXXXX"
                className={`w-full pl-24 pr-4 py-3 border-2 rounded-xl text-base transition-all ${phoneError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:border-[#00BCD4]'
                  } focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/20`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('password-input')?.focus();
                  }
                }}
              />
            </div>
            {phoneError && <p className="mt-2 text-sm text-red-600">{phoneError}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00BCD4]" />
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Enter your password"
                className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl text-base transition-all ${passwordError
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-slate-200 focus:border-[#00BCD4]'
                  } focus:outline-none focus:ring-2 focus:ring-[#00BCD4]/20`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
            </div>
            {passwordError && <p className="mt-2 text-sm text-red-600">{passwordError}</p>}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => showToast('Password reset feature coming soon', 'info')}
              className="text-sm text-[#00BCD4] hover:text-[#00838F] font-semibold transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-14 bg-gradient-to-r from-[#00BCD4] to-[#0097A7] hover:from-[#00838F] hover:to-[#006978] text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing In...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Sign In
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </div>

        {/* Sign Up Prompt */}
        <div className="mt-6 text-center">
          <p className="text-slate-600">
            New User?{' '}
            <button
              onClick={() => router.push('/register')}
              className="text-[#00BCD4] hover:text-[#00838F] font-bold transition-colors"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
