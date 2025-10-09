'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function FirebaseDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [logs, setLogs] = useState<string[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('+91');
  const [testPhase, setTestPhase] = useState<string>('idle');
  const [loading, setLoading] = useState(false);

  const addLog = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
      info: 'ℹ️',
      error: '❌',
      success: '✅',
      warning: '⚠️'
    }[type];
    const logMessage = `[${timestamp}] ${emoji} ${message}`;
    setLogs(prev => [...prev, logMessage]);
    console.log(logMessage);
  };

  useEffect(() => {
    collectDebugInfo();
  }, []);

  const collectDebugInfo = () => {
    try {
      const firebaseApp = auth.app;
      const config = firebaseApp.options;
      
      const info = {
        timestamp: new Date().toISOString(),
        environment: {
          nodeEnv: process.env.NODE_ENV,
          hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
          port: typeof window !== 'undefined' ? window.location.port : 'unknown',
          protocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown',
          origin: typeof window !== 'undefined' ? window.location.origin : 'unknown',
          userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
        },
        firebaseConfig: {
          hasApiKey: Boolean(config.apiKey),
          apiKeyLength: config.apiKey?.length || 0,
          apiKeyPrefix: config.apiKey?.substring(0, 20) + '...',
          authDomain: config.authDomain,
          projectId: config.projectId,
          appId: config.appId,
          hasAppId: Boolean(config.appId),
          appIdLength: config.appId?.length || 0,
          messagingSenderId: config.messagingSenderId,
          storageBucket: config.storageBucket,
          measurementId: config.measurementId,
        },
        firebaseApp: {
          name: firebaseApp.name,
          automaticDataCollectionEnabled: firebaseApp.automaticDataCollectionEnabled,
          isDeleted: false, // Can't check this directly without causing issues
        },
        firebaseAuth: {
          currentUser: auth.currentUser ? {
            uid: auth.currentUser.uid,
            phoneNumber: auth.currentUser.phoneNumber,
            isAnonymous: auth.currentUser.isAnonymous,
          } : null,
          languageCode: auth.languageCode,
        },
        validation: {
          configComplete: Boolean(config.apiKey && config.authDomain && config.projectId && config.appId),
          hasRequiredFields: {
            apiKey: Boolean(config.apiKey),
            authDomain: Boolean(config.authDomain),
            projectId: Boolean(config.projectId), 
            appId: Boolean(config.appId),
          }
        }
      };

      setDebugInfo(info);
      addLog('Debug information collected', 'success');
      addLog(`Project: ${info.firebaseConfig.projectId}`, 'info');
      addLog(`Auth Domain: ${info.firebaseConfig.authDomain}`, 'info');
      addLog(`App ID Present: ${info.firebaseConfig.hasAppId}`, 'info');
      addLog(`Environment: ${info.environment.nodeEnv}`, 'info');
      addLog(`Origin: ${info.environment.origin}`, 'info');
      
    } catch (error: any) {
      addLog(`Failed to collect debug info: ${error.message}`, 'error');
      console.error('Debug collection error:', error);
    }
  };

  const testFirebaseInitialization = async () => {
    setTestPhase('initialization');
    addLog('Testing Firebase initialization...', 'info');
    
    try {
      // Test 1: Firebase App
      addLog(`Firebase app name: ${auth.app.name}`, 'success');
      addLog(`Firebase app options exist: ${Boolean(auth.app.options)}`, 'success');
      
      // Test 2: Configuration validation
      const config = auth.app.options as any;
      const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
      
      for (const field of requiredFields) {
        if (config[field]) {
          addLog(`✓ ${field}: Present`, 'success');
        } else {
          addLog(`✗ ${field}: Missing`, 'error');
        }
      }
      
      // Test 3: Auth instance
      addLog(`Firebase Auth instance: ${Boolean(auth)}`, 'success');
      addLog(`Current user: ${auth.currentUser ? 'Signed in' : 'Not signed in'}`, 'info');
      
      addLog('Firebase initialization test completed', 'success');
      
    } catch (error: any) {
      addLog(`Firebase initialization error: ${error.message}`, 'error');
      addLog(`Error code: ${error.code}`, 'error');
    }
  };

  const testRecaptchaSetup = async () => {
    setTestPhase('recaptcha');
    addLog('Testing reCAPTCHA setup...', 'info');
    
    try {
      // Create recaptcha container if it doesn't exist
      let recaptchaContainer = document.getElementById('recaptcha-test-container');
      if (!recaptchaContainer) {
        recaptchaContainer = document.createElement('div');
        recaptchaContainer.id = 'recaptcha-test-container';
        recaptchaContainer.style.display = 'block';
        recaptchaContainer.style.margin = '10px 0';
        document.body.appendChild(recaptchaContainer);
        addLog('Created reCAPTCHA container', 'success');
      }

      // Try to create RecaptchaVerifier
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-test-container', {
        size: 'normal',
        callback: (response: any) => {
          addLog(`reCAPTCHA solved: ${response?.substring(0, 20)}...`, 'success');
        },
        'expired-callback': () => {
          addLog('reCAPTCHA expired', 'warning');
        }
      });

      addLog('RecaptchaVerifier created successfully', 'success');
      
      // Try to render
      await recaptchaVerifier.render();
      addLog('reCAPTCHA rendered successfully', 'success');
      
      return recaptchaVerifier;
      
    } catch (error: any) {
      addLog(`reCAPTCHA setup error: ${error.message}`, 'error');
      addLog(`Error code: ${error.code || 'unknown'}`, 'error');
      throw error;
    }
  };

  const testPhoneAuthCredentials = async () => {
    setTestPhase('phone-auth');
    addLog('Testing Phone Authentication credentials...', 'info');
    
    if (!phoneNumber || phoneNumber.length < 10) {
      addLog('Please enter a valid phone number first', 'warning');
      return;
    }

    try {
      addLog(`Testing with phone number: ${phoneNumber}`, 'info');
      
      // Step 1: Setup reCAPTCHA
      const recaptchaVerifier = await testRecaptchaSetup();
      
      // Step 2: Try to send OTP (this will reveal credential issues)
      addLog('Attempting to send OTP...', 'info');
      
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      
      addLog('✅ SUCCESS! Phone auth credentials are valid', 'success');
      addLog(`Verification ID: ${confirmationResult.verificationId?.substring(0, 20)}...`, 'success');
      addLog('OTP should be sent to your phone', 'success');
      
      // Clean up
      recaptchaVerifier.clear();
      
    } catch (error: any) {
      addLog(`❌ Phone Auth Error: ${error.message}`, 'error');
      addLog(`Error code: ${error.code}`, 'error');
      
      // Detailed error analysis
      if (error.code === 'auth/invalid-app-credential') {
        addLog('🔍 DIAGNOSIS: Invalid app credentials detected', 'error');
        addLog('• Your web app is not properly registered in Firebase Console', 'error');
        addLog('• OR authorized domains are missing (localhost, 127.0.0.1)', 'error');
        addLog('• OR phone authentication is not enabled', 'error');
      } else if (error.code === 'auth/app-not-authorized') {
        addLog('🔍 DIAGNOSIS: App not authorized', 'error');
        addLog('• Add your domain to authorized domains in Firebase Console', 'error');
      } else if (error.code === 'auth/project-not-found') {
        addLog('🔍 DIAGNOSIS: Project not found', 'error');
        addLog('• Check your project ID in Firebase config', 'error');
      }
      
      console.error('Full error object:', error);
    }
  };

  const runFullDiagnostic = async () => {
    setLoading(true);
    setLogs([]);
    
    try {
      addLog('🚀 Starting comprehensive Firebase diagnostic...', 'info');
      
      await testFirebaseInitialization();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
      
      await testPhoneAuthCredentials();
      
      addLog('🏁 Diagnostic completed', 'success');
      
    } catch (error: any) {
      addLog(`Diagnostic failed: ${error.message}`, 'error');
    } finally {
      setLoading(false);
      setTestPhase('idle');
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🐛 Firebase Authentication Debugger</h1>
            <p className="text-blue-100 mt-1">Comprehensive diagnosis for auth/invalid-app-credential error</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Current Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">Environment</h3>
                <p className="text-sm text-gray-600">{debugInfo.environment?.nodeEnv || 'Loading...'}</p>
                <p className="text-xs text-gray-500">{debugInfo.environment?.origin || 'Loading...'}</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">Project ID</h3>
                <p className="text-sm text-gray-600">{debugInfo.firebaseConfig?.projectId || 'Loading...'}</p>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800">Auth Domain</h3>
                <p className="text-sm text-gray-600">{debugInfo.firebaseConfig?.authDomain || 'Loading...'}</p>
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">Test Phone Authentication</h3>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
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
                <button
                  onClick={runFullDiagnostic}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? '🔄 Testing...' : '🧪 Run Full Diagnostic'}
                </button>
              </div>
            </div>

            {/* Test Status */}
            {testPhase !== 'idle' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  Currently testing: <strong>{testPhase}</strong>
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Debug Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">🔍 Debug Information</h2>
                <div className="bg-gray-100 rounded-lg p-4">
                  <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-96">
                    {JSON.stringify(debugInfo, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Live Logs */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">📋 Live Debug Logs</h2>
                  <button
                    onClick={clearLogs}
                    className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                  >
                    Clear Logs
                  </button>
                </div>
                
                <div className="bg-black rounded-lg p-4">
                  <div className="bg-gray-900 rounded p-3 max-h-96 overflow-y-auto">
                    {logs.length === 0 ? (
                      <p className="text-gray-400 text-sm">No logs yet. Click "Run Full Diagnostic" to start testing.</p>
                    ) : (
                      logs.map((log, index) => (
                        <div key={index} className="text-green-400 text-xs font-mono mb-1">
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* reCAPTCHA Test Container */}
            <div id="recaptcha-test-container" style={{ display: 'none' }}></div>

            {/* Manual Test Options */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Manual Testing Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={testFirebaseInitialization}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  Test Firebase Init
                </button>
                <button
                  onClick={testRecaptchaSetup}
                  disabled={loading}
                  className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-700 disabled:opacity-50"
                >
                  Test reCAPTCHA
                </button>
                <button
                  onClick={collectDebugInfo}
                  disabled={loading}
                  className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-700 disabled:opacity-50"
                >
                  Refresh Debug Info
                </button>
              </div>
            </div>

            {/* Quick Fix Links */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3">⚡ Quick Fix Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <a
                  href="https://console.firebase.google.com/project/sigma2-25a57/authentication/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm text-center hover:bg-red-700"
                >
                  🔧 Fix Authorized Domains
                </a>
                <a
                  href="https://console.firebase.google.com/project/sigma2-25a57/authentication/providers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm text-center hover:bg-blue-700"
                >
                  📱 Enable Phone Auth
                </a>
                <a
                  href="https://console.firebase.google.com/project/sigma2-25a57/settings/general"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white px-4 py-2 rounded-md text-sm text-center hover:bg-green-700"
                >
                  ⚙️ Check Web App
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
