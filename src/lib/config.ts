/**
 * Environment Configuration
 * Handles all environment-specific settings
 */

export const config = {
  // App
  appName: 'KeyMaster Pro',
  appDescription: 'Elite typing test platform',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Analytics & Monitoring
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  analyticsId: process.env.NEXT_PUBLIC_GA_ID,
  
  // Ads
  adsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID,
  enableAds: process.env.NEXT_PUBLIC_ENABLE_ADS === 'true',
  
  // APIs
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  
  // Features
  features: {
    ads: process.env.NEXT_PUBLIC_ENABLE_ADS === 'true',
    analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    authentication: process.env.NEXT_PUBLIC_AUTH_ENABLED === 'true',
  },
};
