import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests from specific IPs during development
  allowedDevOrigins: ['162.43.45.104'],
  
  // Production optimizations
  compress: true,
  poweredByHeader: false,
  
  images: {
    // This allows you to use SVGs with the next/image component.
    dangerouslyAllowSVG: true, 
    
    // The recommended way to allow external images.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
        port: '',
        pathname: '/**', // Allows all paths from this domain
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**', // Allows all paths from this domain
      },
    ],
  },
};

export default nextConfig;