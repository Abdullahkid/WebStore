// Firebase configuration and initialization
// IMPORTANT: This file should ONLY be imported in client components ('use client')
// Using dynamic imports to prevent server-side execution

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';

// Get Firebase configuration from environment variables
// These are only available on the client side (NEXT_PUBLIC_ prefix)
function getFirebaseConfig() {
  if (typeof window === 'undefined') {
    return null; // Don't access env vars on server
  }

  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
}

// Lazy initialization - only runs on client
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let initPromise: Promise<void> | undefined;

async function initializeFirebase() {
  // Triple check we're on client
  if (typeof window === 'undefined') {
    return; // Don't initialize on server
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      const firebaseConfig = getFirebaseConfig();
      if (!firebaseConfig) {
        throw new Error('Firebase config not available');
      }

      const { initializeApp, getApps } = await import('firebase/app');
      const { getAuth } = await import('firebase/auth');

      app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      auth = getAuth(app);
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
  })();

  return initPromise;
}

// Getter functions that ensure Firebase is initialized
export async function getFirebaseAuth(): Promise<Auth | undefined> {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (!auth) {
    await initializeFirebase();
  }
  return auth;
}

export async function getFirebaseApp(): Promise<FirebaseApp | undefined> {
  if (typeof window === 'undefined') {
    return undefined;
  }

  if (!app) {
    await initializeFirebase();
  }
  return app;
}

// Create a client-side only auth export for backward compatibility
// This will be undefined on server and initialized on client
let clientAuth: Auth | undefined;

// Initialize on client only
if (typeof window !== 'undefined') {
  initializeFirebase().then(() => {
    clientAuth = auth;
  }).catch(console.error);
}

// Export for backward compatibility (will be undefined during SSR/build)
export { clientAuth as auth };

// Also export default app for backward compatibility
export default typeof window !== 'undefined' ? app : undefined;