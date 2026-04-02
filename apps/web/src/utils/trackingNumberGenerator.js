export const generateTrackingNumber = (originCode = 'US', destCode = 'US') => {
  // Format: XX-XXXXXX-XX (e.g., US-123456-US)
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const origin = (originCode || 'US').substring(0, 2).toUpperCase();
  const dest = (destCode || 'US').substring(0, 2).toUpperCase();
  return `${origin}-${randomNum}-${dest}`;
};