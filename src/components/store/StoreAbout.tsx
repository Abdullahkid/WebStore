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

      //{/* Store Policies */}
      //<div className="mb-8">
      //  <div className="flex items-center gap-3 mb-4">
      //    <div className="w-10 h-10 bg-[#E0F7FA] rounded-lg flex items-center justify-center">
      //      <CheckCircle className="w-6 h-6 text-[#00838F]" />
      //    </div>
      //    <h3 className="text-xl font-bold text-[#212121]">Store Policies</h3>
      //  </div>
      //  <div className="space-y-3 ml-13">
      //    <div className="flex items-start gap-3">
      //      <span className="text-lg">✓</span>
      //      <div>
      //        <p className="font-semibold text-[#212121]">Return Policy</p>
      //        <p className="text-[#757575] text-sm">7 days hassle-free returns</p>
      //      </div>
      //    </div>
      //    <div className="flex items-start gap-3">
      //      <span className="text-lg">✓</span>
      //      <div>
      //        <p className="font-semibold text-[#212121]">Shipping</p>
      //        <p className="text-[#757575] text-sm">Free shipping on orders above ₹999</p>
      //      </div>
      //    </div>
      //    <div className="flex items-start gap-3">
      //      <span className="text-lg">✓</span>
      //      <div>
      //        <p className="font-semibold text-[#212121]">Contact</p>
      //        <p className="text-[#757575] text-sm">Available Mon-Sat, 10AM-7PM</p>
      //      </div>
      //    </div>
      //  </div>
      //</div>

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

          <ContactItem
            icon={
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            }
            label="WhatsApp Number"
            value={storeData.whatsappNumber ?? storeData.phoneNumber}
            backgroundColor="#DCFCE7"
            iconColor="#25D366"
            onClick={() => {
              const phoneNumber = storeData.whatsappNumber ?? storeData.phoneNumber;
              const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
              const message = `Hi ${storeData.storeName}, I'd like to know more about your products.`;
              window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`, '_blank');
            }}
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
