'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';

export default function FinalDebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('+919839145306');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(message);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const runComprehensiveTest = async () => {
    setLoading(true);
    clearLogs();
    
    addLog('🚀 Starting comprehensive Firebase diagnostic...');
    
    try {
      // Test 1: Basic Firebase Setup
      addLog('=== TEST 1: Basic Firebase Setup ===');
      addLog(`✅ Firebase initialized: ${Boolean(auth)}`);
      addLog(`✅ Project ID: ${auth.app.options.projectId}`);
      addLog(`✅ Auth Domain: ${auth.app.options.authDomain}`);
      addLog(`✅ App ID: ${auth.app.options.appId}`);
      addLog(`✅ API Key: ${auth.app.options.apiKey?.substring(0, 20)}...`);
      
      // Test 2: Import Firebase Auth Functions
      addLog('=== TEST 2: Firebase Auth Functions ===');
      const { RecaptchaVerifier, signInWithPhoneNumber } = await import('firebase/auth');
      addLog('✅ RecaptchaVerifier imported successfully');
      addLog('✅ signInWithPhoneNumber imported successfully');
      
      // Test 3: Create reCAPTCHA Container
      addLog('=== TEST 3: reCAPTCHA Container Setup ===');
      let container = document.getElementById('final-test-recaptcha');
      if (!container) {
        container = document.createElement('div');
        container.id = 'final-test-recaptcha';
        container.style.display = 'block';
        container.style.border = '2px solid #blue';
        container.style.padding = '10px';
        container.style.margin = '10px 0';
        container.innerHTML = '<p>reCAPTCHA will load here...</p>';
        document.body.appendChild(container);
        addLog('✅ Created reCAPTCHA container');
      } else {
        addLog('✅ reCAPTCHA container already exists');
      }
      
      // Test 4: Create RecaptchaVerifier
      addLog('=== TEST 4: RecaptchaVerifier Creation ===');
      let recaptchaVerifier: any = null;
      
      try {
        // Check container exists and is valid
        const containerElement = document.getElementById('final-test-recaptcha');
        if (!containerElement) {
          throw new Error('reCAPTCHA container not found');
        }
        
        addLog(`✅ Container found: ${containerElement.id}`);
        addLog(`✅ Container in DOM: ${Boolean(document.getElementById('final-test-recaptcha'))}`);
        
        // Debug RecaptchaVerifier parameters
        addLog('🔧 Creating RecaptchaVerifier with parameters:');
        addLog(`  - auth: ${Boolean(auth)}`);
        addLog(`  - container: 'final-test-recaptcha'`);
        addLog(`  - options: size='normal', with callbacks`);
        
        recaptchaVerifier = new RecaptchaVerifier(auth, 'final-test-recaptcha', {
          size: 'normal',
          callback: (response: any) => {
            addLog('✅ reCAPTCHA solved! Response: ' + response.substring(0, 20) + '...');
            // Automatically proceed to phone auth test
            setTimeout(() => testPhoneAuth(recaptchaVerifier), 1000);
          },
          'expired-callback': () => {
            addLog('⚠️ reCAPTCHA expired');
          },
          'error-callback': (error: any) => {
            addLog('❌ reCAPTCHA error: ' + error.message);
          }
        });
        
        addLog('✅ RecaptchaVerifier created successfully');
        
        // Test 5: Render reCAPTCHA
        addLog('=== TEST 5: reCAPTCHA Rendering ===');
        await recaptchaVerifier.render();
        addLog('✅ reCAPTCHA rendered successfully');
        addLog('👆 Please solve the reCAPTCHA above to continue testing');
        
      } catch (error: any) {
        addLog(`❌ RecaptchaVerifier error: ${error.message}`);
        addLog(`❌ Error code: ${error.code}`);
        addLog(`❌ Full error: ${JSON.stringify(error, null, 2)}`);
        
        if (error.code === 'auth/argument-error') {
          addLog('🔍 DIAGNOSIS: auth/argument-error');
          addLog('🔍 This means invalid arguments to RecaptchaVerifier');
          addLog('🔍 Possible causes:');
          addLog('   • Container ID doesn\'t exist');
          addLog('   • Auth object is invalid');
          addLog('   • RecaptchaVerifier options are incorrect');
          addLog('🔧 Trying alternative approach...');
          
          // Try alternative approach with different parameters
          await tryAlternativeRecaptcha();
        } else if (error.code === 'auth/invalid-app-credential') {
          addLog('🔍 DIAGNOSIS: auth/invalid-app-credential in RecaptchaVerifier');
          addLog('🔍 This means your web app is NOT properly registered');
          addLog('🔍 OR your API key is restricted');
          addLog('🔍 OR there\'s a Firebase Console configuration issue');
        }
      }
      
    } catch (error: any) {
      addLog(`💥 Comprehensive test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tryAlternativeRecaptcha = async () => {
    addLog('=== ALTERNATIVE RECAPTCHA TEST ===');
    
    try {
      const { RecaptchaVerifier } = await import('firebase/auth');
      
      // Create a new container with different ID
      const altContainer = document.createElement('div');
      altContainer.id = 'alt-recaptcha-test';
      altContainer.style.display = 'block';
      altContainer.style.border = '2px solid red';
      altContainer.style.padding = '10px';
      altContainer.style.margin = '10px 0';
      document.body.appendChild(altContainer);
      
      addLog('✅ Created alternative container');
      
      // Try with minimal options
      const altRecaptcha = new RecaptchaVerifier(auth, 'alt-recaptcha-test', {
        size: 'normal'
      });
      
      addLog('✅ Alternative RecaptchaVerifier created');
      
      await altRecaptcha.render();
      addLog('✅ Alternative reCAPTCHA rendered');
      
    } catch (altError: any) {
      addLog(`❌ Alternative approach also failed: ${altError.message}`);
      addLog(`❌ Alt error code: ${altError.code}`);
    }
  };

  const testPhoneAuth = async (recaptchaVerifier: any) => {
    addLog('=== TEST 6: Phone Authentication ===');
    addLog(`📱 Testing with phone number: ${phoneNumber}`);
    
    try {
      const { signInWithPhoneNumber } = await import('firebase/auth');
      
      addLog('🔄 Calling signInWithPhoneNumber...');
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      
      addLog('🎉 SUCCESS! Phone authentication worked!');
      addLog(`✅ Verification ID: ${confirmationResult.verificationId?.substring(0, 20)}...`);
      addLog('📨 OTP should be sent to your phone');
      
    } catch (error: any) {
      addLog(`❌ Phone auth failed: ${error.message}`);
      addLog(`❌ Error code: ${error.code}`);
      
      // Detailed error analysis
      if (error.code === 'auth/invalid-app-credential') {
        addLog('🔍 DETAILED ANALYSIS:');
        addLog('🔍 Error occurred DURING signInWithPhoneNumber call');
        addLog('🔍 This means:');
        addLog('   • Domain authorization works (reCAPTCHA rendered)');
        addLog('   • But Firebase doesn\'t recognize your web app credentials');
        addLog('   • Most likely: API key restrictions or web app not registered');
        addLog('🔧 SOLUTIONS:');
        addLog('   1. Check Google Cloud Console API restrictions');
        addLog('   2. Verify web app exists in Firebase Console');
        addLog('   3. Try regenerating web app credentials');
      }
    }
  };

  const testAPIKeyRestrictions = () => {
    addLog('=== API KEY RESTRICTIONS CHECK ===');
    addLog('🔍 Your API key might be restricted in Google Cloud Console');
    addLog('🔧 To check:');
    addLog('1. Go to: https://console.cloud.google.com/apis/credentials?project=sigma2-25a57');
    addLog('2. Find your API key (starts with AIzaSyA2_zAlanwg7r7s...)');
    addLog('3. Click on it to edit');
    addLog('4. Check "API restrictions" section');
    addLog('5. Either remove restrictions OR ensure these APIs are allowed:');
    addLog('   • Firebase Authentication API');
    addLog('   • Identity Toolkit API');
    addLog('   • Google Identity Toolkit API');
    addLog('6. Check "Website restrictions" section');
    addLog('7. Either remove restrictions OR add: localhost:*');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🔬 Final Firebase Diagnostic</h1>
            <p className="text-red-100 mt-1">Comprehensive test to identify exact issue</p>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Phone Number Input */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number for Testing
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Test Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={runComprehensiveTest}
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? '🔄 Testing...' : '🔬 Run Comprehensive Test'}
              </button>
              
              <button
                onClick={testAPIKeyRestrictions}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700"
              >
                🔑 Check API Key Issues
              </button>
            </div>

            {/* Critical Actions */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-3">🚨 If Test Fails, Try These:</h3>
              <div className="space-y-2 text-sm text-yellow-700">
                <p><strong>1. Regenerate Web App:</strong> Delete and recreate web app in Firebase Console</p>
                <p><strong>2. Check API Key:</strong> Remove API key restrictions in Google Cloud Console</p>
                <p><strong>3. Verify Domain:</strong> Ensure localhost is in authorized domains</p>
                <p><strong>4. Clear Cache:</strong> Clear browser cache completely</p>
              </div>
            </div>

            {/* Test Logs */}
            <div className="bg-black rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-white font-semibold">📋 Comprehensive Test Results</h3>
                <button
                  onClick={clearLogs}
                  className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                >
                  Clear
                </button>
              </div>
              <div className="bg-gray-900 rounded p-3 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-400 text-sm">Click "Run Comprehensive Test" to start detailed diagnosis...</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-green-400 text-xs font-mono mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Fix Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://console.firebase.google.com/project/sigma2-25a57/settings/general"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-blue-700"
              >
                🔧 Firebase Console
              </a>
              <a
                href="https://console.cloud.google.com/apis/credentials?project=sigma2-25a57"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-green-700"
              >
                🔑 API Keys
              </a>
              <a
                href="/auth-mode"
                className="bg-purple-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-purple-700"
              >
                🧪 Use Mock Auth
              </a>
            </div>

            {/* reCAPTCHA Test Container */}
            <div id="final-test-recaptcha"></div>
          </div>
        </div>
      </div>
    </div>
  );
}