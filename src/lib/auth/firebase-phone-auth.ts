// Firebase Phone Authentication Service
import type { 
  RecaptchaVerifier, 
  ConfirmationResult,
  Auth
} from 'firebase/auth';
import { mockFirebasePhoneAuth } from './mock-phone-auth';

// Global state to store verification
let currentVerificationResult: ConfirmationResult | null = null;

// Check if Firebase is properly configured
async function isFirebaseConfigured(): Promise<boolean> {
  try {
    // For development, allow bypassing Firebase with environment variable
    if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK_AUTH === 'true') {
      return false;
    }
    
    // TEMPORARY: Due to API key restrictions, use mock for now  
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return false;
    }
    
    // Dynamically import auth
    const { getFirebaseAuth } = await import('@/lib/firebase');
    const auth = await getFirebaseAuth();
    
    if (!auth) return false;
    
    // Check if we have a valid app ID (not the placeholder)
    const config = auth.app.options;
    const isConfigured = Boolean(config.appId && !config.appId.includes('YOUR_WEB_APP_ID'));
    
    return isConfigured;
  } catch (error) {
    console.warn('Firebase not properly configured:', error);
    return false;
  }
}

export class FirebasePhoneAuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // Initialize reCAPTCHA verifier
  private async initializeRecaptcha(auth: Auth, containerId: string = 'recaptcha-container'): Promise<RecaptchaVerifier> {
    try {
      if (this.recaptchaVerifier) {
        return this.recaptchaVerifier;
      }

      // Check if container exists and create if needed
      let container = document.getElementById(containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.display = 'none';
        document.body.appendChild(container);
      }
      
      // Verify container is in DOM
      const verifyContainer = document.getElementById(containerId);
      if (!verifyContainer) {
        throw new Error(`Container '${containerId}' could not be created or found`);
      }
      
      // Dynamically import RecaptchaVerifier
      const { RecaptchaVerifier } = await import('firebase/auth');
      
      // Create reCAPTCHA verifier with minimal options first
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // reCAPTCHA expired
        },
        'error-callback': (error: any) => {
          console.error('reCAPTCHA error:', error);
        }
      });

      return this.recaptchaVerifier;
      
    } catch (error) {
      console.error('Error initializing reCAPTCHA:', error);
      throw error;
    }
  }

  // Send OTP to phone number
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; verificationId?: string; error?: string }> {
    // Check if Firebase is properly configured or if we should use mock
    const isConfigured = await isFirebaseConfigured();
    const useMock = !isConfigured || 
                   (typeof window !== 'undefined' && localStorage.getItem('NEXT_PUBLIC_USE_MOCK_AUTH') === 'true');
    
    if (useMock) {
      return mockFirebasePhoneAuth.sendOTP(phoneNumber);
    }

    try {
      // Get Firebase auth instance
      const { getFirebaseAuth } = await import('@/lib/firebase');
      const auth = await getFirebaseAuth();
      
      if (!auth) {
        throw new Error('Firebase auth not available');
      }
      
      // Import signInWithPhoneNumber
      const { signInWithPhoneNumber } = await import('firebase/auth');
      // Validate phone number format first
      if (!phoneNumber || typeof phoneNumber !== 'string') {
        throw new Error('Phone number is required and must be a string');
      }
      
      if (!phoneNumber.startsWith('+')) {
        throw new Error('Phone number must start with country code (e.g., +91)');
      }
      
      if (!/^\+\d{10,15}$/.test(phoneNumber)) {
        throw new Error('Phone number must be in format +[country code][number] (10-15 digits total)');
      }
      
      // Ensure we have a reCAPTCHA container
      let recaptchaContainer = document.getElementById('recaptcha-container');
      if (!recaptchaContainer) {
        const recaptchaDiv = document.createElement('div');
        recaptchaDiv.id = 'recaptcha-container';
        recaptchaDiv.style.display = 'none';
        document.body.appendChild(recaptchaDiv);
      }

      // Initialize reCAPTCHA (always create fresh for phone auth)
      // Clear any existing verifier first
      if (this.recaptchaVerifier) {
        try {
          this.recaptchaVerifier.clear();
        } catch (e) {
          // Ignore clearing errors
        }
        this.recaptchaVerifier = null;
      }
      
      const recaptchaVerifier = await this.initializeRecaptcha(auth);

      // Send verification code
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      
      // Store the confirmation result globally
      currentVerificationResult = confirmationResult;

      return {
        success: true,
        verificationId: confirmationResult.verificationId
      };

    } catch (error: any) {
      console.error('Firebase OTP Error:', error);
      
      // Handle specific Firebase errors
      let errorMessage = 'Failed to send OTP';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 'auth/missing-phone-number') {
        errorMessage = 'Phone number is required';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many SMS requests. Please wait 15-30 minutes before trying again.';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'Daily SMS quota exceeded. Please try again tomorrow or upgrade your Firebase plan.';
      } else if (error.code === 'auth/app-not-authorized') {
        errorMessage = 'App not authorized. Please check Firebase Console authorized domains.';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'reCAPTCHA verification failed. Please refresh and try again.';
      } else if (error.code === 'auth/invalid-app-credential') {
        errorMessage = 'Firebase: Error (auth/invalid-app-credential).';
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Clean up reCAPTCHA on error
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Verify OTP code
  async verifyOTP(otp: string): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
    // Check if Firebase is properly configured
    if (!(await isFirebaseConfigured())) {
      return mockFirebasePhoneAuth.verifyOTP(otp);
    }

    try {
      if (!currentVerificationResult) {
        throw new Error('No verification in progress. Please request OTP first.');
      }

      // Verify the OTP code
      const userCredential = await currentVerificationResult.confirm(otp);
      const user = userCredential.user;

      // Get ID token for backend verification
      const token = await user.getIdToken();

      // Clean up
      currentVerificationResult = null;
      if (this.recaptchaVerifier) {
        this.recaptchaVerifier.clear();
        this.recaptchaVerifier = null;
      }

      return {
        success: true,
        user: {
          uid: user.uid,
          phoneNumber: user.phoneNumber,
          isAnonymous: user.isAnonymous
        },
        token
      };

    } catch (error: any) {
      console.error('Firebase Verify Error:', error);
      
      let errorMessage = 'Invalid OTP code';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP code. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP code has expired. Please request a new one.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  }

  // Clean up resources
  cleanup() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
    currentVerificationResult = null;
  }
}

// Export singleton instance
export const firebasePhoneAuth = new FirebasePhoneAuthService();