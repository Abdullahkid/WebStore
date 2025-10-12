'use client';

import { useState } from 'react';
import { ExternalLink, Copy, Check, AlertCircle, CheckCircle } from 'lucide-react';

export default function FirebaseSetupGuide() {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const copyToClipboard = (text: string, step: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(step);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const setupSteps = [
    {
      id: 1,
      title: "Add Web App to Firebase Project",
      description: "Create a web app configuration in your existing Firebase project",
      action: "Go to Firebase Console",
      url: "https://console.firebase.google.com/project/sigma2-25a57",
      instructions: [
        'Click the "+" button or "Add app"',
        'Select "Web app" (</> icon)',
        'App nickname: "Downxtown Webstore"',
        'Optional: Check "Also set up Firebase Hosting"',
        'Click "Register app"'
      ]
    },
    {
      id: 2,
      title: "Copy Web App Configuration",
      description: "Get the Firebase config object for your web app",
      instructions: [
        'After registering, you\'ll see a config object',
        'Copy the entire firebaseConfig object',
        'It should look like the example below',
        'Save the appId - you\'ll need it in the next step'
      ],
      code: `const firebaseConfig = {
      apiKey: "${process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'YOUR_API_KEY'}",
      authDomain: "${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'your-project.firebaseapp.com'}", 
      projectId: "${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'your-project-id'}",
      storageBucket: "${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'your-project.firebasestorage.app'}",
      messagingSenderId: "${process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID'}",
      appId: "${process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'YOUR_APP_ID'}"
      };`
    },
    {
      id: 3,
      title: "Update Firebase Config in Code",
      description: "Replace the placeholder app ID with your actual web app ID",
      instructions: [
        'Open: /src/lib/firebase.ts',
        'Replace "YOUR_WEB_APP_ID_HERE" with your actual appId',
        'Save the file',
        'Restart your development server'
      ],
      filePath: "/src/lib/firebase.ts"
    },
    {
      id: 4,
      title: "Enable Phone Authentication",
      description: "Configure Firebase to allow phone number sign-in",
      action: "Go to Authentication Settings",
      url: "https://console.firebase.google.com/project/sigma2-25a57/authentication/providers",
      instructions: [
        'Go to Firebase Console → Authentication → Sign-in method',
        'Find "Phone" in the list of providers',
        'Click "Phone" and toggle it to "Enabled"',
        'Click "Save"'
      ]
    },
    {
      id: 5,
      title: "Add Authorized Domains",
      description: "Allow your localhost domain for testing",
      instructions: [
        'In Authentication → Settings → Authorized domains',
        'Make sure "localhost" is in the list',
        'If not, click "Add domain" and add "localhost"',
        'For production, add your actual domain'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🔥 Firebase Setup Required
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your webstore needs Firebase Phone Authentication configured to send real OTPs.
            Follow these steps to complete the setup.
          </p>
        </div>

        {/* Current Status */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-800 font-semibold mb-2">Current Status</h3>
              <p className="text-yellow-700 mb-3">
                Firebase configuration is incomplete. The system is currently using <strong>mock authentication</strong>
                for testing, but you won't receive real SMS messages.
              </p>
              <div className="bg-yellow-100 rounded p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Error:</strong> <code>auth/invalid-app-credential</code> -
                  This happens because the web app hasn't been registered in Firebase yet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="space-y-8">
          {setupSteps.map((step) => (
            <div key={step.id} className="bg-white rounded-lg shadow-md border border-gray-200">
              <div className="p-6">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4 flex-shrink-0">
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>

                    {/* Action Button */}
                    {step.action && step.url && (
                      <a
                        href={step.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-4"
                      >
                        {step.action}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </a>
                    )}

                    {/* Instructions */}
                    <div className="space-y-2">
                      {step.instructions.map((instruction, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <p className="text-gray-700">{instruction}</p>
                        </div>
                      ))}
                    </div>

                    {/* Code Example */}
                    {step.code && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Example Config:</span>
                          <button
                            onClick={() => copyToClipboard(step.code!, step.id)}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                          >
                            {copiedStep === step.id ? (
                              <>
                                <Check className="w-4 h-4 mr-1" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4 mr-1" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="bg-gray-100 rounded p-4 text-sm overflow-x-auto">
                          <code>{step.code}</code>
                        </pre>
                      </div>
                    )}

                    {/* File Path */}
                    {step.filePath && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                        <span className="text-sm font-medium text-blue-800">
                          File to edit: <code className="bg-blue-100 px-2 py-1 rounded">{step.filePath}</code>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testing Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-green-800 font-semibold mb-2">After Setup Complete</h3>
              <p className="text-green-700 mb-4">
                Once you've completed all steps above, you can test the real Firebase Phone Authentication:
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-700">Test at: <a href="/test-auth" className="underline font-medium">http://localhost:3000/test-auth</a></span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-700">Full registration: <a href="/register" className="underline font-medium">http://localhost:3000/register</a></span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-green-700">You'll receive real SMS messages on your phone</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Testing */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="text-blue-800 font-semibold mb-2">🧪 Current Testing Mode</h3>
          <p className="text-blue-700 mb-3">
            While you're setting up Firebase, the app is running in <strong>mock mode</strong>:
          </p>
          <div className="space-y-1">
            <div className="flex items-center text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>OTP sending is simulated (check browser console for test OTP)</span>
            </div>
            <div className="flex items-center text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>Registration flow works but uses mock tokens</span>
            </div>
            <div className="flex items-center text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <span>No real SMS messages will be sent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}