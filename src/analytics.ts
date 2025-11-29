
// Google Analytics 4 Event Tracking Helper

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  } else {
    // Fallback for dev or if blocked
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GA4] ${eventName}`, eventParams);
    }
  }
};

export const AnalyticsEvents = {
  APP_LOADED: 'app_loaded',
  ROTATION_MODE_CHANGE: 'rotation_mode_change',
  SPEED_CHANGE: 'speed_change',
  TOGGLE_FEATURE: 'toggle_feature',
};
