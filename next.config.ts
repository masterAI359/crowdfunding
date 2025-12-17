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
      {
        protocol: 'https',
        hostname: 'tsukurutv.com',
        port: '',
        pathname: '/api/uploads/**', // Allows uploads from this domain
      },
      {
        protocol: 'http',
        hostname: 'tsukurutv.com',
        port: '',
        pathname: '/api/uploads/**', // Allows http as fallback (should be https in production)
      },
      {
        protocol: 'https',
        hostname: 'www.tsukurutv.com',
        port: '',
        pathname: '/api/uploads/**', // Allows uploads from www subdomain
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/api/uploads/**', // Allows uploads from localhost for development
      },
    ],
  },
};

export default nextConfig;