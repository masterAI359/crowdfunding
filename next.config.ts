import type { NextConfig } from "next";

// Get API URL from environment variable
const getApiUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
};

// Extract hostname and protocol from API URL
const getApiHostConfig = () => {
  try {
    const apiUrl = getApiUrl();
    const url = new URL(apiUrl);
    return {
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port || '',
    };
  } catch {
    return {
      protocol: 'http' as const,
      hostname: 'localhost',
      port: '8080',
    };
  }
};

const apiConfig = getApiHostConfig();

const nextConfig: NextConfig = {
  // Allow cross-origin requests from specific IPs during development
  allowedDevOrigins: ['162.43.45.104', "https://fernande-prelexical-ceola.ngrok-free.dev"],
  
  // HMR configuration for development (especially with tunnels like ngrok)
  webpackDevMiddleware: process.env.NODE_ENV === 'development' ? {
    watchOptions: {
      poll: 800,
      aggregateTimeout: 300,
    },
  } : undefined,

  onDemandEntries: process.env.NODE_ENV === 'development' ? {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  } : undefined,

  // Configure HMR for ngrok or similar tunneling services
  ...(() => {
    if (process.env.NEXT_PUBLIC_HMR_HOST && process.env.NODE_ENV === 'development') {
      return {
        publicRuntimeConfig: {
          hmrHost: process.env.NEXT_PUBLIC_HMR_HOST,
        },
      };
    }
    return {};
  })(),
  
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