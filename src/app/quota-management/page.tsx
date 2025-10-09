'use client';

import { useState, useEffect } from 'react';
import { firebasePhoneAuth } from '@/lib/auth/firebase-phone-auth';

export default function QuotaManagementPage() {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [logs, setLogs] = useState<string[]>([]);
  const [waitTime, setWaitTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);

  const addLog = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
      info: 'ℹ️',
      error: '❌', 
      success: '✅',
      warning: '⚠️'
    }[type];
    setLogs(prev => [...prev, `[${timestamp}] ${emoji} ${message}`]);
  };

  useEffect(() => {
    // Check if we're in a cooldown period
    const stored = localStorage.getItem('firebase-last-request');
    if (stored) {
      const lastTime = parseInt(stored);
      const now = Date.now();
      const elapsed = now - lastTime;
      const cooldown = 15 * 60 * 1000; // 15 minutes
      
      if (elapsed < cooldown) {
        const remaining = Math.ceil((cooldown - elapsed) / 1000);
        setWaitTime(remaining);
        setLastRequestTime(lastTime);
      }
    }
  }, []);

  useEffect(() => {
    if (waitTime > 0) {
      const timer = setTimeout(() => setWaitTime(waitTime - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [waitTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const testWithCooldown = async () => {
    if (waitTime > 0) {
      addLog(`Please wait ${formatTime(waitTime)} before trying again`, 'warning');
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      addLog('Please enter a valid phone number', 'error');
      return;
    }

    setLoading(true);
    addLog(`Attempting to send OTP to ${phoneNumber}...`, 'info');

    try {
      const result = await firebasePhoneAuth.sendOTP(phoneNumber);

      if (result.success) {
        addLog('✅ SUCCESS! OTP sent successfully', 'success');
        addLog('Check your phone for SMS', 'success');
        
        // Store successful request time
        localStorage.setItem('firebase-last-request', Date.now().toString());
        
      } else {
        addLog(`Failed: ${result.error}`, 'error');
        
        // Check if it's a quota/rate limit error
        if (result.error?.includes('too many requests') || result.error?.includes('quota')) {
          const cooldownTime = 15 * 60; // 15 minutes
          setWaitTime(cooldownTime);
          localStorage.setItem('firebase-last-request', Date.now().toString());
          addLog(`Rate limited. Please wait ${formatTime(cooldownTime)}`, 'warning');
        }
      }

    } catch (error: any) {
      addLog(`Exception: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const clearCooldown = () => {
    localStorage.removeItem('firebase-last-request');
    setWaitTime(0);
    setLastRequestTime(null);
    addLog('Cooldown cleared', 'success');
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-green-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🎉 Firebase Credentials Fixed!</h1>
            <p className="text-green-100 mt-1">Now managing SMS quota and rate limits</p>
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
                    Great! Your Firebase credentials are working
                  </h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>The "Too many requests" error means Firebase is now recognizing your app, but you've hit the SMS rate limits.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            {waitTime > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 text-lg mb-2">
                  ⏰ Rate Limited - Please Wait
                </h3>
                <div className="text-yellow-700">
                  <p className="text-2xl font-bold">{formatTime(waitTime)}</p>
                  <p className="text-sm">Remaining cooldown time</p>
                  {lastRequestTime && (
                    <p className="text-xs mt-2">
                      Last request: {new Date(lastRequestTime).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            )}

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={testWithCooldown}
                  disabled={loading || waitTime > 0}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '🔄 Sending...' : waitTime > 0 ? `⏰ Wait ${formatTime(waitTime)}` : '📨 Send OTP'}
                </button>

                <button
                  onClick={clearCooldown}
                  className="bg-gray-600 text-white px-4 py-3 rounded-md font-medium hover:bg-gray-700"
                >
                  Clear Cooldown
                </button>
              </div>
            </div>

            {/* Information Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* SMS Quota Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-3">📱 Firebase SMS Quota</h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p><strong>Free Plan:</strong> Limited SMS per day</p>
                  <p><strong>Rate Limit:</strong> Max requests per minute/hour</p>
                  <p><strong>Per Phone:</strong> Limited attempts per phone number</p>
                  <p><strong>Reset:</strong> Quotas reset daily at midnight UTC</p>
                </div>
              </div>

              {/* Solutions */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-800 mb-3">💡 Solutions</h3>
                <div className="text-sm text-purple-700 space-y-2">
                  <p><strong>Wait:</strong> 15-30 minutes between requests</p>
                  <p><strong>Different Phone:</strong> Try another phone number</p>
                  <p><strong>Tomorrow:</strong> Daily quota resets at midnight</p>
                  <p><strong>Upgrade:</strong> Firebase Blaze plan for higher limits</p>
                </div>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-black rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold text-white">📋 Test Logs</h2>
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
                    <div key={index} className="text-green-400 text-sm font-mono mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/register"
                className="bg-green-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-green-700"
              >
                🎯 Test Registration Flow
              </a>
              <a
                href="/firebase-debug"
                className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-blue-700"
              >
                🐛 Debug Firebase
              </a>
              <a
                href="https://console.firebase.google.com/project/sigma2-25a57/usage"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-purple-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-purple-700"
              >
                📊 Check Firebase Usage
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}