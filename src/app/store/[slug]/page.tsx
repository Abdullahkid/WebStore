import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { SEO_CONFIG } from '@/lib/constants';
import StoreProfilePage from '@/components/store/StoreProfilePage';
import type { StorePageProps } from '@/lib/types';

// Generate metadata for SEO and OpenGraph
export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  try {
    const response = await apiClient.getStoreProfile(params.slug);
    
    if (!response.success || !response.storeProfile) {
      return {
        title: 'Store Not Found - Downxtown',
        description: 'The store you are looking for could not be found.',
      };
    }

    const store = response.storeProfile;
    const title = `${store.storeName} - ${SEO_CONFIG.siteName}`;
    const description = store.storeDescription || `Discover amazing products from ${store.storeName} on Downxtown`;
    const imageUrl = store.storeLogo 
      ? apiClient.getImageUrl(store.storeLogo, 'banner')
      : SEO_CONFIG.defaultImage;

    return {
      title,
      description,
      keywords: `${store.storeName}, ${store.storeCategory}, shopping, local business, ${store.location || ''}`,
      authors: [{ name: store.storeName }],
      creator: store.storeName,
      publisher: SEO_CONFIG.siteName,
      
      // OpenGraph tags for social sharing
      openGraph: {
        title,
        description,
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://webstore.downxtown.com'}/store/${params.slug}`,
        siteName: SEO_CONFIG.siteName,
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: `${store.storeName} logo`,
          },
        ],
        locale: 'en_US',
        type: 'website',
      },

      // Twitter Card tags
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: SEO_CONFIG.twitterHandle,
        images: [imageUrl],
      },

      // Additional meta tags
      other: {
        'og:business:contact_data:street_address': store.location || '',
        'og:business:contact_data:locality': store.location || '',
        'og:business:contact_data:phone_number': store.phoneNumber,
        'og:business:contact_data:website': store.websiteUrl || '',
        'business:contact_data:phone_number': store.phoneNumber,
        'business:contact_data:website': store.websiteUrl || '',
        'store:id': store.id,
        'store:category': store.storeCategory,
        'store:rating': store.storeRating.toString(),
        'store:products_count': store.productsCount.toString(),
        'store:followers_count': store.followersCount.toString(),
      },

      // Schema.org structured data will be added via JSON-LD in the component
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Store - Downxtown',
      description: SEO_CONFIG.defaultDescription,
    };
  }
}

// Main page component with SSR data fetching
export default async function StorePage({ params, searchParams }: StorePageProps) {
  let storeData = null;
  let initialProductsData = null;
  let initialCategoriesData = null;
  let initialReviewsData = null;
  let error = null;

  try {
    // Fetch store profile data on the server
    const storeResponse = await apiClient.getStoreProfile(params.slug);
    
    if (!storeResponse.success || !storeResponse.storeProfile) {
      notFound();
    }

    storeData = storeResponse.storeProfile;

    // Fetch initial data for tabs in parallel for better performance
    const [productsResponse, categoriesResponse, reviewsResponse] = await Promise.allSettled([
      apiClient.getStoreProducts(params.slug, 1, 12),
      apiClient.getStoreCategories(params.slug, 1, 8),
      apiClient.getStoreReviews(params.slug, 1, 5),
    ]);

    // Extract successful responses
    if (productsResponse.status === 'fulfilled' && productsResponse.value.success) {
      initialProductsData = productsResponse.value.data;
    }
    
    if (categoriesResponse.status === 'fulfilled' && categoriesResponse.value.success) {
      initialCategoriesData = categoriesResponse.value.data;
    }

    if (reviewsResponse.status === 'fulfilled') {
      console.log('Reviews response from server:', reviewsResponse.value);
      initialReviewsData = reviewsResponse.value;
    } else if (reviewsResponse.status === 'rejected') {
      console.error('Reviews request failed:', reviewsResponse.reason);
    }

  } catch (err) {
    console.error('Error fetching store data:', err);
    error = 'Failed to load store data';
  }

  if (!storeData) {
    notFound();
  }

  // Generate JSON-LD structured data for better SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: storeData.storeName,
    description: storeData.storeDescription,
    image: storeData.storeLogo ? apiClient.getImageUrl(storeData.storeLogo, 'banner') : undefined,
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://webstore.downxtown.com'}/store/${params.slug}`,
    telephone: storeData.phoneNumber,
    email: storeData.email,
    address: storeData.location ? {
      '@type': 'PostalAddress',
      addressLocality: storeData.location,
    } : undefined,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: storeData.storeRating,
      ratingCount: initialReviewsData?.totalReviews || 0,
    },
    sameAs: [
      storeData.socialLinks?.website,
      storeData.socialLinks?.instagram,
      storeData.socialLinks?.facebook,
      storeData.socialLinks?.twitter,
      storeData.websiteUrl,
    ].filter(Boolean),
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Main store profile component */}
      <StoreProfilePage
        storeData={storeData}
        initialProductsData={initialProductsData}
        initialCategoriesData={initialCategoriesData}
        initialReviewsData={initialReviewsData}
        storeId={params.slug}
        error={error}
      />
    </>
  );
}

// Enable static params generation for popular stores (optional)
export async function generateStaticParams() {
  // You can implement this to pre-generate pages for popular stores
  // For now, we'll use dynamic rendering for all stores
  return [];
}

// Configure page revalidation (optional)
export const revalidate = 3600; // Revalidate every hour