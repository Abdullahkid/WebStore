/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable SWC minification to avoid worker issues
  swcMinify: false,
  
  // Exclude Firebase from server-side bundling
  serverComponentsExternalPackages: ['firebase', 'firebase/app', 'firebase/auth'],
  
  // Optimize webpack configuration for Windows
  webpack: (config, { dev, isServer }) => {
    // Disable parallelism to prevent worker issues
    config.parallelism = 1;
    
    // Disable cache to prevent corruption issues
    config.cache = false;
    
    // Fix Firebase on server side - exclude from server bundle
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase/app': false,
        'firebase/auth': false,
      };
    }
    
    // Additional optimizations for production builds
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: false, // Temporarily disable minification
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Only split vendor code
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
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
    domains: ['localhost', 'downxtown.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
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