// Authentication service for handling login flow
// Based on Sigma2 Android app authentication patterns

import { userStorage } from '@/lib/storage/userStorage';
import { PhonePasswordLoginResponse, AccountType } from '@/types/user';
import { showToast } from '@/lib/toast';

class AuthService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.downxtown.com';

  /**
   * Login with phone and password
   * Handles the complete login flow including data storage
   */
  async loginWithPhonePassword(phoneNumber: string, password: string, accountType: AccountType = AccountType.PERSONAL): Promise<PhonePasswordLoginResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login/phone-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
          password,
          accountType
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
      }

      const loginResponse: PhonePasswordLoginResponse = await response.json();

      if (!loginResponse.success) {
        throw new Error(loginResponse.message || 'Login failed');
      }

      // Process successful login
      await this.processSuccessfulLogin(loginResponse);

      return loginResponse;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Process successful login response
   * Saves tokens and user data to local storage
   */
  private async processSuccessfulLogin(loginResponse: PhonePasswordLoginResponse): Promise<void> {
    const { customFirebaseToken, userId, accountType, initialUser, initialBusiness } = loginResponse;

    if (!customFirebaseToken || !userId || !accountType) {
      throw new Error('Invalid login response: missing required fields');
    }

    try {
      // 1. Sign in with Firebase using custom token
      const { getFirebaseAuth } = await import('@/lib/firebase');
      const { signInWithCustomToken } = await import('firebase/auth');
      const auth = await getFirebaseAuth();
      
      if (!auth) {
        throw new Error('Firebase auth not available');
      }
      
      const userCredential = await signInWithCustomToken(auth, customFirebaseToken);
      console.log('Firebase sign-in successful:', userCredential.user.uid);

      // 2. Save authentication info
      await userStorage.saveAuthInfo(customFirebaseToken, accountType, userId);

      // 3. Save user data based on account type
      if (accountType === AccountType.PERSONAL && initialUser) {
        await userStorage.savePersonalUser(initialUser);
        console.log('Personal user data saved:', initialUser.username);
      } else if (accountType === AccountType.BUSINESS && initialBusiness) {
        await userStorage.saveBusinessUser(initialBusiness);
        console.log('Business user data saved:', initialBusiness.businessName);
      } else {
        console.warn('No user data provided in login response');
      }

      showToast('Login successful!', 'success');
    } catch (error) {
      console.error('Error processing login:', error);
      // Clean up on error
      await userStorage.clearUserData();
      throw new Error('Failed to complete login process');
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return userStorage.isAuthenticated();
  }

  /**
   * Get current account type
   */
  getAccountType(): AccountType | null {
    return userStorage.getAccountType();
  }

  /**
   * Check if user has address
   */
  async hasAddress(): Promise<boolean> {
    return await userStorage.hasAddress();
  }

  /**
   * Get current user data
   */
  async getCurrentUser() {
    return await userStorage.getCurrentUser();
  }

  /**
   * Get user address
   */
  async getUserAddress() {
    return await userStorage.getUserAddress();
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      // Sign out from Firebase
      const { getFirebaseAuth } = await import('@/lib/firebase');
      const auth = await getFirebaseAuth();
      
      if (auth) {
        await auth.signOut();
      }
      
      // Clear local storage
      await userStorage.clearUserData();
      
      showToast('Logged out successfully', 'success');
    } catch (error) {
      console.error('Logout error:', error);
      // Force clear even if Firebase signout fails
      await userStorage.clearUserData();
    }
  }

  /**
   * Validate buy now flow
   * Returns the next step in the ordering process
   */
  async validateBuyNowFlow(): Promise<{
    canProceed: boolean;
    nextStep: 'login' | 'address' | 'checkout';
    message?: string;
  }> {
    // Check authentication
    if (!this.isAuthenticated()) {
      return {
        canProceed: false,
        nextStep: 'login',
        message: 'Please login to continue'
      };
    }

    // Check account type
    const accountType = this.getAccountType();
    if (accountType !== AccountType.PERSONAL) {
      return {
        canProceed: false,
        nextStep: 'login',
        message: 'Only personal accounts can make purchases'
      };
    }

    // Check address
    const hasAddress = await this.hasAddress();
    if (!hasAddress) {
      return {
        canProceed: false,
        nextStep: 'address',
        message: 'Please add your delivery address'
      };
    }

    // All checks passed
    return {
      canProceed: true,
      nextStep: 'checkout'
    };
  }

  /**
   * Get Firebase ID token for API calls
   */
  async getFirebaseIdToken(): Promise<string> {
    const { getFirebaseAuth } = await import('@/lib/firebase');
    const auth = await getFirebaseAuth();
    
    if (!auth) {
      throw new Error('Firebase auth not available');
    }
    
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return await user.getIdToken();
  }

  /**
   * Refresh authentication if needed
   */
  async refreshAuth(): Promise<boolean> {
    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) return false;

      const { getFirebaseAuth } = await import('@/lib/firebase');
      const { signInWithCustomToken } = await import('firebase/auth');
      const auth = await getFirebaseAuth();
      
      if (!auth) return false;

      // Try to sign in with stored token if not already signed in
      if (!auth.currentUser) {
        await signInWithCustomToken(auth, authToken);
      }

      return true;
    } catch (error) {
      console.error('Auth refresh failed:', error);
      // Clear invalid token
      await userStorage.clearUserData();
      return false;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
