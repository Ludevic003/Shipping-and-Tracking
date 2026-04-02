import { onCLS, onFID, onLCP, onFCP, onTTFB } from 'web-vitals';

export const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    onCLS(onPerfEntry);
    onFID(onPerfEntry);
    onFCP(onPerfEntry);
    onLCP(onPerfEntry);
    onTTFB(onPerfEntry);
  }
};

export const initPerformanceMonitoring = () => {
  if (import.meta.env.DEV) {
    reportWebVitals(console.log);
  } else {
    // In production, you could send this to your analytics endpoint
    reportWebVitals((metric) => {
      const body = JSON.stringify(metric);
      // Use navigator.sendBeacon if available, fallback to fetch
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics/performance', body);
      } else {
        fetch('/api/analytics/performance', {
          body,
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json' }
        }).catch(err => console.error('Failed to send performance metrics', err));
      }
    });
  }
};