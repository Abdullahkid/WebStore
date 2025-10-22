'use client';

import { useState, useTransition } from 'react';
import { Phone } from 'lucide-react';
import { STORE_TABS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import StoreHeader from './StoreHeader';
import StoreProducts from './StoreProducts';
import StoreCategories from './StoreCategories';
import StoreReviews from './StoreReviews';
import StoreAbout from './StoreAbout';
import AppCTABanner from './AppCTABanner';
import OptimizedImage from '@/components/shared/OptimizedImage';
import type {
  StoreProfileData,
  StoreProductsResponse,
  StoreCategoriesResponse,
  PaginatedStoreReviewsResponse,
} from '@/lib/types';

interface StoreProfilePageProps {
  storeData: StoreProfileData;
  initialProductsData?: StoreProductsResponse['data'];
  initialCategoriesData?: StoreCategoriesResponse['data'];
  initialReviewsData?: PaginatedStoreReviewsResponse;
  storeId: string;
  storeSlug?: string;
  error?: string | null;
}

export default function StoreProfilePage({
  storeData,
  initialProductsData,
  initialCategoriesData,
  initialReviewsData,
  storeId,
  storeSlug,
  error,
}: StoreProfilePageProps) {
  const [activeTab, setActiveTab] = useState<string>(STORE_TABS.PRODUCTS);
  const [isPending, startTransition] = useTransition();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;

    // Smooth scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Trigger fade-out animation
    setIsTransitioning(true);

    // Use React transition for non-blocking updates
    startTransition(() => {
      // Wait for fade-out animation to complete
      setTimeout(() => {
        setActiveTab(newTab);
        setIsTransitioning(false);
      }, 150);
    });
  };

  const handleContact = () => {
    const phoneNumber = storeData.whatsappNumber ?? storeData.phoneNumber;
    window.open(`tel:${phoneNumber}`, '_self');
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#212121] mb-2">Store Not Found</h1>
          <p className="text-[#757575] mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white rounded-full hover:shadow-brand-soft transition-smooth"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      key: STORE_TABS.PRODUCTS,
      label: 'Products',
      count: storeData.productsCount
    },
    {
      key: STORE_TABS.CATEGORIES,
      label: 'Categories'
    },
    {
      key: STORE_TABS.REVIEWS,
      label: 'Reviews'
    },
    {
      key: STORE_TABS.ABOUT,
      label: 'About'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* App CTA Banner - Optional */}
      <AppCTABanner storeData={storeData} />

      {/* Store Header (Hero Section) */}
      <StoreHeader storeData={storeData} />

      {/* Mobile Tabs - Sticky Below Header with Touch Optimization */}
      <div className="lg:hidden sticky top-14 md:top-16 z-40 bg-white border-b border-[#E0E0E0] shadow-sm mb-0">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`
                relative flex-shrink-0 px-6 py-4 font-medium text-base transition-all duration-300 border-b-3 touch-manipulation active:scale-95
                ${activeTab === tab.key
                  ? 'text-[#00838F] border-[#00BCD4]'
                  : 'text-[#757575] border-transparent hover:text-[#00838F] hover:bg-[#F5F5F5]'
                }
              `}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`panel-${tab.key}`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-[#00BCD4] text-white'
                    : 'bg-[#E0E0E0] text-[#757575]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Layout with Sidebar */}
      <div className="desktop-container-wide py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="desktop-sticky space-y-4">
              {/* Enhanced Store Info Card */}
              <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-6 shadow-xl border border-slate-200/50">
                {/* Store Logo */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white mb-4">
                    {storeData.storeLogo ? (
                      <OptimizedImage
                        imageId={storeData.storeLogo}
                        alt={`${storeData.storeName} logo`}
                        variant="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#00BCD4] to-[#0097A7] flex items-center justify-center">
                        <span className="text-white font-bold text-3xl">
                          {storeData.storeName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-2">{storeData.storeName}</h3>
                  <span className="inline-block bg-[#E0F7FA] text-[#00838F] px-4 py-1.5 rounded-full text-sm font-semibold">
                    {storeData.storeCategory.toLowerCase().replace('_', ' ')}
                  </span>
                </div>

                {/* Store Metrics - 3 Column Grid */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="bg-white rounded-xl p-3 text-center border border-slate-200">
                    <div className="text-xl font-bold text-slate-900">{storeData.productsCount}</div>
                    <div className="text-xs text-slate-600 mt-1">Products</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-slate-200">
                    <div className="text-xl font-bold text-slate-900">{(storeData.followersCount / 1000).toFixed(1)}k</div>
                    <div className="text-xs text-slate-600 mt-1">Followers</div>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center border border-slate-200">
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-xl font-bold text-slate-900">{storeData.storeRating.toFixed(1)}</span>
                      <svg className="w-4 h-4 fill-[#FFC107]" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Rating</div>
                  </div>
                </div>

                {/* Contact Button with Social Media Icons */}
                <div className="flex items-center gap-2">
                  {/* Contact Button - Flexible width with minimum */}
                  <Button
                    onClick={handleContact}
                    className="flex-1 min-w-[100px] h-12 bg-gradient-to-r from-[#00BCD4] to-[#0097A7] text-white rounded-full font-semibold text-base shadow-lg hover:shadow-brand-soft transition-smooth hover-lift-desktop"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Contact
                  </Button>

                  {/* Social Media Icons - Show first 3, then +N */}
                  {storeData.socialLinks && (() => {
                    const socialLinks = [
                      { name: 'instagram', url: storeData.socialLinks.instagram, gradient: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]', svg: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' },
                      { name: 'twitter', url: storeData.socialLinks.twitter, gradient: 'bg-black', svg: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                      { name: 'facebook', url: storeData.socialLinks.facebook, gradient: 'bg-[#1877F2]', svg: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                      { name: 'youtube', url: storeData.socialLinks.youtube, gradient: 'bg-[#FF0000]', svg: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
                    ].filter(link => link.url);

                    const maxVisible = 3;
                    const visibleLinks = socialLinks.slice(0, maxVisible);
                    const hiddenCount = socialLinks.length - maxVisible;

                    return (
                      <>
                        {visibleLinks.map((link) => (
                          <a
                            key={link.name}
                            href={link.url!.startsWith('http') ? link.url! : `https://${link.name === 'twitter' ? 'x' : link.name}.com/${link.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex-shrink-0 w-9 h-9 rounded-full ${link.gradient} flex items-center justify-center hover:scale-110 transition-transform shadow-md`}
                          >
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                              <path d={link.svg} />
                            </svg>
                          </a>
                        ))}
                        {hiddenCount > 0 && (
                          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                            +{hiddenCount}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className={`
                      w-full text-left px-6 py-4 font-medium text-base transition-all duration-300 border-l-4 hover-lift
                      ${activeTab === tab.key
                        ? 'bg-[#E0F7FA] text-[#00838F] border-[#00BCD4]'
                        : 'bg-white text-[#757575] border-transparent hover:bg-[#F5F5F5] hover:text-[#00838F]'
                      }
                    `}
                    role="tab"
                    aria-selected={activeTab === tab.key}
                    aria-controls={`panel-${tab.key}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{tab.label}</span>
                      {tab.count !== undefined && (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          activeTab === tab.key
                            ? 'bg-[#00BCD4] text-white'
                            : 'bg-[#E0E0E0] text-[#757575]'
                        }`}>
                          {tab.count}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content with Smooth Transitions */}
          <main className="lg:col-span-9" role="tabpanel" id={`panel-${activeTab}`}>
            <div
              className={`transition-all duration-300 ${
                isTransitioning
                  ? 'opacity-0 translate-y-4'
                  : 'opacity-100 translate-y-0 animate-fade-in'
              }`}
            >
              {activeTab === STORE_TABS.PRODUCTS && (
                <StoreProducts
                  storeId={storeId}
                  initialData={initialProductsData}
                />
              )}

              {activeTab === STORE_TABS.CATEGORIES && (
                <StoreCategories
                  storeId={storeId}
                  initialData={initialCategoriesData}
                  storeName={storeData.storeName}
                  storeSlug={storeSlug}
                />
              )}

              {activeTab === STORE_TABS.REVIEWS && (
                <StoreReviews
                  storeId={storeId}
                  initialData={initialReviewsData}
                />
              )}

              {activeTab === STORE_TABS.ABOUT && (
                <StoreAbout storeData={storeData} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
