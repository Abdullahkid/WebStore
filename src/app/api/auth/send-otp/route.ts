import { NextRequest, NextResponse } from 'next/server';
import { AccountType } from '@/types/auth';

interface SendOtpRequest {
  phoneNumber: string;
  accountType: AccountType;
}

export async function POST(request: NextRequest) {
  try {
    const body: SendOtpRequest = await request.json();
    const { phoneNumber, accountType } = body;

    // Validate input
    if (!phoneNumber || !accountType) {
      return NextResponse.json(
        { success: false, error: 'Phone number and account type are required' },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!/^\+91[0-9]{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // For MVP implementation, we'll simulate OTP sending
    // In production, this would integrate with Firebase Phone Auth or SMS service
    console.log(`Simulating OTP send for ${phoneNumber} (${accountType})`);

    // Simulate OTP generation (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP: ${otp} for ${phoneNumber}`);

    // In production, you would:
    // 1. Generate verification ID
    // 2. Send SMS via Firebase or SMS provider
    // 3. Store OTP temporarily (Redis/database) with expiration
    // 4. Return verification ID to client

    // For now, return success response
    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      verificationId: `verify_${Date.now()}_${phoneNumber.replace('+91', '')}`, // Mock verification ID
      // Note: In production, never return the actual OTP
      // This is only for development/testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}