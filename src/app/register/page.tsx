import PersonalRegistration from '@/components/auth/PersonalRegistration';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account - Downxtown',
  description: 'Join Downxtown and start your shopping journey. Create a personal account to discover amazing products and connect with friends.',
  keywords: ['Downxtown', 'register', 'create account', 'sign up', 'join'],
};

export default function RegisterPage() {
  return <PersonalRegistration />;
}