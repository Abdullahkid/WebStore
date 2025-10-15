import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import CategoryProductsPage from '@/components/category/CategoryProductsPage';

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Generate metadata for SEO
export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const categoryName = (searchParams?.name as string) || 'Category';
  const storeName = (searchParams?.store as string) || 'Store';

  return {
    title: `${categoryName} - ${storeName} | Downxtown`,
    description: `Browse ${categoryName} products from ${storeName} on Downxtown`,
  };
}

// Main page component for subdomain category pages
// URL: sigma.downxtown.com/category/{categoryId}
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const categoryName = (searchParams?.name as string) || 'Category';
  const storeId = (searchParams?.storeId as string);
  const storeName = (searchParams?.store as string) || '';

  if (!storeId) {
    notFound();
  }

  // Fetch initial page of category products (SSR)
  let initialProducts = null;
  let error = null;

  try {
    const response = await apiClient.getCategoryProducts(storeId, params.categoryId, 1, 20);
    if (response.success && response.data) {
      initialProducts = response.data;
    }
  } catch (err) {
    console.error('Error fetching category products:', err);
    error = 'Failed to load products';
  }

  return (
    <CategoryProductsPage
      storeId={storeId}
      categoryId={params.categoryId}
      categoryName={categoryName}
      storeName={storeName}
      initialProducts={initialProducts || undefined}
      error={error}
    />
  );
}
