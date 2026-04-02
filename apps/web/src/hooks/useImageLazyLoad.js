import { useState, useEffect, useRef } from 'react';
import { LAZY_LOAD_CONFIG } from '@/config/performance.js';

export const useImageLazyLoad = (src) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    if (!src) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setImageUrl(src);
        observer.disconnect();
      }
    }, LAZY_LOAD_CONFIG);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [src]);

  return { ref, isLoaded, imageUrl, setIsLoaded };
};