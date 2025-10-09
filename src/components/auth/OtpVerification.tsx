'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  OtpVerificationRequest, 
  OtpVerificationResponse,
  FirebaseSignInRequest,
  AccountType
} from '@/types/auth';
import { ArrowLeft, RotateCcw, CheckCircle } from 'lucide-react';
import { firebasePhoneAuth } from '@/lib/auth/firebase-phone-auth';

interface OtpVerificationProps {
  phoneNumber: string;
  verificationId: string;
  accountType: AccountType;
  extraData?: Record<string, string>;
  onVerificationSuccess?: (userData: any) => void;
  onBack?: () => void;
  redirectPath?: string;
}

export default function OtpVerification({
  phoneNumber,
  verificationId,
  accountType,
  extraData,
  onVerificationSuccess,
  onBack,
  redirectPath = '/'
}: OtpVerificationProps) {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer effect
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otpCode?: string) => {
    const finalOtp = otpCode || otp.join('');
    
    if (finalOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Verify OTP with Firebase
      const verifyResult = await firebasePhoneAuth.verifyOTP(finalOtp);

      if (!verifyResult.success || !verifyResult.token) {
        throw new Error(verifyResult.error || 'Invalid OTP');
      }

      // Step 2: Register with backend using Firebase token
      const signInResponse = await fetch('/api/auth/firebase-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: verifyResult.token,
          accountType,
          extraData
        } as FirebaseSignInRequest),
      });

      if (!signInResponse.ok) {
        const errorData = await signInResponse.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const registrationData = await signInResponse.json();

      if (!registrationData.success) {
        throw new Error(registrationData.message || 'Registration failed');
      }

      // Success!
      if (onVerificationSuccess) {
        onVerificationSuccess(registrationData);
      }

      // Redirect to intended destination
      router.push(redirectPath);

    } catch (error) {
      console.error('OTP verification error:', error);
      setError(error instanceof Error ? error.message : 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await firebasePhoneAuth.sendOTP(phoneNumber);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to resend OTP');
      }
      
      // Reset timer and clear OTP
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/(\+91)(\d{5})(\d{5})/, '$1 $2 $3');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Phone Number</h1>
          <p className="text-gray-600 mt-2">
            We've sent a 6-digit code to
          </p>
          <p className="font-semibold text-gray-900">
            {formatPhoneNumber(phoneNumber)}
          </p>
        </div>

        {/* OTP Input */}
        <div className="mb-8">
          <div className="flex justify-center space-x-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`
                  w-12 h-12 text-center text-xl font-bold border-2 rounded-lg
                  focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${error ? 'border-red-500' : 'border-gray-300'}
                  ${digit ? 'bg-blue-50 border-blue-500' : ''}
                `}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          {/* Resend OTP */}
          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
              >
                <RotateCcw className="w-4 h-4 inline mr-1" />
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Resend OTP in {resendTimer} seconds
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="flex-1 flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </button>

          <button
            onClick={() => handleVerifyOtp()}
            disabled={isLoading || otp.some(digit => digit === '')}
            className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              'Verify'
            )}
          </button>
        </div>

        {/* Help text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              onClick={() => setError('Please check your SMS inbox or try resending the OTP')}
              className="text-blue-600 hover:text-blue-700"
            >
              Get help
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}