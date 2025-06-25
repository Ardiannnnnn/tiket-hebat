// components/DriveImage.tsx - Add support for fill prop
"use client";

import Image from 'next/image';
import { useState } from 'react';
import { ImageIcon, AlertCircle } from 'lucide-react';

// ✅ Convert Google Drive link
const convertDriveLink = (driveUrl: string): string => {
  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = driveUrl.match(pattern);
    if (match) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
  }

  if (driveUrl.includes('drive.google.com/uc?')) {
    return driveUrl;
  }

  return driveUrl;
};

interface DriveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean; // ✅ Add fill support
  className?: string;
  fallbackSrc?: string;
  priority?: boolean;
  onError?: () => void; // ✅ Add onError callback
  sizes?: string;
}

export default function DriveImage({ 
  src, 
  alt, 
  width, 
  height, 
  fill = false,
  className = "", 
  fallbackSrc,
  priority = false,
  onError,
  sizes,
  ...props 
}: DriveImageProps) {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (src.includes('drive.google.com')) {
      return convertDriveLink(src);
    }
    return src;
  });
  
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    console.error(`Failed to load image: ${imgSrc}`);
    
    if (fallbackSrc && imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    } else {
      setHasError(true);
      onError?.(); // ✅ Call external error handler
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // Error state
  if (hasError) {
    return (
      <div 
        className={`bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-500 ${className}`}
        style={fill ? {} : { width, height }}
      >
        <AlertCircle className="w-8 h-8" />
      </div>
    );
  }

  // ✅ Handle fill prop
  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        priority={priority}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"}
        {...props}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 400}
      height={height || 300}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      priority={priority}
      sizes={sizes}
      {...props}
    />
  );
}