'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  PersonalRegistrationData, 
  Gender, 
  AccountType, 
  ValidationErrors,
  RegistrationStep,
  FirebaseSignInRequest,
  FirebaseSignInResponse
} from '@/types/auth';
import { 
  User, 
  AtSign, 
  Phone, 
  Mail, 
  Calendar, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle,
  UserCheck,
  Heart,
  Sparkles
} from 'lucide-react';
import OtpVerification from './OtpVerification';
import { firebasePhoneAuth } from '@/lib/auth/firebase-phone-auth';

interface PersonalRegistrationProps {
  onRegistrationSuccess?: (userData: any) => void;
  onBack?: () => void;
  redirectPath?: string; // Where to redirect after successful registration
}

export default function PersonalRegistration({ 
  onRegistrationSuccess, 
  onBack, 
  redirectPath 
}: PersonalRegistrationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get redirect path from URL params or use provided redirectPath
  const finalRedirectPath = searchParams.get('redirect') || redirectPath || '/';
  
  // Registration data state
  const [formData, setFormData] = useState<PersonalRegistrationData>({
    name: '',
    username: '',
    phoneNumber: '+91',
    email: '',
    password: '',
    confirmPassword: '',
    gender: null,
    dateOfBirth: null
  });

  // UI state
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [verificationId, setVerificationId] = useState<string | null>(null);

  // Registration steps configuration
  const steps: RegistrationStep[] = [
    {
      id: 0,
      title: "Basic Information",
      description: "Let's start with your basic details",
      isValid: false
    },
    {
      id: 1,
      title: "Personal Details", 
      description: "Tell us a bit more about yourself",
      isValid: false
    },
    {
      id: 2,
      title: "Create Password",
      description: "Secure your account with a strong password",
      isValid: false
    }
  ];

  // Validation functions
  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (!formData.phoneNumber.replace('+91', '').trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^\+91[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid Indian phone number';
      isValid = false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 13) {
        newErrors.dateOfBirth = 'You must be at least 13 years old';
        isValid = false;
      }
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateStep3 = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateStep3()) return;

    setIsLoading(true);
    setGeneralError(null);

    try {
      // Convert date of birth to Unix timestamp (matching Android)
      const dobTimestamp = formData.dateOfBirth 
        ? new Date(formData.dateOfBirth).getTime() / 1000 
        : null;

      // Prepare extra data for Firebase sign-in (matches Android structure)
      const extraData: Record<string, string> = {
        name: formData.name,
        username: formData.username,
        password: formData.password
      };

      if (formData.gender) {
        extraData.gender = formData.gender;
      }

      if (dobTimestamp) {
        extraData.dateOfBirth = dobTimestamp.toString();
      }

      if (formData.email) {
        extraData.email = formData.email;
      }

      // Step 1: Send OTP using Firebase Phone Auth
      const otpResult = await firebasePhoneAuth.sendOTP(formData.phoneNumber);
      
      if (!otpResult.success) {
        throw new Error(otpResult.error || 'Failed to send OTP');
      }
      
      // Store verification ID and show OTP verification
      setVerificationId(otpResult.verificationId || 'firebase_verification');
      setShowOtpVerification(true);
      
    } catch (error) {
      console.error('Registration error:', error);
      setGeneralError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle next step
  const handleNext = () => {
    let canProceed = false;
    
    switch (currentStep) {
      case 0:
        canProceed = validateStep1();
        break;
      case 1:
        canProceed = validateStep2();
        break;
      case 2:
        handleSubmit();
        return;
    }

    if (canProceed) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else if (onBack) {
      onBack();
    }
  };

  // Update form data
  const updateFormData = (field: keyof PersonalRegistrationData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for the field being updated
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Render step progress indicator
  const renderProgressIndicator = () => (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className={`
            relative flex items-center justify-center w-12 h-12 rounded-2xl text-sm font-semibold transition-all duration-500 hover-lift
            ${index <= currentStep
              ? 'gradient-primary text-white shadow-brand'
              : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
            }
          `}>
            <div className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${
              index <= currentStep ? 'opacity-100' : 'opacity-0'
            }`}>
              <div className="absolute inset-0 gradient-primary rounded-2xl animate-pulse opacity-30"></div>
            </div>
            <div className="relative z-10">
              {index < currentStep ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <span className="font-bold">{index + 1}</span>
              )}
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`
              w-20 h-2 mx-3 rounded-full transition-all duration-500
              ${index < currentStep
                ? 'gradient-primary shadow-soft'
                : 'bg-gray-200'
              }
            `} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  // Render basic information step
  const renderBasicInfoStep = () => (
    <div className="space-y-7">
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Full Name *
        </label>
        <div className="relative">
          <User className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
            errors.name ? 'text-red-400' : formData.name ? 'text-brand-primary' : 'text-gray-400'
          }`} />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className={`
              w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 font-medium
              bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white
              focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary
              ${errors.name
                ? 'border-red-300 focus:border-red-500'
                : formData.name
                  ? 'border-brand-primary/40'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
            placeholder="Enter your full name"
          />
        </div>
        {errors.name && <p className="mt-2 text-sm text-red-600 font-medium animate-slide-up">{errors.name}</p>}
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Username *
        </label>
        <div className="relative">
          <AtSign className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
            errors.username ? 'text-red-400' : formData.username ? 'text-brand-primary' : 'text-gray-400'
          }`} />
          <input
            type="text"
            value={formData.username}
            onChange={(e) => updateFormData('username', e.target.value.toLowerCase())}
            className={`
              w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 font-medium
              bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white
              focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary
              ${errors.username
                ? 'border-red-300 focus:border-red-500'
                : formData.username
                  ? 'border-brand-primary/40'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
            placeholder="Choose a unique username"
          />
        </div>
        {errors.username && <p className="mt-2 text-sm text-red-600 font-medium animate-slide-up">{errors.username}</p>}
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Phone Number *
        </label>
        <div className="relative">
          <Phone className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
            errors.phoneNumber ? 'text-red-400' : formData.phoneNumber !== '+91' ? 'text-brand-primary' : 'text-gray-400'
          }`} />
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => {
              let value = e.target.value;
              if (!value.startsWith('+91')) {
                value = '+91' + value.replace(/^\+91/, '');
              }
              updateFormData('phoneNumber', value);
            }}
            className={`
              w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 font-medium
              bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white
              focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary
              ${errors.phoneNumber
                ? 'border-red-300 focus:border-red-500'
                : formData.phoneNumber !== '+91'
                  ? 'border-brand-primary/40'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
            placeholder="+91XXXXXXXXXX"
          />
        </div>
        {errors.phoneNumber && <p className="mt-2 text-sm text-red-600 font-medium animate-slide-up">{errors.phoneNumber}</p>}
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Email <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <Mail className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
            errors.email ? 'text-red-400' : formData.email ? 'text-brand-primary' : 'text-gray-400'
          }`} />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={`
              w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 font-medium
              bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white
              focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary
              ${errors.email
                ? 'border-red-300 focus:border-red-500'
                : formData.email
                  ? 'border-brand-primary/40'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
            placeholder="your.email@example.com"
          />
        </div>
        {errors.email && <p className="mt-2 text-sm text-red-600 font-medium animate-slide-up">{errors.email}</p>}
      </div>
    </div>
  );

  // Render personal details step
  const renderPersonalDetailsStep = () => (
    <div className="space-y-8">
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Date of Birth *
        </label>
        <div className="relative">
          <Calendar className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
            errors.dateOfBirth ? 'text-red-400' : formData.dateOfBirth ? 'text-brand-primary' : 'text-gray-400'
          }`} />
          <input
            type="date"
            value={formData.dateOfBirth || ''}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            max={new Date(Date.now() - 13 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            className={`
              w-full pl-12 pr-4 py-4 border-2 rounded-2xl transition-all duration-300 font-medium
              bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white
              focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary
              ${errors.dateOfBirth
                ? 'border-red-300 focus:border-red-500'
                : formData.dateOfBirth
                  ? 'border-brand-primary/40'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
          />
        </div>
        {errors.dateOfBirth && <p className="mt-2 text-sm text-red-600 font-medium animate-slide-up">{errors.dateOfBirth}</p>}
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-5">
          Gender *
        </label>
        <div className="grid grid-cols-3 gap-4">
          {Object.values(Gender).map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => updateFormData('gender', gender)}
              className={`
                group relative p-5 border-2 rounded-2xl text-center transition-all duration-300 hover-lift
                backdrop-blur-sm font-medium
                ${formData.gender === gender
                  ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-brand'
                  : 'border-gray-200 bg-white/40 hover:border-gray-300 hover:bg-white/60 text-gray-600'
                }
              `}
            >
              <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                formData.gender === gender ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute inset-0 bg-brand-primary/5 rounded-2xl animate-pulse"></div>
              </div>
              <div className="relative z-10 flex flex-col items-center space-y-3">
                <div className={`transition-all duration-300 ${
                  formData.gender === gender ? 'scale-110' : 'group-hover:scale-105'
                }`}>
                  {gender === Gender.MALE && <UserCheck className="w-7 h-7" />}
                  {gender === Gender.FEMALE && <Heart className="w-7 h-7" />}
                  {gender === Gender.OTHER && <Sparkles className="w-7 h-7" />}
                </div>
                <span className="text-sm font-semibold capitalize tracking-wide">
                  {gender.toLowerCase()}
                </span>
              </div>
            </button>
          ))}
        </div>
        {errors.gender && <p className="mt-3 text-sm text-red-600 font-medium animate-slide-up text-center">{errors.gender}</p>}
      </div>
    </div>
  );

  // Render password step
  const renderPasswordStep = () => (
    <div className="space-y-7">
      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Password *
        </label>
        <div className="relative">
          <Lock className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
            errors.password ? 'text-red-400' : formData.password ? 'text-brand-primary' : 'text-gray-400'
          }`} />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            className={`
              w-full pl-12 pr-14 py-4 border-2 rounded-2xl transition-all duration-300 font-medium
              bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white
              focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary
              ${errors.password
                ? 'border-red-300 focus:border-red-500'
                : formData.password
                  ? 'border-brand-primary/40'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
            placeholder="Create a strong password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-gray-400 hover:text-brand-primary transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="mt-2 text-sm text-red-600 font-medium animate-slide-up">{errors.password}</p>}
      </div>

      <div className="group">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Confirm Password *
        </label>
        <div className="relative">
          <Lock className={`absolute left-4 top-4 h-5 w-5 transition-colors duration-200 ${
            errors.confirmPassword ? 'text-red-400' : formData.confirmPassword ? 'text-brand-primary' : 'text-gray-400'
          }`} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            className={`
              w-full pl-12 pr-14 py-4 border-2 rounded-2xl transition-all duration-300 font-medium
              bg-white/50 backdrop-blur-sm hover:bg-white/80 focus:bg-white
              focus:ring-4 focus:ring-brand-primary/20 focus:border-brand-primary
              ${errors.confirmPassword
                ? 'border-red-300 focus:border-red-500'
                : formData.confirmPassword
                  ? 'border-brand-primary/40'
                  : 'border-gray-200 hover:border-gray-300'
              }
            `}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-4 text-gray-400 hover:text-brand-primary transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="mt-2 text-sm text-red-600 font-medium animate-slide-up">{errors.confirmPassword}</p>}
      </div>

      {/* Password requirements */}
      <div className="bg-gradient-to-br from-gray-50/80 to-gray-100/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200/50">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
          <Lock className="w-4 h-4 mr-2 text-brand-primary" />
          Password Requirements
        </h4>
        <div className="space-y-3 text-sm">
          <div className={`flex items-center transition-all duration-300 ${
            formData.password.length >= 6 ? 'text-green-600' : 'text-gray-500'
          }`}>
            <CheckCircle className={`w-5 h-5 mr-3 transition-all duration-300 ${
              formData.password.length >= 6 ? 'text-green-500 scale-110' : 'text-gray-400'
            }`} />
            <span className="font-medium">At least 6 characters long</span>
          </div>
          <div className={`flex items-center transition-all duration-300 ${
            formData.password && formData.password === formData.confirmPassword && formData.password.length > 0
              ? 'text-green-600' : 'text-gray-500'
          }`}>
            <CheckCircle className={`w-5 h-5 mr-3 transition-all duration-300 ${
              formData.password && formData.password === formData.confirmPassword && formData.password.length > 0
                ? 'text-green-500 scale-110' : 'text-gray-400'
            }`} />
            <span className="font-medium">Passwords match</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Show OTP verification if needed
  if (showOtpVerification && verificationId) {
    const extraData: Record<string, string> = {
      name: formData.name,
      username: formData.username,
      password: formData.password
    };

    if (formData.gender) {
      extraData.gender = formData.gender;
    }

    if (formData.dateOfBirth) {
      const dobTimestamp = new Date(formData.dateOfBirth).getTime() / 1000;
      extraData.dateOfBirth = dobTimestamp.toString();
    }

    if (formData.email) {
      extraData.email = formData.email;
    }

    return (
      <OtpVerification
        phoneNumber={formData.phoneNumber}
        verificationId={verificationId}
        accountType={AccountType.PERSONAL}
        extraData={extraData}
        onVerificationSuccess={onRegistrationSuccess}
        onBack={() => setShowOtpVerification(false)}
        redirectPath={finalRedirectPath}
      />
    );
  }

  return (
    <div className="min-h-screen gradient-subtle flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-lg w-full glass-card rounded-2xl shadow-premium p-8 animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-brand hover-glow">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Join Downxtown
          </h1>
          <p className="text-gray-600 mt-3 text-lg font-medium">{steps[currentStep].description}</p>
        </div>

        {/* Progress indicator */}
        {renderProgressIndicator()}

        {/* Form content */}
        <div className="mb-10">
          <div className="animate-fade-in">
            {currentStep === 0 && renderBasicInfoStep()}
            {currentStep === 1 && renderPersonalDetailsStep()}
            {currentStep === 2 && renderPasswordStep()}
          </div>
        </div>

        {/* Error message */}
        {generalError && (
          <div className="mb-8 p-5 bg-gradient-to-br from-red-50/80 to-red-100/60 backdrop-blur-sm border-2 border-red-200/50 rounded-2xl animate-slide-up">
            <div className="flex items-start">
              <div className="w-5 h-5 mt-0.5 mr-3 text-red-500 flex-shrink-0">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-sm text-red-700 font-medium">{generalError}</p>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-5">
          <button
            onClick={handlePrevious}
            className="flex-1 flex items-center justify-center px-6 py-4 border-2 border-gray-200 rounded-2xl text-gray-700 hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-300 font-semibold backdrop-blur-sm hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5 mr-3" />
            {currentStep === 0 ? 'Back' : 'Previous'}
          </button>

          <button
            onClick={handleNext}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center px-6 py-4 gradient-primary text-white rounded-2xl hover:shadow-brand transition-all duration-300 font-semibold hover-lift disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <div className="relative z-10 flex items-center">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {currentStep === steps.length - 1 ? 'Register' : 'Next'}
                  {currentStep < steps.length - 1 && <ArrowRight className="w-5 h-5 ml-3" />}
                </>
              )}
            </div>
          </button>
        </div>

        {/* Login link */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600 font-medium">
            Already have an account?{' '}
            <button
              onClick={() => router.push('/login')}
              className="text-brand-primary hover:text-brand-secondary font-semibold transition-colors duration-200 relative group"
            >
              Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
          </p>
        </div>
      </div>
      
      {/* Hidden reCAPTCHA container for Firebase Phone Auth */}
      <div id="recaptcha-container" style={{ display: 'none' }}></div>
    </div>
  );
}