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
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**', // Allows all paths from localhost:8080
      },
      // Dynamic API hostname configuration (for production)
      {
        protocol: apiConfig.protocol,
        hostname: apiConfig.hostname,
        port: apiConfig.port,
        pathname: '/**', // Allows all paths from API server
      },
    ],
  },
};

export default nextConfig;