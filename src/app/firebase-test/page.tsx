'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { firebasePhoneAuth } from '@/lib/auth/firebase-phone-auth';

export default function FirebaseTestPage() {
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    addLog('🚀 Firebase Test Page Loaded');
    addLog('🔧 Environment: ' + process.env.NODE_ENV);
    // Only access window on client side to avoid hydration issues
    if (typeof window !== 'undefined') {
      addLog('🌐 URL: ' + window.location.href);
    }
  }, []);

  const testStep1_FirebaseConfig = () => {
    addLog('=== STEP 1: Testing Firebase Configuration ===');
    
    try {
      const config = auth.app.options;
      addLog('✅ Firebase app initialized');
      addLog(`📋 Project ID: ${config.projectId}`);
      addLog(`🌐 Auth Domain: ${config.authDomain}`);
      addLog(`🆔 App ID: ${config.appId?.substring(0, 30)}...`);
      addLog(`🔑 API Key: ${config.apiKey?.substring(0, 20)}...`);
      
      if (config.projectId && config.authDomain && config.appId && config.apiKey) {
        addLog('✅ All required config fields present');
        setStep(2);
      } else {
        addLog('❌ Missing required config fields');
      }
    } catch (error: any) {
      addLog(`❌ Firebase config error: ${error.message}`);
    }
  };

  const testStep2_DOMSetup = () => {
    addLog('=== STEP 2: Testing DOM Setup ===');
    
    try {
      // Check if recaptcha container exists
      let container = document.getElementById('recaptcha-container');
      if (!container) {
        addLog('📦 Creating reCAPTCHA container...');
        container = document.createElement('div');
        container.id = 'recaptcha-container';
        container.style.display = 'block';
        container.style.border = '1px solid #ccc';
        container.style.padding = '10px';
        container.style.margin = '10px 0';
        document.body.appendChild(container);
        addLog('✅ reCAPTCHA container created');
      } else {
        addLog('✅ reCAPTCHA container already exists');
        container.style.display = 'block';
      }
      
      addLog(`📋 Container ID: ${container.id}`);
      addLog(`📋 Container in DOM: ${Boolean(document.getElementById('recaptcha-container'))}`);
      setStep(3);
      
    } catch (error: any) {
      addLog(`❌ DOM setup error: ${error.message}`);
    }
  };

  const testStep3_SendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      addLog('❌ Please enter a valid phone number first');
      return;
    }

    addLog('=== STEP 3: Testing OTP Send ===');
    setLoading(true);

    try {
      addLog(`📱 Testing with phone: ${phoneNumber}`);
      
      const result = await firebasePhoneAuth.sendOTP(phoneNumber);
      
      if (result.success) {
        addLog('🎉 SUCCESS! OTP sent successfully');
        addLog(`🔑 Verification ID: ${result.verificationId?.substring(0, 20)}...`);
        addLog('📨 Check your phone for SMS');
      } else {
        addLog(`❌ Failed: ${result.error}`);
      }
      
    } catch (error: any) {
      addLog(`💥 Exception: ${error.message}`);
      addLog(`🔍 Error code: ${error.code || 'unknown'}`);
      addLog(`🔍 Full error: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🧪 Firebase Auth Test - Step by Step</h1>
            <p className="text-blue-100 mt-1">Debug auth/invalid-app-credential issue</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Phone Number Input */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (with country code)
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91XXXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Test Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={testStep1_FirebaseConfig}
                className={`p-4 rounded-lg font-medium ${
                  step >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                🔧 Step 1: Test Config
              </button>
              
              <button
                onClick={testStep2_DOMSetup}
                disabled={step < 2}
                className={`p-4 rounded-lg font-medium ${
                  step >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}
              >
                📦 Step 2: Setup DOM
              </button>
              
              <button
                onClick={testStep3_SendOTP}
                disabled={step < 3 || loading}
                className={`p-4 rounded-lg font-medium ${
                  step >= 3 && !loading ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {loading ? '🔄 Sending...' : '📨 Step 3: Send OTP'}
              </button>
            </div>

            {/* Clear Button */}
            <div className="text-center">
              <button
                onClick={clearLogs}
                className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700"
              >
                🗑️ Clear & Restart
              </button>
            </div>

            {/* Logs */}
            <div className="bg-black rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">📋 Test Logs</h3>
              <div className="bg-gray-900 rounded p-3 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-400 text-sm">Click Step 1 to start testing...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-green-400 text-sm font-mono mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">📊 Current Status</h3>
              <div className="text-sm text-yellow-700">
                <p><strong>Current Step:</strong> {step}/3</p>
                <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
                <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server'}</p>
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