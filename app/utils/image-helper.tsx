import Image from 'next/image';
import React from 'react';

/**
 * Get API base URL from environment variable
 */
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use environment variable or default
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  }
  // Server-side: use environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
};

/**
 * Extract hostname from API URL
 */
const getApiHostname = (): string | null => {
  try {
    const apiUrl = getApiBaseUrl();
    const url = new URL(apiUrl);
    return url.hostname;
  } catch {
    return null;
  }
};

/**
 * Check if the URL is from the API server (localhost or production)
 */
export const isApiUrl = (url: string): boolean => {
  if (!url) return false;
  
  // Check if URL contains /api/uploads (uploaded files)
  if (url.includes('/api/uploads')) {
    return true;
  }
  
  try {
    const urlObj = new URL(url);
    const apiHostname = getApiHostname();
    
    // Check if it's localhost
    if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
      return true;
    }
    
    // Check if it matches the API hostname (production)
    if (apiHostname && urlObj.hostname === apiHostname) {
      return true;
    }
    
    return false;
  } catch {
    // If URL parsing fails, check if it starts with localhost or contains /api/uploads
    return url.startsWith('http://localhost') || 
           url.startsWith('https://localhost') ||
           url.includes('/api/uploads');
  }
};

/**
 * Render an image component that handles both localhost and external URLs
 */
export const SmartImage: React.FC<{
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
}> = ({ src, alt, fill, width, height, className, style, sizes, priority, unoptimized }) => {
  const isApi = isApiUrl(src);

  if (isApi) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={className}
          style={style}
        />
      );
    } else {
      return (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={style}
        />
      );
    }
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      style={style}
      sizes={sizes}
      priority={priority}
      unoptimized={unoptimized}
    />
  );
};

