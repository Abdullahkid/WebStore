'use client';

// Product Card Skeleton - Matches actual compact mobile layout
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-md sm:rounded-lg lg:rounded-xl border-0 sm:border sm:border-[#E0E0E0] overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />

      {/* Content skeleton - Compact on mobile */}
      <div className="p-2 sm:p-4 space-y-1.5 sm:space-y-3">
        {/* Title - Smaller on mobile */}
        <div className="space-y-1 sm:space-y-2">
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2" />
        </div>

        {/* Price - Compact */}
        <div className="flex items-center gap-1.5">
          <div className="h-5 sm:h-6 bg-gray-300 rounded w-16 sm:w-20" />
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-12 sm:w-16" />
        </div>

        {/* Rating - Small */}
        <div className="h-3 sm:h-4 bg-gray-200 rounded w-10 sm:w-12" />
      </div>
    </div>
  );
}

// Products Grid Skeleton - Matches actual grid with minimal mobile gaps
export function ProductsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-6 lg:gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Category Card Skeleton
export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] overflow-hidden hover:shadow-lg transition-all animate-pulse">
      {/* Image skeleton */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Category name */}
        <div className="h-5 bg-gray-300 rounded w-3/4" />

        {/* Product count */}
        <div className="h-4 bg-gray-200 rounded w-24" />
      </div>
    </div>
  );
}

// Categories Grid Skeleton
export function CategoriesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Review Card Skeleton
export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-[#E0E0E0] p-4 sm:p-6 animate-pulse">
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-gray-200" />

        <div className="flex-1 space-y-2">
          {/* Name */}
          <div className="h-4 bg-gray-300 rounded w-32" />

          {/* Rating */}
          <div className="h-4 bg-gray-200 rounded w-24" />
        </div>

        {/* Date */}
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>

      {/* Review text */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-4/6" />
      </div>
    </div>
  );
}

// Reviews List Skeleton
export function ReviewsListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ReviewCardSkeleton key={i} />
      ))}
    </div>
  );
}

// Store Header Skeleton
export function StoreHeaderSkeleton() {
  return (
    <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 animate-pulse">
      {/* Banner skeleton */}
      <div className="h-48 sm:h-64 lg:h-80 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-shimmer" />

      {/* Store info section */}
      <div className="desktop-container-wide -mt-16 sm:-mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-[#E0E0E0] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Logo skeleton */}
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gray-200" />

            {/* Info skeleton */}
            <div className="flex-1 space-y-4 w-full">
              {/* Store name */}
              <div className="h-8 bg-gray-300 rounded w-48" />

              {/* Category */}
              <div className="h-6 bg-gray-200 rounded w-32" />

              {/* Metrics */}
              <div className="flex gap-6">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-12" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-12" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-12" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              </div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="h-12 bg-gray-200 rounded-full flex-1 sm:w-32" />
              <div className="h-12 bg-gray-200 rounded-full flex-1 sm:w-32" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Full page loading skeleton
export function StorePageSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <StoreHeaderSkeleton />

      <div className="desktop-container-wide py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-6 animate-pulse">
              {/* Logo */}
              <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-4" />

              {/* Name */}
              <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-6" />

              {/* Navigation items */}
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded" />
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-9">
            <ProductsGridSkeleton count={12} />
          </main>
        </div>
      </div>
    </div>
  );
}

// Compact Loading Indicator (for inline loading)
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-[#00BCD4] border-t-transparent rounded-full animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

// Loading Button (button with loading state)
export function LoadingButton({
  loading,
  children,
  className = '',
  ...props
}: {
  loading: boolean;
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`relative ${className}`} disabled={loading} {...props}>
      <span className={loading ? 'opacity-0' : 'opacity-100'}>{children}</span>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </button>
  );
}
