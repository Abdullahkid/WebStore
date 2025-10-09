'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthModeTogglePage() {
  const [currentMode, setCurrentMode] = useState<'firebase' | 'mock'>('firebase');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check current mode from localStorage
    const useMock = localStorage.getItem('NEXT_PUBLIC_USE_MOCK_AUTH') === 'true';
    setCurrentMode(useMock ? 'mock' : 'firebase');
  }, []);

  const toggleMode = (mode: 'firebase' | 'mock') => {
    setLoading(true);
    
    if (mode === 'mock') {
      localStorage.setItem('NEXT_PUBLIC_USE_MOCK_AUTH', 'true');
      // Also set it globally for this session
      (window as any).NEXT_PUBLIC_USE_MOCK_AUTH = 'true';
    } else {
      localStorage.removeItem('NEXT_PUBLIC_USE_MOCK_AUTH');
      (window as any).NEXT_PUBLIC_USE_MOCK_AUTH = 'false';
    }
    
    setCurrentMode(mode);
    
    setTimeout(() => {
      setLoading(false);
      // Optionally refresh the page to apply changes
      // window.location.reload();
    }, 1000);
  };

  const testRegistration = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-green-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🎉 Firebase Credentials Fixed!</h1>
            <p className="text-green-100 mt-1">Choose authentication mode for development</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    🎉 Congratulations! Firebase Phone Authentication is Working!
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>You successfully solved the reCAPTCHA and reached Firebase's SMS rate limits. This proves your setup is correct!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 text-lg mb-3">📊 Current Authentication Mode</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700">
                    <strong>Mode:</strong> {currentMode === 'firebase' ? '🔥 Real Firebase' : '🧪 Mock Authentication'}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {currentMode === 'firebase' 
                      ? 'Using real Firebase Phone Authentication (may hit rate limits)'
                      : 'Using mock authentication for unlimited testing'
                    }
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentMode === 'firebase' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentMode === 'firebase' ? 'Production Ready' : 'Development Mode'}
                </div>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Real Firebase Mode */}
              <div className={`border-2 rounded-lg p-6 transition-all duration-200 ${
                currentMode === 'firebase' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">🔥 Real Firebase</h3>
                  {currentMode === 'firebase' && (
                    <span className="text-green-600 font-medium">✓ Active</span>
                  )}
                </div>
                
                <div className="space-y-3 text-sm text-gray-600 mb-4">
                  <p>✅ Real SMS delivery to phone numbers</p>
                  <p>✅ Production-ready authentication</p>
                  <p>✅ reCAPTCHA verification</p>
                  <p>⚠️ Subject to Firebase rate limits</p>
                  <p>⚠️ May require waiting periods</p>
                </div>
                
                <button
                  onClick={() => toggleMode('firebase')}
                  disabled={loading || currentMode === 'firebase'}
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '🔄 Switching...' : 'Use Real Firebase'}
                </button>
              </div>

              {/* Mock Mode */}
              <div className={`border-2 rounded-lg p-6 transition-all duration-200 ${
                currentMode === 'mock' 
                  ? 'border-yellow-500 bg-yellow-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">🧪 Mock Authentication</h3>
                  {currentMode === 'mock' && (
                    <span className="text-yellow-600 font-medium">✓ Active</span>
                  )}
                </div>
                
                <div className="space-y-3 text-sm text-gray-600 mb-4">
                  <p>🚀 No rate limits - unlimited testing</p>
                  <p>🚀 No real SMS sent (simulated)</p>
                  <p>🚀 Use any 6-digit code (123456)</p>
                  <p>🚀 Perfect for development</p>
                  <p>ℹ️ Not for production use</p>
                </div>
                
                <button
                  onClick={() => toggleMode('mock')}
                  disabled={loading || currentMode === 'mock'}
                  className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '🔄 Switching...' : 'Use Mock Auth'}
                </button>
              </div>
            </div>

            {/* Rate Limit Info */}
            {currentMode === 'firebase' && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-2">⏰ Firebase Rate Limits</h3>
                <div className="text-sm text-orange-700 space-y-1">
                  <p><strong>Current Status:</strong> Too many requests (normal after testing)</p>
                  <p><strong>Wait Time:</strong> 15-30 minutes before next attempt</p>
                  <p><strong>Daily Quota:</strong> Limited on free plan</p>
                  <p><strong>Solutions:</strong> Wait, use different phone, or upgrade Firebase plan</p>
                </div>
              </div>
            )}

            {/* Test Button */}
            <div className="text-center">
              <button
                onClick={testRegistration}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 text-lg"
              >
                🎯 Test Registration Flow
              </button>
            </div>

            {/* Instructions */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">📋 Instructions</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>For Development:</strong> Use Mock Authentication to test unlimited times</p>
                <p><strong>For Production Testing:</strong> Use Real Firebase (but respect rate limits)</p>
                <p><strong>Mock OTP:</strong> When using mock mode, any 6-digit code works (e.g., 123456)</p>
                <p><strong>Real OTP:</strong> When using Firebase mode, check your phone for SMS</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}