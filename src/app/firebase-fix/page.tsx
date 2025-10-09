'use client';

import { useState } from 'react';

export default function FirebaseSetupPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-red-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">🔥 Fix Firebase auth/invalid-app-credential Error</h1>
            <p className="text-red-100 mt-1">Step-by-step solution</p>
          </div>

          <div className="p-6">
            {/* Error Explanation */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-red-800 mb-2">❌ Error: auth/invalid-app-credential</h2>
              <p className="text-red-700 text-sm">
                This error occurs when your Firebase web app credentials are not properly configured or authorized domains are missing.
              </p>
            </div>

            {/* Step 1 */}
            <div className="border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 1: Check Authorized Domains</h3>
                <button
                  onClick={() => setStep(step === 1 ? 0 : 1)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {step === 1 ? '▼' : '▶'}
                </button>
              </div>
              
              {step === 1 && (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-gray-600">
                    Firebase requires authorized domains to be explicitly listed for security.
                  </p>
                  
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="font-medium mb-2">1. Go to Firebase Console:</p>
                    <a 
                      href="https://console.firebase.google.com/project/sigma2-25a57/authentication/settings"
                      target="_blank"
                      className="text-blue-600 underline text-sm"
                    >
                      https://console.firebase.google.com/project/sigma2-25a57/authentication/settings
                    </a>
                  </div>

                  <div className="bg-gray-100 p-3 rounded">
                    <p className="font-medium mb-2">2. Scroll down to "Authorized domains" section</p>
                    <p className="text-sm">Make sure these domains are listed:</p>
                    <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                      <li><code>localhost</code></li>
                      <li><code>127.0.0.1</code></li>
                      <li><code>sigma2-25a57.firebaseapp.com</code></li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>Important:</strong> If localhost or 127.0.0.1 are missing, click "Add domain" and add them.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div className="border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 2: Verify Web App Registration</h3>
                <button
                  onClick={() => setStep(step === 2 ? 0 : 2)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {step === 2 ? '▼' : '▶'}
                </button>
              </div>
              
              {step === 2 && (
                <div className="mt-4 space-y-3">
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="font-medium mb-2">1. Go to Project Settings:</p>
                    <a 
                      href="https://console.firebase.google.com/project/sigma2-25a57/settings/general"
                      target="_blank"
                      className="text-blue-600 underline text-sm"
                    >
                      https://console.firebase.google.com/project/sigma2-25a57/settings/general
                    </a>
                  </div>

                  <div className="bg-gray-100 p-3 rounded">
                    <p className="font-medium mb-2">2. Scroll down to "Your apps" section</p>
                    <p className="text-sm">Verify that you have a Web app with App ID:</p>
                    <code className="bg-white px-2 py-1 rounded text-xs">1:145044904314:web:f1adf116d91105120d1ec3</code>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                    <p className="text-sm text-blue-800">
                      <strong>If the web app is missing:</strong> Click "Add app" → Web (&lt;/&gt;) and register a new web app.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3 */}
            <div className="border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 3: Enable Phone Authentication</h3>
                <button
                  onClick={() => setStep(step === 3 ? 0 : 3)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {step === 3 ? '▼' : '▶'}
                </button>
              </div>
              
              {step === 3 && (
                <div className="mt-4 space-y-3">
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="font-medium mb-2">1. Go to Authentication → Sign-in method:</p>
                    <a 
                      href="https://console.firebase.google.com/project/sigma2-25a57/authentication/providers"
                      target="_blank"
                      className="text-blue-600 underline text-sm"
                    >
                      https://console.firebase.google.com/project/sigma2-25a57/authentication/providers
                    </a>
                  </div>

                  <div className="bg-gray-100 p-3 rounded">
                    <p className="font-medium mb-2">2. Find "Phone" in the list</p>
                    <p className="text-sm">Make sure it shows "Enabled" status</p>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-3 rounded">
                    <p className="text-sm text-green-800">
                      <strong>If disabled:</strong> Click on "Phone" → Click "Enable" → Save
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 4 */}
            <div className="border rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Step 4: Test Configuration</h3>
                <button
                  onClick={() => setStep(step === 4 ? 0 : 4)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {step === 4 ? '▼' : '▶'}
                </button>
              </div>
              
              {step === 4 && (
                <div className="mt-4 space-y-3">
                  <div className="bg-gray-100 p-3 rounded">
                    <p className="font-medium mb-2">After completing the above steps:</p>
                    <ol className="list-decimal list-inside text-sm space-y-1">
                      <li>Refresh your browser completely (Ctrl+F5)</li>
                      <li>Clear browser cache if necessary</li>
                      <li>Test again at: 
                        <a href="/debug-firebase" className="text-blue-600 underline ml-1">
                          /debug-firebase
                        </a>
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {/* Current Configuration */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">📋 Current Configuration</h3>
              <div className="text-sm space-y-1 font-mono">
                <div><strong>Project ID:</strong> sigma2-25a57</div>
                <div><strong>Auth Domain:</strong> sigma2-25a57.firebaseapp.com</div>
                <div><strong>App ID:</strong> 1:145044904314:web:f1adf116d91105120d1ec3</div>
                <div><strong>Development URL:</strong> localhost:3001</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="https://console.firebase.google.com/project/sigma2-25a57/authentication/settings"
                target="_blank"
                className="bg-red-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-red-700"
              >
                🔧 Fix Authorized Domains
              </a>
              <a
                href="https://console.firebase.google.com/project/sigma2-25a57/authentication/providers"
                target="_blank"
                className="bg-blue-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-blue-700"
              >
                📱 Enable Phone Auth
              </a>
              <a
                href="/debug-firebase"
                className="bg-green-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:bg-green-700"
              >
                🧪 Test Configuration
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}