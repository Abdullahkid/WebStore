// Temporary mock Firebase Phone Auth for testing when Firebase config is incomplete
// This allows you to test the registration flow while setting up Firebase properly

export class MockFirebasePhoneAuthService {
  private mockOtp: string = '';
  private mockVerificationId: string = '';

  // Mock OTP sending
  async sendOTP(phoneNumber: string): Promise<{ success: boolean; verificationId?: string; error?: string }> {
    try {
      // Validate phone number format
      if (!/^\+91[0-9]{10}$/.test(phoneNumber)) {
        return {
          success: false,
          error: 'Invalid phone number format. Use +91XXXXXXXXXX'
        };
      }

      // Generate mock OTP and verification ID
      this.mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      this.mockVerificationId = `mock_verify_${Date.now()}`;
      
      return {
        success: true,
        verificationId: this.mockVerificationId
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Mock OTP send failed'
      };
    }
  }

  // Mock OTP verification
  async verifyOTP(otp: string): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
    try {
      if (!this.mockOtp || !this.mockVerificationId) {
        return {
          success: false,
          error: 'No verification in progress. Please request OTP first.'
        };
      }

      // Check if OTP matches
      if (otp !== this.mockOtp) {
        return {
          success: false,
          error: 'Invalid OTP code. Please check and try again.'
        };
      }

      // Generate mock Firebase token
      const mockToken = `mock_firebase_token_${Date.now()}_verified`;
      
      // Clear mock data
      this.mockOtp = '';
      this.mockVerificationId = '';

      return {
        success: true,
        user: {
          uid: `mock_user_${Date.now()}`,
          phoneNumber: '+91XXXXXXXXXX',
          isAnonymous: false
        },
        token: mockToken
      };

    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Mock OTP verification failed'
      };
    }
  }

  // Cleanup (no-op for mock)
  cleanup() {
    this.mockOtp = '';
    this.mockVerificationId = '';
  }
}

// Export mock instance
export const mockFirebasePhoneAuth = new MockFirebasePhoneAuthService();