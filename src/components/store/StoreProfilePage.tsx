'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  const [activeTab, setActiveTab] = useState(STORE_TABS.PRODUCTS);

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
    <div className="min-h-screen bg-[#F0F8FF]">
      {/* App CTA Banner - Fixed at top */}
      <AppCTABanner storeData={storeData} />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pt-4">
        {/* Store Header - Instagram Style */}
        <StoreHeader storeData={storeData} />
        
        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="w-full grid grid-cols-4 bg-white rounded-lg shadow-sm border">
            <TabsTrigger 
              value={STORE_TABS.PRODUCTS}
              className="data-[state=active]:bg-[#009CB9]/10 data-[state=active]:text-[#009CB9] font-medium"
            >
              Products
            </TabsTrigger>
            <TabsTrigger 
              value={STORE_TABS.CATEGORIES}
              className="data-[state=active]:bg-[#009CB9]/10 data-[state=active]:text-[#009CB9] font-medium"
            >
              Categories
            </TabsTrigger>
            <TabsTrigger 
              value={STORE_TABS.REVIEWS}
              className="data-[state=active]:bg-[#009CB9]/10 data-[state=active]:text-[#009CB9] font-medium"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger 
              value={STORE_TABS.ABOUT}
              className="data-[state=active]:bg-[#009CB9]/10 data-[state=active]:text-[#009CB9] font-medium"
            >
              About
            </TabsTrigger>
          </TabsList>
          
          {/* Tab Contents */}
          <div className="mt-6">
            <TabsContent value={STORE_TABS.PRODUCTS} className="space-y-6">
              <StoreProducts 
                storeId={storeId}
                initialData={initialProductsData}
              />
            </TabsContent>
            
            <TabsContent value={STORE_TABS.CATEGORIES} className="space-y-6">
              <StoreCategories 
                storeId={storeId}
                initialData={initialCategoriesData}
              />
            </TabsContent>
            
            <TabsContent value={STORE_TABS.REVIEWS} className="space-y-6">
              <StoreReviews 
                storeId={storeId}
                initialData={initialReviewsData}
              />
            </TabsContent>
            
            <TabsContent value={STORE_TABS.ABOUT} className="space-y-6">
              <StoreAbout storeData={storeData} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}