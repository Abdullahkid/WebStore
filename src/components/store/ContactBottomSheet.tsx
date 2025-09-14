'use client';

import { useState } from 'react';
import { X, Phone, MessageCircle, Mail, MapPin, Clock, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import OptimizedImage from '@/components/shared/OptimizedImage';
import type { StoreProfileData } from '@/lib/types';

interface ContactBottomSheetProps {
  storeData: StoreProfileData;
  onDismiss: () => void;
}

export default function ContactBottomSheet({ storeData, onDismiss }: ContactBottomSheetProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(storeData.phoneNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Store',
      subtitle: storeData.phoneNumber,
      action: () => window.open(`tel:${storeData.phoneNumber}`, '_self'),
      color: 'text-[#009CB9]',
      bg: 'bg-[#009CB9]/10',
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Chat',
      subtitle: 'Quick response guaranteed',
      action: () => {
        const cleanNumber = storeData.phoneNumber.replace(/[^\d]/g, '');
        const message = `Hi ${storeData.storeName}, I'm interested in your products.`;
        window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
      },
      color: 'text-[#25D366]',
      bg: 'bg-[#25D366]/10',
    },
    {
      icon: Mail,
      title: 'Email Store',
      subtitle: 'support@downxtown.com',
      action: () => window.open(`mailto:support@downxtown.com?subject=Inquiry about ${storeData.storeName}`, '_self'),
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-t-3xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-gray-100">
              {storeData.storeLogo ? (
                <OptimizedImage
                  imageId={storeData.storeLogo}
                  alt={`${storeData.storeName} logo`}
                  variant="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#009CB9] to-[#16DAFF] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {storeData.storeName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{storeData.storeName}</h3>
              <p className="text-gray-600 text-sm">Contact Store</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="rounded-full w-10 h-10 p-0"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Contact Methods */}
        <div className="p-6 space-y-4">
          {contactMethods.map((method, index) => (
            <button
              key={index}
              onClick={method.action}
              className="w-full flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-lg hover:border-[#009CB9]/30 transition-all duration-200 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${method.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <method.icon className={`w-6 h-6 ${method.color}`} />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-semibold text-gray-900 group-hover:text-[#009CB9] transition-colors">
                  {method.title}
                </h4>
                <p className="text-sm text-gray-600">{method.subtitle}</p>
              </div>
              <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-[#009CB9] transition-colors" />
            </button>
          ))}

          {/* Copy Phone Number */}
          <button
            onClick={handleCopyPhone}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:bg-gray-100 transition-all duration-200"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-200 flex items-center justify-center">
              <Copy className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-gray-900">Copy Phone Number</h4>
              <p className="text-sm text-gray-600">
                {copied ? 'Copied to clipboard!' : storeData.phoneNumber}
              </p>
            </div>
          </button>
        </div>

        {/* Store Hours */}
        <div className="px-6 pb-6">
          <div className="bg-[#009CB9]/5 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-[#009CB9]" />
              <span className="font-semibold text-gray-900">Store Hours</span>
            </div>
            <p className="text-sm text-gray-600">
              Open 24/7 • Responds within 30 minutes
            </p>
          </div>
        </div>

        {/* Safe Area for Mobile */}
        <div className="h-6 bg-white rounded-b-3xl"></div>
      </div>
    </div>
  );
}