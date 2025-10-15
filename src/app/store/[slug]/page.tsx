import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { SEO_CONFIG } from '@/lib/constants';
import StoreProfilePage from '@/components/store/StoreProfilePage';
import StoreCacheHandler from '@/components/store/StoreCacheHandler';
import type { StorePageProps } from '@/lib/types';

// Helper function to detect identifier type (moved up for use in generateMetadata)
function detectIdentifierType(identifier: string): 'subdomain' | 'id' | 'username' {
  // MongoDB ObjectId pattern (24 hex characters)
  const isMongoId = /^[0-9a-fA-F]{24}$/.test(identifier);
  if (isMongoId) return 'id';

  // Subdomain pattern (3-30 chars, lowercase, alphanumeric + hyphens, no underscores)
  const isSubdomain = /^[a-z0-9-]{3,30}$/.test(identifier) && !identifier.includes('_');
  if (isSubdomain) return 'subdomain';

  // Username pattern (has underscore)
  return 'username';
}

// Helper function to fetch store by identifier type (moved up for use in generateMetadata)
async function fetchStoreByIdentifier(identifier: string) {
  const identifierType = detectIdentifierType(identifier);

  try {
    let response;

    switch (identifierType) {
      case 'subdomain':
        // Fetch by subdomain (most common via middleware)
        // Use revalidate instead of no-store to enable ISR
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://downxtown.com'}/api/v1/store/by-subdomain/${identifier}`,
          { next: { revalidate: 3600 } } // Revalidate every hour
        );
        break;

      case 'id':
        // Fetch by MongoDB ID (legacy support)
        response = await apiClient.getStoreProfile(identifier);
        return response;

      case 'username':
        // Fetch by username (fallback)
        // Use revalidate instead of no-store to enable ISR
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://downxtown.com'}/api/v1/store/by-username/${identifier}`,
          { next: { revalidate: 3600 } } // Revalidate every hour
        );
        break;
    }

    if (!response.ok) {
      return { success: false, storeProfile: null };
    }

    // Parse the response - server now returns wrapped response: { success, message, storeProfile }
    const responseData = await response.json();

    // Return in the expected format
    return {
      success: responseData.success || false,
      storeProfile: responseData.storeProfile || null
    };

  } catch (error) {
    console.error(`Error fetching store by ${identifierType}:`, error);
    return { success: false, storeProfile: null };
  }
}

// Generate metadata for SEO and OpenGraph
export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  try {
    // Use fetchStoreByIdentifier instead of apiClient.getStoreProfile
    // This supports subdomain, username, and ID
    const response = await fetchStoreByIdentifier(params.slug);

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
    
    // Use subdomain URL if available, otherwise fall back to slug-based URL
    const storeUrl = store.subdomain 
      ? `https://${store.subdomain}.downxtown.com`
      : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://webstore.downxtown.com'}/store/${params.slug}`;

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
        url: storeUrl,
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
    // Fetch store profile data on the server (supports subdomain, ID, or username)
    const storeResponse = await fetchStoreByIdentifier(params.slug);
    
    if (!storeResponse.success || !storeResponse.storeProfile) {
      notFound();
    }

    storeData = storeResponse.storeProfile;

    // Fetch initial data for tabs in parallel for better performance
    // IMPORTANT: Use storeData.id (MongoDB ObjectId), not params.slug (which could be subdomain)
    const [productsResponse, categoriesResponse, reviewsResponse] = await Promise.allSettled([
      apiClient.getStoreProducts(storeData.id, 1, 12),
      apiClient.getStoreCategories(storeData.id, 1, 8),
      apiClient.getStoreReviews(storeData.id, 1, 5),
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
  const storeUrl = storeData.subdomain 
    ? `https://${storeData.subdomain}.downxtown.com`
    : `${process.env.NEXT_PUBLIC_SITE_URL || 'https://webstore.downxtown.com'}/store/${params.slug}`;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: storeData.storeName,
    description: storeData.storeDescription,
    image: storeData.storeLogo ? apiClient.getImageUrl(storeData.storeLogo, 'banner') : undefined,
    url: storeUrl,
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

      {/* Cache handler - saves data to IndexedDB on client side */}
      <StoreCacheHandler
        storeData={storeData}
        initialProductsData={initialProductsData || undefined}
        initialCategoriesData={initialCategoriesData || undefined}
        initialReviewsData={initialReviewsData || undefined}
      />

      {/* Main store profile component */}
      <StoreProfilePage
        storeData={storeData}
        initialProductsData={initialProductsData || undefined}
        initialCategoriesData={initialCategoriesData || undefined}
        initialReviewsData={initialReviewsData || undefined}
        storeId={storeData.id}
        storeSlug={params.slug}
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