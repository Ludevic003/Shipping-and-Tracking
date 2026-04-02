import React, { useEffect, useRef, useState } from 'react';
import LazyImage from '@/components/LazyImage.jsx';

const partners = [
  { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'SHEIN', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Shein_logo.svg' },
  { name: 'Alibaba', logo: 'https://upload.wikimedia.org/wikipedia/en/8/80/Alibaba_Group_logo.svg' },
  { name: 'Otani Tires', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Wikimedia-logo.png/600px-Wikimedia-logo.png' },
  { name: 'DHL', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/DHL_Express_logo.svg' },
  { name: 'FedEx', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/FedEx_Express.svg' },
  { name: 'Jumia', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Jumia_Logo.png/600px-Jumia_Logo.png' }
];

const PartnerSlider = React.memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  
  const duplicatedPartners = [...partners, ...partners, ...partners];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full overflow-hidden bg-white py-12 border-y border-border/50 contain-layout">
      <div className="container-custom mb-8 text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trusted by Global Brands</p>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        {isVisible ? (
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] will-change-transform">
            {duplicatedPartners.map((partner, index) => (
              <div 
                key={`partner-${index}`} 
                className="flex-shrink-0 mx-6 md:mx-12 flex items-center justify-center w-24 md:w-32 h-12 md:h-16 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <LazyImage 
                  src={partner.logo} 
                  alt={`${partner.name} logo`} 
                  className="w-full h-full object-contain !object-contain"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="h-16 w-full"></div>
        )}
      </div>
    </div>
  );
});

export default PartnerSlider;