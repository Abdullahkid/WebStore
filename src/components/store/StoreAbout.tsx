'use client';

import { Mail, Phone, MapPin, Calendar, ExternalLink, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { StoreProfileData } from '@/lib/types';

interface StoreAboutProps {
  storeData: StoreProfileData;
}

interface ContactItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  onClick?: () => void;
}

const ContactItem = ({ icon, label, value, href, onClick }: ContactItemProps) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={handleClick}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-[#009CB9]/10 flex items-center justify-center text-[#009CB9]">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#212121]">{label}</p>
          <p className="text-sm text-[#757575] truncate">{value}</p>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400" />
      </div>
    </Card>
  );
};

interface SocialLinkProps {
  platform: string;
  url: string;
  color: string;
  icon: string;
}

const SocialLink = ({ platform, url, color, icon }: SocialLinkProps) => {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="p-4 hover:shadow-md transition-all cursor-pointer group" onClick={handleClick}>
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-[#212121]">{platform}</p>
          <p className="text-sm text-[#757575] truncate group-hover:text-[#009CB9] transition-colors">
            {url.replace(/^https?:\/\//, '')}
          </p>
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#009CB9] transition-colors" />
      </div>
    </Card>
  );
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
      color: '#E4405F',
      icon: '📷',
      url: storeData.socialLinks?.instagram,
    },
    {
      key: 'facebook', 
      name: 'Facebook',
      color: '#1877F2',
      icon: '👍',
      url: storeData.socialLinks?.facebook,
    },
    {
      key: 'twitter',
      name: 'Twitter',
      color: '#1DA1F2', 
      icon: '🐦',
      url: storeData.socialLinks?.twitter,
    },
    {
      key: 'youtube',
      name: 'YouTube',
      color: '#FF0000',
      icon: '📺',
      url: storeData.socialLinks?.youtube,
    },
    {
      key: 'website',
      name: 'Website',
      color: '#6366F1',
      icon: '🌐',
      url: storeData.websiteUrl,
    },
  ].filter(platform => platform.url);

  return (
    <div className="space-y-6">
      {/* Store Description */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 text-[#009CB9]" />
          <h3 className="text-lg font-semibold text-[#212121]">About This Store</h3>
        </div>
        <p className="text-[#212121] leading-7 text-base">
          {storeData.storeDescription || `Welcome to ${storeData.storeName}! We're passionate about providing you with the best products and excellent customer service.`}
        </p>
      </Card>

      {/* Contact Information */}
      <div>
        <h3 className="text-lg font-semibold text-[#212121] mb-4">Contact Information</h3>
        <div className="space-y-3">
          <ContactItem
            icon={<Phone className="w-5 h-5" />}
            label="Phone Number"
            value={storeData.phoneNumber}
            href={`tel:${storeData.phoneNumber}`}
          />
          
          {storeData.email && (
            <ContactItem
              icon={<Mail className="w-5 h-5" />}
              label="Email Address"
              value={storeData.email}
              href={`mailto:${storeData.email}`}
            />
          )}
          
          {storeData.location && (
            <ContactItem
              icon={<MapPin className="w-5 h-5" />}
              label="Location"
              value={storeData.location}
              href={storeData.mapLink}
            />
          )}
        </div>
      </div>

      {/* Social Links */}
      {socialPlatforms.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-[#212121] mb-4">Social Media & Links</h3>
          <div className="space-y-3">
            {socialPlatforms.map((platform) => (
              <SocialLink
                key={platform.key}
                platform={platform.name}
                url={platform.url!}
                color={platform.color}
                icon={platform.icon}
              />
            ))}
          </div>
        </div>
      )}

      {/* Member Since */}
      <Card className="p-6 bg-gradient-to-r from-[#009CB9]/5 to-[#16DAFF]/5 border-[#009CB9]/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#009CB9] flex items-center justify-center">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-medium text-[#212121]">Member Since</p>
            <p className="text-[#009CB9] font-semibold">{formatJoinDate(storeData.createdAt)}</p>
          </div>
        </div>
      </Card>

      {/* Store Stats Summary */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-[#212121] mb-4">Store Statistics</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#009CB9] mb-1">
              {storeData.productsCount}
            </div>
            <div className="text-sm text-[#757575]">Products Listed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#009CB9] mb-1">
              {storeData.followersCount}
            </div>
            <div className="text-sm text-[#757575]">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#009CB9] mb-1">
              {storeData.storeRating.toFixed(1)}⭐
            </div>
            <div className="text-sm text-[#757575]">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#009CB9] mb-1">
              {storeData.storeCategory.replace('_', ' ')}
            </div>
            <div className="text-sm text-[#757575]">Category</div>
          </div>
        </div>
      </Card>

      {/* Call to Action */}
      <Card className="p-6 bg-gradient-to-r from-[#009CB9] to-[#16DAFF] text-white">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Love this store?</h3>
          <p className="text-white/90">
            Download the Downxtown app for the full shopping experience!
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              variant="secondary"
              className="bg-white text-[#009CB9] hover:bg-gray-100 font-semibold"
              onClick={() => window.open('https://play.google.com/store/apps/details?id=com.downxtown.app', '_blank')}
            >
              Download App
            </Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.open(`tel:${storeData.phoneNumber}`, '_self')}
            >
              Call Store
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}