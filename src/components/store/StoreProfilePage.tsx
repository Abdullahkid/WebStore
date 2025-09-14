'use client';

import { useState } from 'react';
import { ArrowLeft, Share2, Phone, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Not Found</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#009CB9] text-white rounded-lg hover:bg-[#008BA5] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-surface">
      {/* App CTA Banner - Fixed at top */}
      <AppCTABanner storeData={storeData} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Store Header */}
        <div className="shadow-soft">
          <StoreHeader storeData={storeData} />
        </div>

        {/* Modern Navigation Tabs - Redesigned */}
        <div className="glass-card border-0 border-b border-slate-200 sticky top-0 z-40 backdrop-blur-lg">
          <div className="flex overflow-x-auto no-scrollbar px-4">
            {[
              { key: STORE_TABS.PRODUCTS, label: 'Products', icon: '🛍️', count: storeData.productsCount },
              { key: STORE_TABS.CATEGORIES, label: 'Categories', icon: '📂' },
              { key: STORE_TABS.REVIEWS, label: 'Reviews', icon: '⭐' },
              { key: STORE_TABS.ABOUT, label: 'About', icon: 'ℹ️' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-3 px-6 py-5 whitespace-nowrap font-semibold text-sm transition-all duration-300 border-b-3 hover-lift ${
                  activeTab === tab.key
                    ? 'border-primary text-primary bg-primary/5 shadow-soft rounded-t-xl'
                    : 'border-transparent text-slate-600 hover:text-primary hover:bg-slate-50/50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    activeTab === tab.key
                      ? 'gradient-primary text-white shadow-brand'
                      : 'bg-slate-200 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Tab Contents */}
        <div className="px-4 py-8">
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
    </div>
  );
}