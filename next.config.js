/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Configure images
  images: {
    domains: [
      'localhost',
      'your-supabase-url.supabase.co', // Replace with your Supabase URL
    ],
  },
  
  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  
  // Enable experimental features
  experimental: {
    serverActions: true,
    typedRoutes: true,
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  },
  
  // Configure TypeScript
  typescript: {
    // Set to true to ignore TypeScript errors during build
    ignoreBuildErrors: false,
  },
  
  // Configure ESLint
  eslint: {
    // Set to true to ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  
  // Configure compiler options
  compiler: {
    // Remove attributes that cause hydration warnings
    reactRemoveProperties: true,
    // Or more specifically target the problematic attribute
    // reactRemoveProperties: { properties: ['^cz-'] }
  },
};

module.exports = nextConfig;
