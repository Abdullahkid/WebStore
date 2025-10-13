// Firebase configuration and initialization
// Using dynamic imports to prevent server-side execution

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Lazy initialization - only runs on client
let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let initPromise: Promise<void> | undefined;

async function initializeFirebase() {
  if (typeof window === 'undefined') {
    return; // Don't initialize on server
  }

  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
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

// For backwards compatibility - synchronous access (may be undefined initially)
export { auth };
export default app;