// Authentication and Registration Types
// Mirrors Android data structures for compatibility

export enum AccountType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

// Personal Registration Data Structure
export interface PersonalRegistrationData {
  name: string;
  username: string;
  phoneNumber: string;
  email?: string;
  password: string;
  confirmPassword: string;
  gender: Gender | null;
  dateOfBirth: string | null; // ISO date string (YYYY-MM-DD)
}

// Firebase Sign-in Request (matches Android)
export interface FirebaseSignInRequest {
  token: string;
  accountType: AccountType;
  extraData?: Record<string, string>;
}

// Firebase Sign-in Response (matches Android)
export interface FirebaseSignInResponse {
  success: boolean;
  accountType: AccountType;
  userId: string;
  isNewUser: boolean;
  message?: string;
  initialUser?: PersonalDto;
  initialBusiness?: BusinessDto;
}

// Personal DTO (matches Android)
export interface PersonalDto {
  id: string;
  email?: string;
  phoneNumber: string;
  createdAt: number;
  firebaseUid?: string;
  name: string;
  personalUsername: string;
  profileImage?: string;
  gender?: Gender;
  dateOfBirth?: number; // Unix timestamp
  personalAddress?: Address;
  upiId?: string;
  bankAccount?: string;
  friendsCount: number;
  followingCount: number;
  purchaseCount: number;
  wishlistItemsCount: number;
  cartItemsCount: number;
  currentLocation?: Point;
  profileVisibility: ProfileVisibility;
}

export interface BusinessDto {
  id: string;
  businessName: string;
  ownerName: string;
  email?: string;
  phoneNumber: string;
  completionStage?: BusinessSetupStage;
  // Add other business fields as needed
}

export interface Address {
  addressLine1: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface Point {
  type: string;
  coordinates: [number, number]; // [longitude, latitude]
}

export enum ProfileVisibility {
  PUBLIC = 'PUBLIC',
  FRIENDS_ONLY = 'FRIENDS_ONLY',
  PRIVATE = 'PRIVATE'
}

export enum BusinessSetupStage {
  ACCOUNT_CREATION = 'ACCOUNT_CREATION',
  STORE_TYPE_SELECTION = 'STORE_TYPE_SELECTION',
  STORE_DETAILS = 'STORE_DETAILS',
  GST_VERIFICATION = 'GST_VERIFICATION',
  ADDRESS = 'ADDRESS',
  BRAND_TYPE = 'BRAND_TYPE',
  BRAND_INFO = 'BRAND_INFO',
  COMPLETED = 'COMPLETED',
  ACTIVE = 'ACTIVE'
}

// Registration Step Types
export interface RegistrationStep {
  id: number;
  title: string;
  description: string;
  isValid: boolean;
}

// OTP Verification Types
export interface OtpVerificationRequest {
  phoneNumber: string;
  otp: string;
  verificationId: string;
}

export interface OtpVerificationResponse {
  success: boolean;
  firebaseToken?: string;
  message?: string;
}

// Validation Error Types
export interface ValidationErrors {
  name?: string;
  username?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  gender?: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}