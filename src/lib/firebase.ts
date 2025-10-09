// Firebase configuration and initialization
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your actual Firebase web app configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2_zAlanwg7r7suuulQSfYkqocn7ZdMMI",
  authDomain: "sigma2-25a57.firebaseapp.com",
  projectId: "sigma2-25a57",
  storageBucket: "sigma2-25a57.firebasestorage.app",
  messagingSenderId: "145044904314",
  appId: "1:145044904314:web:f1adf116d91105120d1ec3",
  measurementId: "G-H253BTGEB6"
};

// Initialize Firebase only once
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw new Error(`Firebase configuration invalid: ${error}`);
}

// Initialize Firebase Auth
export const auth = getAuth(app);



export default app;