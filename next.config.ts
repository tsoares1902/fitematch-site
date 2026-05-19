import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'fitematch.com.br',
      },
      {
        protocol: 'https',
        hostname: 'www.fitematch.com.br',
      },
      {
        protocol: 'https',
        hostname: 'fitematch-development.s3.sa-east-1.amazonaws.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
