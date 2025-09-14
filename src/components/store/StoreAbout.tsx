'use client';

import { Mail, Phone, MapPin, Calendar, ExternalLink, Star, CheckCircle, Instagram, Youtube, Twitter, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { StoreProfileData } from '@/lib/types';

interface StoreAboutProps {
  storeData: StoreProfileData;
}

interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  backgroundColor: string;
  iconColor: string;
  onClick?: () => void;
}

const ContactItem = ({ icon, label, value, backgroundColor, iconColor, onClick }: ContactItemProps) => {
  return (
    <div 
      className="flex items-center p-4 rounded-xl cursor-pointer hover:shadow-sm transition-shadow"
      style={{ backgroundColor }}
      onClick={onClick}
    >
      <div 
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
        style={{ backgroundColor: iconColor }}
      >
        {icon}
      </div>
      
      <div className="ml-4 flex-1">
        <p className="text-xs text-[#757575] font-medium">{label}</p>
        <p className="font-bold text-[#212121] text-base">{value}</p>
      </div>
    </div>
  );
};

interface SocialLinkProps {
  platform: string;
  url: string;
  backgroundColor: string;
  iconColor: string;
  onClick?: () => void;
}

const SocialLink = ({ platform, url, backgroundColor, iconColor, onClick }: SocialLinkProps) => {
  return (
    <div 
      className="flex items-center p-4 rounded-xl cursor-pointer hover:shadow-sm transition-all group"
      style={{ backgroundColor }}
      onClick={onClick}
    >
      <div 
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-white"
        style={{ backgroundColor: iconColor }}
      >
        <span className="text-lg">{getIcon(platform)}</span>
      </div>
      
      <div className="ml-4 flex-1">
        <p className="font-bold text-[#212121]">{platform}</p>
        <p className="text-sm text-[#757575] truncate group-hover:text-[#009CB9] transition-colors">
          {url.replace(/^https?:\/\//, '')}
        </p>
      </div>
      
      <ExternalLink 
        className="w-5 h-5 text-gray-400 group-hover:text-[#009CB9] transition-colors" 
        style={{ color: iconColor, opacity: 0.7 }}
      />
    </div>
  );
};

const getIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram': return '📷';
    case 'facebook': return '👍';
    case 'twitter': return '🐦';
    case 'youtube': return '📺';
    case 'website': return '🌐';
    default: return '🔗';
  }
};

export default function StoreAbout({ storeData }: StoreAboutProps) {
  const formatJoinDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const socialPlatforms = [
    {
      key: 'instagram',
      name: 'Instagram',
      backgroundColor: '#E4405F10',
      iconColor: '#E4405F',
      url: storeData.socialLinks?.instagram,
    },
    {
      key: 'facebook', 
      name: 'Facebook',
      backgroundColor: '#1877F210',
      iconColor: '#1877F2',
      url: storeData.socialLinks?.facebook,
    },
    {
      key: 'twitter',
      name: 'Twitter',
      backgroundColor: '#1DA1F210', 
      iconColor: '#1DA1F2',
      url: storeData.socialLinks?.twitter,
    },
    {
      key: 'youtube',
      name: 'YouTube',
      backgroundColor: '#FF000010',
      iconColor: '#FF0000',
      url: storeData.socialLinks?.youtube,
    },
    {
      key: 'website',
      name: 'Website',
      backgroundColor: '#6366F110',
      iconColor: '#6366F1',
      url: storeData.websiteUrl,
    },
  ].filter(platform => platform.url);

  return (
    <div className="bg-[#F0F8FF]/30 px-4 py-5 space-y-5">
      {/* Store Description */}
      {storeData.storeDescription && (
        <div>
          <div className="flex items-center gap-3 mb-3">
            <Star className="w-6 h-6 text-[#009CB9]" />
            <h3 className="text-lg font-bold text-[#212121]">About</h3>
          </div>
          <p className="text-[#212121] leading-6 text-base px-1">
            {storeData.storeDescription}
          </p>
        </div>
      )}

      {/* Contact Information */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <Phone className="w-6 h-6 text-[#009CB9]" />
          <h3 className="text-lg font-bold text-[#212121]">Contact Information</h3>
        </div>
        <div className="space-y-3">
          <ContactItem
            icon={<Phone className="w-5.5 h-5.5" />}
            label="Phone Number"
            value={storeData.phoneNumber}
            backgroundColor="#F0F8FF"
            iconColor="#009CB9"
            onClick={() => window.open(`tel:${storeData.phoneNumber}`, '_self')}
          />
          
          {storeData.email && (
            <ContactItem
              icon={<Mail className="w-5.5 h-5.5" />}
              label="Email Address"
              value={storeData.email}
              backgroundColor="#BFF2FF"
              iconColor="#16DAFF"
              onClick={() => window.open(`mailto:${storeData.email}`, '_self')}
            />
          )}
          
          {storeData.location && (
            <ContactItem
              icon={<MapPin className="w-5.5 h-5.5" />}
              label="Store Address"
              value={storeData.location}
              backgroundColor="#C7E1FF"
              iconColor="#4285F4"
              onClick={() => storeData.mapLink && window.open(storeData.mapLink, '_blank')}
            />
          )}
        </div>
      </div>

      {/* Social Links */}
      {socialPlatforms.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <ExternalLink className="w-6 h-6 text-[#009CB9]" />
            <h3 className="text-lg font-bold text-[#212121]">Links & Social Media</h3>
          </div>
          <div className="space-y-3">
            {socialPlatforms.map((platform) => (
              <SocialLink
                key={platform.key}
                platform={platform.name}
                url={platform.url!}
                backgroundColor={platform.backgroundColor}
                iconColor={platform.iconColor}
                onClick={() => window.open(platform.url!, '_blank')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Member Since */}
      <div className="bg-[#009CB9]/10 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#009CB9] flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="text-center">
            <p className="font-bold text-[#009CB9] text-base">
              Member since {formatJoinDate(storeData.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}