// User types based on backend DTOs and Android app entities

export enum AccountType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS'
}

export interface AddressDto {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
  addressType?: 'HOME' | 'WORK' | 'OTHER';
}

export interface PersonalDto {
  id: string;
  username: string;
  email?: string;
  phoneNumber: string;
  fullName: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: AddressDto;
  isVerified: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface BusinessDto {
  id: string;
  username: string;
  email?: string;
  phoneNumber: string;
  businessName: string;
  businessType: string;
  businessDescription?: string;
  businessAddress?: AddressDto;
  businessLogo?: string;
  businessBanner?: string;
  isVerified: boolean;
  createdAt: number;
  updatedAt: number;
}

// Login response from backend
export interface PhonePasswordLoginResponse {
  success: boolean;
  message: string;
  customFirebaseToken?: string;
  userId?: string;
  accountType?: AccountType;
  initialBusiness?: BusinessDto;
  initialUser?: PersonalDto;
}

// Local storage structure (based on Android Room entities)
export interface StoredPersonalUser {
  id: string;
  username: string;
  email?: string;
  phoneNumber: string;
  fullName: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: string;
  isVerified: boolean;
  createdAt: number;
  updatedAt: number;
  // Address stored separately
}

export interface StoredAddress {
  userId: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  landmark?: string;
  addressType?: 'HOME' | 'WORK' | 'OTHER';
  createdAt: number;
  updatedAt: number;
}

export interface StoredBusinessUser {
  id: string;
  username: string;
  email?: string;
  phoneNumber: string;
  businessName: string;
  businessType: string;
  businessDescription?: string;
  businessLogo?: string;
  businessBanner?: string;
  isVerified: boolean;
  createdAt: number;
  updatedAt: number;
  // Business address stored separately
}
