import { NextRequest, NextResponse } from 'next/server';
import {
  AccountType,
  FirebaseSignInRequest,
  FirebaseSignInResponse
} from '@/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body: FirebaseSignInRequest = await request.json();
    const { token, accountType, extraData } = body;

    // Validate input
    if (!token || !accountType) {
      return NextResponse.json(
        { success: false, error: 'Firebase token and account type are required' },
        { status: 400 }
      );
    }

    // For MVP implementation, we'll simulate backend registration
    // In production, this would make a request to your Ktor backend
    console.log('Simulating Firebase sign-in with backend:', {
      accountType,
      extraData: extraData ? Object.keys(extraData) : []
    });

    // Check if this is a mock token (for development/testing)
    if (token.startsWith('mock_firebase_token_')) {
      console.log('🔧 Development: Handling mock Firebase token');

      // In development, create a mock successful response
      if (process.env.NODE_ENV === 'development') {
        const mockResponse: FirebaseSignInResponse = {
          success: true,
          accountType,
          userId: `mock_user_${Date.now()}`,
          isNewUser: true,
          message: 'Registration successful (mock mode)',
          initialUser: accountType === AccountType.PERSONAL ? {
            id: `mock_user_${Date.now()}`,
            phoneNumber: extraData?.phoneNumber || '',
            name: extraData?.name || 'Test User',
            personalUsername: extraData?.username || 'testuser',
            createdAt: Date.now(),
            friendsCount: 0,
            followingCount: 0,
            purchaseCount: 0,
            wishlistItemsCount: 0,
            cartItemsCount: 0,
            profileVisibility: 'PUBLIC' as any
          } : undefined
        };

        return NextResponse.json(mockResponse);
      }
    }

    try {
      // Make request to Ktor backend (same endpoint as Android)
      const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.downxtown.com';
      const fullUrl = `${backendUrl}/api/v1/auth/firebase-signin`;

      const backendResponse = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          accountType,
          extraData
        }),
      });

      if (!backendResponse.ok) {
        const errorData = await backendResponse.json().catch(() => ({}));
        throw new Error(errorData.message || 'Backend registration failed');
      }

      const backendData: FirebaseSignInResponse = await backendResponse.json();

      // Return the backend response
      return NextResponse.json(backendData);

    } catch (backendError) {
      console.error('Backend request failed:', backendError);

      // For MVP, return a mock success response if backend is unavailable
      if (process.env.NODE_ENV === 'development') {
        console.log('Falling back to mock response for development');

        const mockResponse: FirebaseSignInResponse = {
          success: true,
          accountType,
          userId: `mock_user_${Date.now()}`,
          isNewUser: true,
          message: 'Registration successful (development mode)',
          initialUser: accountType === AccountType.PERSONAL ? {
            id: `mock_user_${Date.now()}`,
            phoneNumber: extraData?.phoneNumber || '',
            name: extraData?.name || 'Test User',
            personalUsername: extraData?.username || 'testuser',
            createdAt: Date.now(),
            friendsCount: 0,
            followingCount: 0,
            purchaseCount: 0,
            wishlistItemsCount: 0,
            cartItemsCount: 0,
            profileVisibility: 'PUBLIC' as any
          } : undefined
        };

        return NextResponse.json(mockResponse);
      }

      // In production, return the actual error
      throw backendError;
    }

  } catch (error) {
    console.error('Error in Firebase sign-in:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      },
      { status: 500 }
    );
  }
}