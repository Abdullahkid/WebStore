import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailPage from '@/components/product/ProductDetailPage';

interface ProductPageProps {
  params: {
    productId: string;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.downxtown.com';

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    // Make direct request to the Ktor backend
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${params.productId}/page`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return {
        title: 'Product Not Found | Downxtown',
        description: 'The product you are looking for could not be found.',
      };
    }

    const product = await response.json();

    return {
      title: `${product.title} | ${product.storeInfo.storeName} | Downxtown`,
      description: product.description || `Buy ${product.title} from ${product.storeInfo.storeName} on Downxtown`,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.defaultImages.length > 0
          ? [`${API_BASE_URL}/get-preview-image/${product.defaultImages[0]}`]
          : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: product.description,
        images: product.defaultImages.length > 0
          ? [`${API_BASE_URL}/get-preview-image/${product.defaultImages[0]}`]
          : [],
      },
    };
  } catch (error) {
    console.error('Error generating product metadata:', error);
    return {
      title: 'Product | Downxtown',
      description: 'Shop amazing products on Downxtown',
    };
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = params;

  // Validate productId
  if (!productId || typeof productId !== 'string') {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <ProductDetailPage productId={productId} />
    </main>
  );
}

// Enable ISR (Incremental Static Regeneration)
export const revalidate = 3600; // Revalidate every hour