/** @type {import('next').NextConfig} */
const nextConfig = {
  // Simple webpack config for maximum stability
  webpack: (config, { dev }) => {
    config.parallelism = 1;
    if (dev) {
      config.optimization.minimize = false;
    }
    return config;
  },
  
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: false,
};

module.exports = nextConfig;