import { execSync } from 'child_process';

// Force Prisma generation during Next.js initialization
if (process.env.NODE_ENV === 'production') {
  console.log('--- FORCING PRISMA GENERATE IN CONFIG ---');
  execSync('npx prisma generate');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
