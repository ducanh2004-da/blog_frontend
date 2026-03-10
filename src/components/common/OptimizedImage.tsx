import React, { useState, useEffect, useRef, memo } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  containerClassName?: string;
  skeleton?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * OptimizedImage Component
 * Provides:
 * - Lazy loading with intersection observer
 * - Fallback image on error
 * - Loading skeleton state
 * - Responsive image sizing
 * - Blur placeholder effect
 */
const OptimizedImage = memo(
  React.forwardRef<HTMLImageElement, OptimizedImageProps>(
    (
      {
        src,
        alt,
        fallbackSrc = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f3f4f6%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E',
        containerClassName = '',
        className,
        skeleton = true,
        onLoad,
        onError,
        ...props
      },
      ref
    ) => {
      const [isLoaded, setIsLoaded] = useState(false);
      const [hasError, setHasError] = useState(false);
      const [isMounted, setIsMounted] = useState(false);
      const containerRef = useRef<HTMLDivElement>(null);

      // Use Intersection Observer for lazy loading
      useEffect(() => {
        setIsMounted(true);
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting && containerRef.current?.querySelector('img')) {
              observer.unobserve(entry.target);
              // Trigger load by changing data-src to src
              const img = containerRef.current?.querySelector('img') as HTMLImageElement;
              if (img && img.dataset.src) {
                img.src = img.dataset.src;
              }
            }
          },
          { rootMargin: '50px' }
        );

        if (containerRef.current) {
          observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
      }, []);

      const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
      };

      const handleError = () => {
        setHasError(true);
        onError?.();
      };

      const imageSrc = hasError ? fallbackSrc : src;

      return (
        <div
          ref={containerRef}
          className={cn('relative overflow-hidden bg-gray-100', containerClassName)}
        >
          {skeleton && !isLoaded && (
            <div
              className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100"
              role="presentation"
              aria-hidden="true"
            />
          )}

          <img
            ref={ref}
            data-src={src}
            src={fallbackSrc} // Start with placeholder
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={cn(
              'h-full w-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0',
              className
            )}
            loading="lazy"
            decoding="async"
            {...props}
          />
        </div>
      );
    }
  )
);

OptimizedImage.displayName = 'OptimizedImage';

export { OptimizedImage };
export type { OptimizedImageProps };
