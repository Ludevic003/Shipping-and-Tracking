import React from 'react';
import { useImageLazyLoad } from '@/hooks/useImageLazyLoad.js';
import { Skeleton } from '@/components/ui/skeleton';

const LazyImage = React.memo(({ src, alt, className = '', placeholder, srcSet, sizes }) => {
  const { ref, isLoaded, imageUrl, setIsLoaded } = useImageLazyLoad(src);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      )}
      {imageUrl && (
        <img
          src={imageUrl}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt || ''}
          className={`w-full h-full object-cover transition-opacity duration-500 will-change-[opacity] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            if (placeholder) {
              e.target.src = placeholder;
            }
            setIsLoaded(true);
          }}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
});

export default LazyImage;