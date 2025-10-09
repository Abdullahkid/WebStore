'use client';

import { useState } from 'react';
import { firebasePhoneAuth } from '@/lib/auth/firebase-phone-auth';

export default function TestAuthPage() {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOTP = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('🧪 Testing Firebase OTP send to:', phoneNumber);
      const result = await firebasePhoneAuth.sendOTP(phoneNumber);
      
      if (result.success) {
        setVerificationId(result.verificationId || '');
        setMessage('✅ OTP sent successfully! Check your phone.');
      } else {
        setMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Test error:', error);
      setMessage(`❌ Test failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      console.log('🧪 Testing Firebase OTP verification:', otp);
      const result = await firebasePhoneAuth.verifyOTP(otp);
      
      if (result.success) {
        setMessage('✅ OTP verified successfully!');
        console.log('User:', result.user);
        console.log('Token:', result.token);
      } else {
        setMessage(`❌ Verification failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Verify error:', error);
      setMessage(`❌ Verification failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-8">🧪 Firebase Phone Auth Test</h1>
        
        {/* Phone Number Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="+91XXXXXXXXXX"
          />
        </div>

        {/* Send OTP Button */}
        <button
          onClick={handleSendOTP}
          disabled={loading || !phoneNumber}
          className="w-full mb-6 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Sending...' : 'Send OTP'}
        </button>

        {/* OTP Input */}
        {verificationId && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="123456"
                maxLength={6}
              />
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={loading || !otp}
              className="w-full mb-6 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}

        {/* Status Message */}
        {message && (
          <div className={`p-4 rounded-lg text-sm font-medium ${
            message.includes('✅') ? 'bg-green-50 text-green-700 border border-green-200' : 
            'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h3>
          <div className="text-xs text-gray-600 space-y-1">
            <div>Phone: {phoneNumber}</div>
            <div>Verification ID: {verificationId ? '✅ Set' : '❌ Not set'}</div>
            <div>OTP: {otp || 'Not entered'}</div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-700 mb-2">📋 Setup Required:</h3>
          <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
            <li>Add web app to Firebase project</li>
            <li>Enable Phone Authentication</li>
            <li>Update Firebase config</li>
            <li>Test with your phone number</li>
          </ol>
        </div>

        {/* Hidden reCAPTCHA container */}
        <div id="recaptcha-container" style={{ display: 'none' }}></div>
      </div>
    </div>
  );
}