'use client';

import { Mail, Phone, MapPin, Calendar, ExternalLink, Star, CheckCircle } from 'lucide-react';
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
      className="flex items-center p-4 rounded-xl cursor-pointer hover:shadow-md transition-all"
      style={{ backgroundColor }}
      onClick={onClick}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
        style={{ backgroundColor: iconColor }}
      >
        {icon}
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <p className="text-xs text-[#757575] font-medium mb-0.5">{label}</p>
        <p className="font-bold text-[#212121] text-base truncate">{value}</p>
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
      className="flex items-center p-4 rounded-xl cursor-pointer hover:shadow-md transition-all group"
      style={{ backgroundColor }}
      onClick={onClick}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0"
        style={{ backgroundColor: iconColor }}
      >
        <span className="text-xl">{getIcon(platform)}</span>
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <p className="font-bold text-[#212121] mb-0.5">{platform}</p>
        <p className="text-sm text-[#757575] truncate group-hover:text-[#00838F] transition-colors">
          {url.replace(/^https?:\/\//, '')}
        </p>
      </div>

      <ExternalLink
        className="w-5 h-5 ml-2 opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0"
        style={{ color: iconColor }}
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
      backgroundColor: '#FCE4EC',
      iconColor: '#E4405F',
      url: storeData.socialLinks?.instagram,
    },
    {
      key: 'facebook',
      name: 'Facebook',
      backgroundColor: '#E3F2FD',
      iconColor: '#1877F2',
      url: storeData.socialLinks?.facebook,
    },
    {
      key: 'twitter',
      name: 'Twitter',
      backgroundColor: '#E1F5FE',
      iconColor: '#1DA1F2',
      url: storeData.socialLinks?.twitter,
    },
    {
      key: 'youtube',
      name: 'YouTube',
      backgroundColor: '#FFEBEE',
      iconColor: '#FF0000',
      url: storeData.socialLinks?.youtube,
    },
    {
      key: 'website',
      name: 'Website',
      backgroundColor: '#EDE7F6',
      iconColor: '#6366F1',
      url: storeData.websiteUrl,
    },
  ].filter(platform => platform.url);

  return (
    <div className="bg-white px-6 py-8 max-w-4xl mx-auto">
      {/* About Section */}
      {storeData.storeDescription && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#E0F7FA] rounded-lg flex items-center justify-center">
              <Star className="w-6 h-6 text-[#00838F]" />
            </div>
            <h3 className="text-xl font-bold text-[#212121]">About {storeData.storeName}</h3>
          </div>
          <p className="text-[#424242] leading-7 text-base">
            {storeData.storeDescription}
          </p>
        </div>
      )}

      {/* Store Policies */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#E0F7FA] rounded-lg flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-[#00838F]" />
          </div>
          <h3 className="text-xl font-bold text-[#212121]">Store Policies</h3>
        </div>
        <div className="space-y-3 ml-13">
          <div className="flex items-start gap-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="font-semibold text-[#212121]">Return Policy</p>
              <p className="text-[#757575] text-sm">7 days hassle-free returns</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="font-semibold text-[#212121]">Shipping</p>
              <p className="text-[#757575] text-sm">Free shipping on orders above ₹999</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-lg">✓</span>
            <div>
              <p className="font-semibold text-[#212121]">Contact</p>
              <p className="text-[#757575] text-sm">Available Mon-Sat, 10AM-7PM</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#E0F7FA] rounded-lg flex items-center justify-center">
            <Phone className="w-6 h-6 text-[#00838F]" />
          </div>
          <h3 className="text-xl font-bold text-[#212121]">Contact Information</h3>
        </div>
        <div className="space-y-3">
          <ContactItem
            icon={<Phone className="w-6 h-6" />}
            label="Phone Number"
            value={storeData.phoneNumber}
            backgroundColor="#E0F7FA"
            iconColor="#00BCD4"
            onClick={() => window.open(`tel:${storeData.phoneNumber}`, '_self')}
          />

          {storeData.email && (
            <ContactItem
              icon={<Mail className="w-6 h-6" />}
              label="Email Address"
              value={storeData.email}
              backgroundColor="#B2EBF2"
              iconColor="#0097A7"
              onClick={() => window.open(`mailto:${storeData.email}`, '_self')}
            />
          )}

          {storeData.location && (
            <ContactItem
              icon={<MapPin className="w-6 h-6" />}
              label="Location"
              value={storeData.location}
              backgroundColor="#80DEEA"
              iconColor="#00838F"
              onClick={() => storeData.mapLink && window.open(storeData.mapLink, '_blank')}
            />
          )}
        </div>
      </div>

      {/* Social Links */}
      {socialPlatforms.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#E0F7FA] rounded-lg flex items-center justify-center">
              <ExternalLink className="w-6 h-6 text-[#00838F]" />
            </div>
            <h3 className="text-xl font-bold text-[#212121]">Links & Social Media</h3>
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
      <div className="bg-gradient-to-br from-[#E0F7FA] to-[#B2EBF2] rounded-xl p-6 text-center border border-[#80DEEA]">
        <div className="flex items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#00BCD4] flex items-center justify-center flex-shrink-0">
            <Calendar className="w-7 h-7 text-white" />
          </div>
          <div className="text-left">
            <p className="text-sm text-[#00838F] font-medium mb-1">Member Since</p>
            <p className="text-lg font-bold text-[#00838F]">
              {formatJoinDate(storeData.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
