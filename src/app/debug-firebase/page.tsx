'use client';

import { useState, useEffect } from 'react';
import { firebasePhoneAuth } from '@/lib/auth/firebase-phone-auth';
import { auth } from '@/lib/firebase';

export default function DebugFirebasePage() {
  const [phoneNumber, setPhoneNumber] = useState('+91'); // Default India code
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    // Collect Firebase debug information
    const collectDebugInfo = () => {
      const info = {
        firebaseConfig: {
          apiKey: auth.app.options.apiKey?.substring(0, 10) + '...',
          authDomain: auth.app.options.authDomain,
          projectId: auth.app.options.projectId,
          appId: auth.app.options.appId?.substring(0, 20) + '...',
        },
        environment: {
          isDevelopment: process.env.NODE_ENV === 'development',
          userAgent: navigator.userAgent,
          url: window.location.href,
          isLocalhost: window.location.hostname === 'localhost',
        },
        authState: {
          currentUser: auth.currentUser?.uid || 'null',
          authDomain: auth.app.options.authDomain,
        }
      };
      setDebugInfo(info);
      addLog('🔍 Debug info collected');
    };

    collectDebugInfo();
  }, []);

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      addLog('❌ Please enter a valid phone number');
      return;
    }

    setLoading(true);
    addLog(`📱 Attempting to send OTP to: ${phoneNumber}`);
    addLog(`🔧 Environment: ${process.env.NODE_ENV}`);
    addLog(`🌐 Auth domain: ${auth.app.options.authDomain}`);
    addLog(`📱 Project ID: ${auth.app.options.projectId}`);

    try {
      const result = await firebasePhoneAuth.sendOTP(phoneNumber);
      
      if (result.success) {
        setVerificationId(result.verificationId || '');
        addLog(`✅ OTP sent successfully!`);
        addLog(`🔑 Verification ID: ${result.verificationId?.substring(0, 20)}...`);
        addLog(`📨 Check your phone for SMS`);
      } else {
        addLog(`❌ Failed to send OTP: ${result.error}`);
      }
    } catch (error: any) {
      addLog(`💥 Exception: ${error.message}`);
      console.error('Send OTP Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp || otp.length < 4) {
      addLog('❌ Please enter a valid OTP');
      return;
    }

    setLoading(true);
    addLog(`🔐 Verifying OTP: ${otp}`);

    try {
      const result = await firebasePhoneAuth.verifyOTP(otp);
      
      if (result.success) {
        addLog(`✅ OTP verified successfully!`);
        addLog(`👤 User ID: ${result.user?.uid}`);
        addLog(`📱 Phone: ${result.user?.phoneNumber}`);
      } else {
        addLog(`❌ Failed to verify OTP: ${result.error}`);
      }
    } catch (error: any) {
      addLog(`💥 Exception: ${error.message}`);
      console.error('Verify OTP Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🔥 Firebase Phone Auth Debug</h1>
            <p className="text-red-100 mt-1">Diagnose OTP delivery issues</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Debug Information */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3">🔍 Debug Information</h2>
              <pre className="text-sm bg-white p-3 rounded border overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>

            {/* Important Checks */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-3 text-yellow-800">⚠️ Important Checks</h2>
              <div className="text-sm text-yellow-700 space-y-2">
                <div>
                  <strong>1. Phone Authentication Enabled:</strong> Visit{' '}
                  <a 
                    href="https://console.firebase.google.com/project/sigma2-25a57/authentication/providers" 
                    target="_blank" 
                    className="text-blue-600 underline"
                  >
                    Firebase Console → Authentication → Sign-in method
                  </a>{' '}
                  and ensure "Phone" is enabled
                </div>
                <div>
                  <strong>2. Authorized Domains:</strong> Check if <code>localhost</code> is in authorized domains
                </div>
                <div>
                  <strong>3. Phone Format:</strong> Use international format like +91XXXXXXXXXX
                </div>
                <div>
                  <strong>4. SMS Quota:</strong> Firebase has daily SMS limits for new projects
                </div>
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (with country code)
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <button
                onClick={sendOTP}
                disabled={loading}
                className="w-full bg-red-600 text-white py-3 px-4 rounded-md font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔄 Sending OTP...' : '📨 Send OTP'}
              </button>
            </div>

            {/* OTP Verification */}
            {verificationId && (
              <div className="space-y-4 border-t pt-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <button
                  onClick={verifyOTP}
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '🔄 Verifying...' : '🔐 Verify OTP'}
                </button>
              </div>
            )}

            {/* Logs */}
            <div className="bg-black rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white">📋 Debug Logs</h2>
                <button
                  onClick={clearLogs}
                  className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="bg-gray-900 rounded p-3 max-h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-400 text-sm">No logs yet...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-green-400 text-sm font-mono">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* reCAPTCHA Container */}
            <div id="recaptcha-container" style={{ display: 'none' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}