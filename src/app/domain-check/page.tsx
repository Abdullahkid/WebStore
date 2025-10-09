'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export default function DomainCheckPage() {
  const [domainInfo, setDomainInfo] = useState<any>({});
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string, type: 'info' | 'error' | 'success' | 'warning' = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const emoji = {
      info: 'ℹ️',
      error: '❌',
      success: '✅', 
      warning: '⚠️'
    }[type];
    setTestResults(prev => [...prev, `[${timestamp}] ${emoji} ${message}`]);
  };

  useEffect(() => {
    collectDomainInfo();
  }, []);

  const collectDomainInfo = () => {
    if (typeof window === 'undefined') return;

    const info = {
      currentUrl: window.location.href,
      hostname: window.location.hostname,
      port: window.location.port,
      protocol: window.location.protocol,
      origin: window.location.origin,
      host: window.location.host,
      
      // Firebase config
      firebaseAuthDomain: auth.app.options.authDomain,
      firebaseProjectId: auth.app.options.projectId,
      firebaseAppId: auth.app.options.appId?.substring(0, 30) + '...',
      
      // Test domains
      possibleDomains: [
        'localhost',
        '127.0.0.1',
        'localhost:3000',
        'localhost:3001',
        window.location.hostname,
        window.location.host,
        window.location.origin
      ].filter((domain, index, arr) => arr.indexOf(domain) === index) // Remove duplicates
    };

    setDomainInfo(info);
    addLog('Domain information collected', 'success');
    addLog(`Current URL: ${info.currentUrl}`, 'info');
    addLog(`Hostname: ${info.hostname}`, 'info');
    addLog(`Port: ${info.port || 'default'}`, 'info');
    addLog(`Origin: ${info.origin}`, 'info');
  };

  const testFirebaseConnection = async () => {
    setLoading(true);
    addLog('Testing Firebase connection with current domain...', 'info');

    try {
      // Import Firebase functions for testing
      const { RecaptchaVerifier } = await import('firebase/auth');
      
      addLog('Creating test reCAPTCHA verifier...', 'info');
      
      // Create a test container
      let testContainer = document.getElementById('test-recaptcha-container');
      if (!testContainer) {
        testContainer = document.createElement('div');
        testContainer.id = 'test-recaptcha-container';
        testContainer.style.display = 'block';
        testContainer.style.border = '1px solid #ddd';
        testContainer.style.padding = '10px';
        testContainer.style.margin = '10px 0';
        testContainer.innerHTML = '<p>reCAPTCHA will appear here...</p>';
        document.body.appendChild(testContainer);
      }

      // Try to create RecaptchaVerifier - this will fail if domain is not authorized
      const recaptchaVerifier = new RecaptchaVerifier(auth, 'test-recaptcha-container', {
        size: 'normal',
        callback: (response: any) => {
          addLog('✅ reCAPTCHA solved successfully!', 'success');
          addLog('This means your domain IS authorized in Firebase', 'success');
        },
        'expired-callback': () => {
          addLog('reCAPTCHA expired', 'warning');
        },
        'error-callback': (error: any) => {
          addLog(`reCAPTCHA error: ${error.message || error}`, 'error');
        }
      });

      addLog('✅ RecaptchaVerifier created successfully', 'success');
      addLog('Rendering reCAPTCHA...', 'info');
      
      await recaptchaVerifier.render();
      addLog('✅ reCAPTCHA rendered - Domain is authorized!', 'success');
      addLog('Please solve the reCAPTCHA above to confirm', 'info');

    } catch (error: any) {
      addLog(`❌ Firebase connection error: ${error.message}`, 'error');
      addLog(`Error code: ${error.code || 'unknown'}`, 'error');
      
      if (error.code === 'auth/invalid-app-credential') {
        addLog('🔍 DIAGNOSIS: Invalid app credential', 'error');
        addLog('This means either:', 'error');
        addLog('1. Your current domain is NOT in Firebase authorized domains', 'error');
        addLog('2. Your web app credentials are incorrect', 'error');
        addLog('3. Your Firebase project settings are misconfigured', 'error');
      } else if (error.message?.includes('domain') || error.message?.includes('unauthorized')) {
        addLog('🔍 DIAGNOSIS: Domain authorization issue', 'error');
        addLog(`Add "${domainInfo.origin}" to Firebase authorized domains`, 'error');
      }
      
      console.error('Full error:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearLogs = () => {
    setTestResults([]);
    // Remove test container
    const testContainer = document.getElementById('test-recaptcha-container');
    if (testContainer) {
      testContainer.remove();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-orange-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🔍 Firebase Domain Authorization Check</h1>
            <p className="text-orange-100 mt-1">Diagnose domain-specific auth/invalid-app-credential errors</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Current Domain Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">🌐 Current Domain Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Full URL:</strong> {domainInfo.currentUrl}</p>
                  <p><strong>Hostname:</strong> {domainInfo.hostname}</p>
                  <p><strong>Port:</strong> {domainInfo.port || 'default (80/443)'}</p>
                  <p><strong>Protocol:</strong> {domainInfo.protocol}</p>
                </div>
                <div>
                  <p><strong>Origin:</strong> {domainInfo.origin}</p>
                  <p><strong>Host:</strong> {domainInfo.host}</p>
                  <p><strong>Firebase Auth Domain:</strong> {domainInfo.firebaseAuthDomain}</p>
                  <p><strong>Firebase Project:</strong> {domainInfo.firebaseProjectId}</p>
                </div>
              </div>
            </div>

            {/* Domain Authorization Test */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">🧪 Domain Authorization Test</h3>
              <p className="text-sm text-yellow-700 mb-4">
                This test will try to create a reCAPTCHA verifier. If it fails, your current domain is not authorized in Firebase.
              </p>
              <button
                onClick={testFirebaseConnection}
                disabled={loading}
                className="bg-yellow-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-yellow-700 disabled:opacity-50"
              >
                {loading ? '🔄 Testing...' : '🧪 Test Domain Authorization'}
              </button>
            </div>

            {/* Domains to Add */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-3">🔧 Domains to Add in Firebase Console</h3>
              <p className="text-sm text-red-700 mb-3">
                Go to{' '}
                <a 
                  href="https://console.firebase.google.com/project/sigma2-25a57/authentication/settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline font-medium"
                >
                  Firebase Authentication Settings
                </a>{' '}
                and ensure these domains are in the "Authorized domains" section:
              </p>
              <div className="bg-white rounded p-3">
                <h4 className="font-medium mb-2">Required Domains:</h4>
                <ul className="list-disc list-inside text-sm space-y-1">
                  {domainInfo.possibleDomains?.map((domain: string, index: number) => (
                    <li key={index}>
                      <code className="bg-gray-100 px-1 rounded">{domain}</code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Test Results */}
            <div className="bg-black rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-semibold">📋 Test Results</h3>
                <button
                  onClick={clearLogs}
                  className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="bg-gray-900 rounded p-3 max-h-64 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-gray-400 text-sm">Click "Test Domain Authorization" to start...</p>
                ) : (
                  testResults.map((log, index) => (
                    <div key={index} className="text-green-400 text-xs font-mono mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3">📋 Instructions</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>1. Run the domain test above</strong> - It will tell you if your current domain is authorized</p>
                <p><strong>2. If test fails:</strong> Add your current domain to Firebase Console authorized domains</p>
                <p><strong>3. If test succeeds:</strong> The issue might be elsewhere (phone number format, etc.)</p>
                <p><strong>4. Wait 2-3 minutes</strong> after making changes in Firebase Console</p>
                <p><strong>5. Clear browser cache</strong> and test again</p>
              </div>
            </div>

            {/* Test reCAPTCHA Container */}
            <div id="test-recaptcha-container"></div>
          </div>
        </div>
      </div>
    </div>
  );
}