/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification for production builds
  swcMinify: true,

  // Exclude Firebase from server-side bundling
  serverComponentsExternalPackages: ['firebase', 'firebase/app', 'firebase/auth'],

  // Optimize webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Enable parallelism in production for better performance
    config.parallelism = dev ? 1 : 4;

    // Enable cache in production for faster rebuilds
    config.cache = !dev;

    // Fix Firebase on server side - completely exclude from server bundle
    if (isServer) {
      // Completely remove Firebase from server bundles
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/firebase': false,
        'firebase/app': false,
        'firebase/auth': false,
        'firebase/analytics': false,
        'firebase/messaging': false,
        'firebase/firestore': false,
        'firebase': false,
      };

      // Also externalize to prevent bundling
      const externals = config.externals || [];
      config.externals = [
        ...( Array.isArray(externals) ? externals : [externals]),
        'firebase',
        'firebase/app',
        'firebase/auth',
        '@firebase/app',
        '@firebase/auth',
      ];
    }

    // Additional optimizations for production builds
    if (!dev) {
      // Firebase should only be in client bundle
      config.optimization = {
        ...config.optimization,
        minimize: true, // Enable minification for production
        splitChunks: isServer ? false : {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Firebase in its own chunk (client only)
            firebase: {
              name: 'firebase',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](@firebase|firebase)[\\/]/,
              priority: 10,
              enforce: true,
            },
            // React and Next.js core
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
              priority: 20,
              enforce: true,
            },
            // UI libraries
            ui: {
              name: 'ui',
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|clsx|tailwind-merge)[\\/]/,
              priority: 15,
              enforce: true,
            },
            // Other vendor code
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](?!(@firebase|firebase|react|react-dom|next|@radix-ui)[\\/])/,
              priority: 5,
            },
          },
        },
      };
    }

    // Fix for Windows file watching issues
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }

    return config;
  },
  
  // Image optimization settings
  images: {
    domains: ['localhost', 'downxtown.com', '192.168.29.10'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.29.10',
        port: '8080',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'downxtown.com',
        pathname: '/**',
      },
    ],
    // Disable image optimization during build to save resources
    unoptimized: true,
  },
  
  // Disable type checking during build (handle separately)
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable ESLint during build (handle separately)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Experimental features for better Windows support
  experimental: {
    // Reduce memory usage
    workerThreads: false,
    cpus: 1,
    // Disable build activity indicator which can cause issues
    webpackBuildWorker: false,
    // Disable Jest worker to prevent child process exceptions
    isrMemoryCacheSize: 0,
  },

  // Disable static page generation workers
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  
  // Output configuration
  output: 'standalone',
  
  // Reduce build output verbosity
  productionBrowserSourceMaps: false,
  
  // Environment variables
  env: {
    NEXT_TELEMETRY_DISABLED: '1',
  },
};

module.exports = nextConfig;