'use client';

import { useState } from 'react';
import { firebasePhoneAuth } from '@/lib/auth/firebase-phone-auth';

export default function TestPhoneDebugPage() {
  const [phoneNumber, setPhoneNumber] = useState('+91555');
  const [testOtp, setTestOtp] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState('');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testSendOTP = async () => {
    if (!phoneNumber.startsWith('+91555')) {
      addLog('❌ Please use a Firebase test phone number starting with +91555');
      return;
    }

    setLoading(true);
    addLog('🚀 Testing Firebase test phone number...');
    addLog(`📱 Phone: ${phoneNumber}`);

    try {
      const result = await firebasePhoneAuth.sendOTP(phoneNumber);
      
      if (result.success) {
        addLog('✅ OTP sent successfully!');
        addLog(`🔑 Verification ID: ${result.verificationId?.substring(0, 30)}...`);
        setVerificationId(result.verificationId || '');
        addLog('💡 For test numbers, no SMS is sent. Use your predefined OTP.');
      } else {
        addLog(`❌ Failed: ${result.error}`);
      }

    } catch (error: any) {
      addLog(`💥 Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testVerifyOTP = async () => {
    if (!testOtp || testOtp.length !== 6) {
      addLog('❌ Please enter exactly 6 digits for OTP');
      return;
    }

    if (!verificationId) {
      addLog('❌ Please send OTP first');
      return;
    }

    setLoading(true);
    addLog(`🔐 Testing OTP verification...`);
    addLog(`📱 Phone: ${phoneNumber}`);
    addLog(`🔢 OTP: ${testOtp}`);

    try {
      const result = await firebasePhoneAuth.verifyOTP(testOtp);
      
      if (result.success) {
        addLog('🎉 SUCCESS! Test phone number OTP verified!');
        addLog(`👤 User ID: ${result.user?.uid}`);
        addLog(`📱 Phone: ${result.user?.phoneNumber}`);
      } else {
        addLog(`❌ Verification failed: ${result.error}`);
        addLog('🔍 Common issues with test phone numbers:');
        addLog('  1. OTP doesn\'t match what you set in Firebase Console');
        addLog('  2. Test phone number format is incorrect');
        addLog('  3. Test phone number not properly configured in Firebase');
      }

    } catch (error: any) {
      addLog(`💥 Exception: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkFirebaseTestNumbers = () => {
    addLog('=== FIREBASE TEST PHONE NUMBERS GUIDE ===');
    addLog('1. Go to Firebase Console:');
    addLog('   https://console.firebase.google.com/project/sigma2-25a57/authentication/settings');
    addLog('2. Scroll to "Phone numbers for testing"');
    addLog('3. Your test numbers should look like:');
    addLog('   Phone: +915551234567 → Code: 123456');
    addLog('   Phone: +915559876543 → Code: 654321');
    addLog('4. IMPORTANT: Use EXACT format from Firebase Console');
    addLog('5. IMPORTANT: Use EXACT OTP from Firebase Console');
    addLog('6. NO SMS is sent for test numbers');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🧪 Firebase Test Phone Numbers Debug</h1>
            <p className="text-purple-100 mt-1">Specific testing for Firebase test phone numbers</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">📋 Firebase Test Phone Numbers</h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p><strong>1. Setup:</strong> Add test numbers in Firebase Console → Authentication → Settings</p>
                <p><strong>2. Format:</strong> +91555XXXXXXX (must start with +91555)</p>
                <p><strong>3. No SMS:</strong> Test numbers don't send real SMS</p>
                <p><strong>4. Predefined OTP:</strong> Use the exact OTP you set in Firebase Console</p>
              </div>
            </div>

            {/* Test Phone Number Input */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">📱 Test Phone Number</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="testPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Firebase Test Phone Number
                  </label>
                  <input
                    id="testPhone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+915551234567"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Must start with +91555 for testing</p>
                </div>

                <button
                  onClick={testSendOTP}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '🔄 Sending...' : '📨 Send Test OTP'}
                </button>
              </div>
            </div>

            {/* OTP Verification */}
            {verificationId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-3">🔐 Test OTP Verification</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="testOtpInput" className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Your Predefined Test OTP
                    </label>
                    <input
                      id="testOtpInput"
                      type="text"
                      value={testOtp}
                      onChange={(e) => setTestOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
                      placeholder="123456"
                      maxLength={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use the exact OTP from Firebase Console</p>
                  </div>

                  <button
                    onClick={testVerifyOTP}
                    disabled={loading || testOtp.length !== 6}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? '🔄 Verifying...' : '🔐 Verify Test OTP'}
                  </button>
                </div>
              </div>
            )}

            {/* Helper Button */}
            <div className="text-center">
              <button
                onClick={checkFirebaseTestNumbers}
                className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700"
              >
                📋 How to Configure Test Numbers
              </button>
            </div>

            {/* Debug Logs */}
            <div className="bg-black rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-semibold">📋 Test Debug Logs</h3>
                <button
                  onClick={clearLogs}
                  className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="bg-gray-900 rounded p-3 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-400 text-sm">Test logs will appear here...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-green-400 text-xs font-mono mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://console.firebase.google.com/project/sigma2-25a57/authentication/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-red-700"
              >
                🔧 Firebase Console Settings
              </a>
              <a
                href="/register"
                className="bg-purple-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-purple-700"
              >
                🎯 Test Full Registration
              </a>
            </div>

            {/* Current Status */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">📊 Current Status</h3>
              <div className="text-sm text-gray-700">
                <p><strong>Phone:</strong> {phoneNumber}</p>
                <p><strong>Verification ID:</strong> {verificationId ? 'Available' : 'Not set'}</p>
                <p><strong>Test OTP:</strong> {testOtp || 'Not entered'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}