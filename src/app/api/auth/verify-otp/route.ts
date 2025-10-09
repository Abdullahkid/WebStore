import { NextRequest, NextResponse } from 'next/server';
import { 
  AccountType, 
  FirebaseSignInRequest, 
  FirebaseSignInResponse,
  OtpVerificationRequest 
} from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: OtpVerificationRequest = await request.json();
    const { phoneNumber, otp, verificationId } = body;

    // Validate input
    if (!phoneNumber || !otp || !verificationId) {
      return NextResponse.json(
        { success: false, error: 'Phone number, OTP, and verification ID are required' },
        { status: 400 }
      );
    }

    // Validate OTP format (6 digits)
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'OTP must be a 6-digit number' },
        { status: 400 }
      );
    }

    // For MVP implementation, we'll simulate OTP verification
    // In production, this would verify with Firebase or SMS service
    console.log(`Verifying OTP ${otp} for ${phoneNumber} with verification ID: ${verificationId}`);

    // Simulate OTP verification
    // In production, you would:
    // 1. Retrieve stored OTP using verificationId
    // 2. Compare with provided OTP
    // 3. Check expiration
    // 4. Generate Firebase custom token or ID token

    // For MVP, accept any 6-digit OTP for development
    const isValidOtp = otp.length === 6;

    if (!isValidOtp) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Generate mock Firebase token for development
    const mockFirebaseToken = `mock_firebase_token_${Date.now()}_${phoneNumber.replace('+91', '')}`;

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      firebaseToken: mockFirebaseToken
    });

  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}