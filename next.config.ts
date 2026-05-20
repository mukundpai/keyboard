import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // Performance optimizations
  productionBrowserSourceMaps: false,
  compress: true,
  
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react', 'recharts'],
  },
  
  serverExternalPackages: ['socket.io-client', 'engine.io-client', '@prisma/client', '@prisma/adapter-pg', 'pg'],

  webpack(config, { isServer }) {
    if (isServer) {
      // Prisma 7 generated client and pg use node: built-in imports
      config.externals = [
        ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
        ({ request }: { request: string }, callback: (err?: Error | null, result?: string) => void) => {
          if (request?.startsWith('node:')) {
            return callback(null, `commonjs ${request.replace('node:', '')}`);
          }
          // util/types is a Node.js built-in subpath used by pg
          if (request === 'util/types') {
            return callback(null, 'commonjs util/types');
          }
          callback();
        },
      ];
    }
    return config;
  },
  
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Security and SEO headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/type',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
