'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export default function FirebaseCredentialFixPage() {
  const [diagnostics, setDiagnostics] = useState<any>({});
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    // Collect comprehensive diagnostic info
    const collectDiagnostics = () => {
      const info = {
        firebaseConfig: {
          apiKey: auth.app.options.apiKey?.substring(0, 10) + '...',
          authDomain: auth.app.options.authDomain,
          projectId: auth.app.options.projectId,
          appId: auth.app.options.appId,
          messagingSenderId: auth.app.options.messagingSenderId,
        },
        environment: {
          isDevelopment: process.env.NODE_ENV === 'development',
          hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
          port: typeof window !== 'undefined' ? window.location.port : 'unknown',
          protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
          url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        },
        authState: {
          currentUser: auth.currentUser?.uid || null,
          isConfigured: Boolean(auth.app.options.appId && auth.app.options.apiKey),
        }
      };
      setDiagnostics(info);
      
      addLog('🔍 Diagnostic information collected');
      addLog(`📱 Project ID: ${info.firebaseConfig.projectId}`);
      addLog(`🌐 Auth Domain: ${info.firebaseConfig.authDomain}`);
      addLog(`🔑 App ID exists: ${Boolean(info.firebaseConfig.appId)}`);
      addLog(`🖥️ Running on: ${info.environment.hostname}:${info.environment.port}`);
    };

    collectDiagnostics();
  }, []);

  const testFirebaseConnection = async () => {
    setLoading(true);
    addLog('🧪 Testing Firebase connection...');

    try {
      // Test 1: Check if Firebase is initialized
      addLog('✅ Firebase app initialized');
      addLog(`📋 App name: ${auth.app.name}`);
      
      // Test 2: Check auth domain
      const authDomain = auth.app.options.authDomain;
      addLog(`🌐 Auth domain: ${authDomain}`);
      
      // Test 3: Test if we can access Firebase Auth
      addLog(`👤 Current user: ${auth.currentUser ? 'Signed in' : 'Not signed in'}`);
      
      // Test 4: Check configuration completeness
      const config = auth.app.options as any;
      const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
      const missingFields = requiredFields.filter(field => !config[field]);
      
      if (missingFields.length > 0) {
        addLog(`❌ Missing config fields: ${missingFields.join(', ')}`);
      } else {
        addLog('✅ All required config fields present');
      }
      
      addLog('✅ Firebase connection test completed');
      
    } catch (error: any) {
      addLog(`❌ Firebase connection error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🔧 Fix Firebase auth/invalid-app-credential</h1>
            <p className="text-red-100 mt-1">Complete diagnostic and step-by-step fix</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Critical Error Alert */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Firebase Error: auth/invalid-app-credential
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>This error means Firebase doesn't recognize your web app. Follow the steps below to fix it.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Fix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Left Column - Steps */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">🛠️ Fix Steps (Follow in Order)</h2>
                
                {/* Step 1 */}
                <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
                  <h3 className="font-bold text-orange-800 text-lg mb-2">
                    Step 1: Add Authorized Domains (CRITICAL)
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-orange-700">This is the #1 cause of this error. You MUST add localhost to authorized domains.</p>
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium">1. Go to Firebase Console:</p>
                      <a 
                        href="https://console.firebase.google.com/project/sigma2-25a57/authentication/settings"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-xs break-all"
                      >
                        console.firebase.google.com/project/sigma2-25a57/authentication/settings
                      </a>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium">2. Scroll to "Authorized domains" section</p>
                      <p>3. Click "Add domain" and add these:</p>
                      <ul className="list-disc list-inside ml-4 mt-1">
                        <li><code className="bg-gray-100 px-1 rounded">localhost</code></li>
                        <li><code className="bg-gray-100 px-1 rounded">127.0.0.1</code></li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                  <h3 className="font-bold text-blue-800 text-lg mb-2">
                    Step 2: Enable Phone Authentication
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium">1. Go to Authentication Providers:</p>
                      <a 
                        href="https://console.firebase.google.com/project/sigma2-25a57/authentication/providers"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-xs break-all"
                      >
                        console.firebase.google.com/project/sigma2-25a57/authentication/providers
                      </a>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium">2. Find "Phone" in the list</p>
                      <p>3. If it shows "Disabled", click on it and enable it</p>
                      <p>4. Save changes</p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                  <h3 className="font-bold text-green-800 text-lg mb-2">
                    Step 3: Verify Web App Registration
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium">1. Go to Project Settings:</p>
                      <a 
                        href="https://console.firebase.google.com/project/sigma2-25a57/settings/general"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-xs break-all"
                      >
                        console.firebase.google.com/project/sigma2-25a57/settings/general
                      </a>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium">2. Scroll to "Your apps" section</p>
                      <p>3. Verify you have a Web app with this App ID:</p>
                      <code className="text-xs bg-gray-100 px-1 rounded break-all">
                        1:145044904314:web:f1adf116d91105120d1ec3
                      </code>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Diagnostics and Testing */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">🔍 Diagnostics</h2>
                
                {/* Current Configuration */}
                <div className="bg-gray-100 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Current Configuration</h3>
                  <pre className="text-xs bg-white p-3 rounded border overflow-auto">
                    {JSON.stringify(diagnostics, null, 2)}
                  </pre>
                </div>

                {/* Test Button */}
                <div className="space-y-3">
                  <button
                    onClick={testFirebaseConnection}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? '🔄 Testing...' : '🧪 Test Firebase Connection'}
                  </button>
                </div>

                {/* Test Results */}
                <div className="bg-black rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-white">Test Results</h3>
                    <button
                      onClick={clearLogs}
                      className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded p-3 max-h-64 overflow-y-auto">
                    {testResults.length === 0 ? (
                      <p className="text-gray-400 text-sm">No test results yet...</p>
                    ) : (
                      testResults.map((log, index) => (
                        <div key={index} className="text-green-400 text-xs font-mono mb-1">
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* After Fix Instructions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-800 text-lg mb-2">
                ⚡ After Making Changes
              </h3>
              <div className="text-sm text-yellow-700 space-y-2">
                <p>1. <strong>Wait 2-3 minutes</strong> for Firebase changes to propagate</p>
                <p>2. <strong>Clear your browser cache</strong> completely (Ctrl+Shift+Delete)</p>
                <p>3. <strong>Refresh this page</strong> and test again</p>
                <p>4. If still failing, restart your development server</p>
              </div>
            </div>

            {/* Quick Access Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://console.firebase.google.com/project/sigma2-25a57/authentication/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-red-700 text-sm"
              >
                🔧 Fix Authorized Domains
              </a>
              <a
                href="https://console.firebase.google.com/project/sigma2-25a57/authentication/providers"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-blue-700 text-sm"
              >
                📱 Enable Phone Auth
              </a>
              <a
                href="/debug-firebase"
                className="bg-green-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-green-700 text-sm"
              >
                🧪 Test OTP Sending
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}