'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export default function FirebaseComparePage() {
  const [configInfo, setConfigInfo] = useState<any>({});
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    collectConfigInfo();
  }, []);

  const collectConfigInfo = () => {
    const config = auth.app.options;
    
    const info = {
      webConfig: {
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
        measurementId: config.measurementId
      },
      
      // Expected Android config (from your mobile app)
      expectedAndroidConfig: {
        projectId: 'sigma2-25a57',
        authDomain: 'sigma2-25a57.firebaseapp.com',
        // Android apps typically have different app IDs
        appId: 'Should start with 1:145044904314:android:...',
        messagingSenderId: '145044904314'
      },
      
      validation: {
        projectIdMatch: config.projectId === 'sigma2-25a57',
        authDomainMatch: config.authDomain === 'sigma2-25a57.firebaseapp.com',
        messagingSenderMatch: config.messagingSenderId === '145044904314',
        isWebAppId: config.appId?.includes(':web:'),
        hasValidWebAppId: config.appId === '1:145044904314:web:f1adf116d91105120d1ec3'
      }
    };

    setConfigInfo(info);
    
    addLog('🔍 Configuration Analysis Complete');
    addLog(`📱 Project ID: ${info.validation.projectIdMatch ? '✅' : '❌'} ${config.projectId}`);
    addLog(`🌐 Auth Domain: ${info.validation.authDomainMatch ? '✅' : '❌'} ${config.authDomain}`);
    addLog(`📨 Sender ID: ${info.validation.messagingSenderMatch ? '✅' : '❌'} ${config.messagingSenderId}`);
    addLog(`🆔 Web App ID: ${info.validation.isWebAppId ? '✅' : '❌'} ${config.appId?.substring(0, 40)}...`);
    addLog(`✅ Valid Web ID: ${info.validation.hasValidWebAppId ? '✅' : '❌'}`);
  };

  const testDirectFirebaseCall = async () => {
    addLog('🧪 Testing direct Firebase Auth call...');
    
    try {
      // Test basic Firebase auth functionality
      const { connectAuthEmulator, getAuth } = await import('firebase/auth');
      
      addLog(`📋 Firebase Auth instance: ${auth ? '✅ Available' : '❌ Not Available'}`);
      addLog(`📋 Current user: ${auth.currentUser ? `✅ ${auth.currentUser.uid}` : '❌ Not signed in'}`);
      
      // Test if we can access Firebase auth methods
      addLog('🔧 Testing Firebase auth methods...');
      
      const authMethods = [
        'signInWithPhoneNumber',
        'RecaptchaVerifier',
        'PhoneAuthProvider'
      ];
      
      for (const method of authMethods) {
        try {
          const authModule = await import('firebase/auth');
          const hasMethod = method in authModule;
          addLog(`  - ${method}: ${hasMethod ? '✅' : '❌'}`);
        } catch (e) {
          addLog(`  - ${method}: ❌ Import failed`);
        }
      }
      
    } catch (error: any) {
      addLog(`❌ Firebase test error: ${error.message}`);
    }
  };

  const checkFirebaseConsoleSettings = () => {
    addLog('📋 Firebase Console Checklist:');
    addLog('1. ✅ Phone Authentication: Already enabled (mobile works)');
    addLog('2. 🔍 Web App Registration: Check if web app exists');
    addLog('3. 🔍 Authorized Domains: localhost should be there');
    addLog('4. 🔍 API Keys: Web API key should be unrestricted or allow auth');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-purple-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🔄 Mobile vs Web Firebase Comparison</h1>
            <p className="text-purple-100 mt-1">Since mobile works but web doesn't, let's compare configurations</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">✅ Mobile App (Working)</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Phone authentication works</li>
                  <li>• 2 users already registered</li>
                  <li>• Uses Android SDK</li>
                  <li>• SHA certificates for auth</li>
                </ul>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="font-semibold text-red-800 mb-2">❌ Web App (Failing)</h3>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Gets auth/invalid-app-credential</li>
                  <li>• Domain is authorized (reCAPTCHA works)</li>
                  <li>• Uses Web SDK</li>
                  <li>• Domain-based authorization</li>
                </ul>
              </div>
            </div>

            {/* Configuration Comparison */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">🔍 Configuration Analysis</h3>
              <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-64">
                {JSON.stringify(configInfo, null, 2)}
              </pre>
            </div>

            {/* Test Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={testDirectFirebaseCall}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700"
              >
                🧪 Test Firebase Methods
              </button>
              
              <button
                onClick={checkFirebaseConsoleSettings}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700"
              >
                📋 Console Checklist
              </button>
            </div>

            {/* Critical Checks */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">🚨 Critical Web App Checks</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-600">1.</span>
                  <div>
                    <p className="font-medium">Web App Registration</p>
                    <p className="text-yellow-700">Go to Firebase Console → Project Settings → Your Apps</p>
                    <p className="text-yellow-700">Verify you have a WEB app (not just Android)</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-600">2.</span>
                  <div>
                    <p className="font-medium">API Key Restrictions</p>
                    <p className="text-yellow-700">Go to Google Cloud Console → APIs & Services → Credentials</p>
                    <p className="text-yellow-700">Check if web API key has restrictions that block auth</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-600">3.</span>
                  <div>
                    <p className="font-medium">Phone Auth for Web</p>
                    <p className="text-yellow-700">In Firebase Console → Authentication → Sign-in method</p>
                    <p className="text-yellow-700">Verify Phone is enabled for BOTH mobile AND web</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Logs */}
            <div className="bg-black rounded-lg p-4">
              <h3 className="text-white font-semibold mb-3">📋 Analysis Logs</h3>
              <div className="bg-gray-900 rounded p-3 max-h-64 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-400 text-sm">Analysis will appear here...</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://console.firebase.google.com/project/sigma2-25a57/settings/general"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-blue-700"
              >
                🔧 Project Settings
              </a>
              <a
                href="https://console.firebase.google.com/project/sigma2-25a57/authentication/providers"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-green-700"
              >
                📱 Auth Providers
              </a>
              <a
                href="https://console.cloud.google.com/apis/credentials?project=sigma2-25a57"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-red-700"
              >
                🔑 API Keys
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}