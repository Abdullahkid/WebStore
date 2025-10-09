'use client';

import { useState } from 'react';
import { STORE_TABS } from '@/lib/constants';
import StoreHeader from './StoreHeader';
import StoreProducts from './StoreProducts';
import StoreCategories from './StoreCategories';
import StoreReviews from './StoreReviews';
import StoreAbout from './StoreAbout';
import AppCTABanner from './AppCTABanner';
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
  error?: string | null;
}

export default function StoreProfilePage({
  storeData,
  initialProductsData,
  initialCategoriesData,
  initialReviewsData,
  storeId,
  error,
}: StoreProfilePageProps) {
  const [activeTab, setActiveTab] = useState<string>(STORE_TABS.PRODUCTS);

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

      {/* Navigation Tabs - Sticky Below Header (Blueprint Design) */}
      <div className="sticky top-14 md:top-16 z-40 bg-white border-b border-[#E0E0E0] shadow-sm">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  relative flex-shrink-0 px-6 py-4 font-medium text-base transition-all duration-300 border-b-3
                  ${activeTab === tab.key
                    ? 'text-[#00838F] border-[#00BCD4]'
                    : 'text-[#757575] border-transparent hover:text-[#00838F] hover:bg-[#F5F5F5]'
                  }
                `}
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
      </div>

      {/* Tab Contents */}
      <div className="max-w-[1440px] mx-auto">
        <div className="animate-fade-in">
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
      </div>
    </div>
  );
}
