/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable the static export since we're using server components and API routes
  // output: 'export', // Commented out to enable server components
  
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Configure images
  images: {
    // For static exports, we need to use unoptimized: true
    // For server components with Next.js Image, we can optimize images
    unoptimized: process.env.NODE_ENV === 'production' ? false : true,
    domains: [
      'localhost',
      'your-supabase-url.supabase.co', // Replace with your Supabase URL
    ],
  },
  
  // Configure webpack
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
  
  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Enable experimental features if needed
  experimental: {
    // Enable server actions (optional)
    serverActions: true,
    // Enable typed routes
    typedRoutes: true,
    // Enable server components
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  
  // Configure TypeScript
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  
  // Configure ESLint
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;
