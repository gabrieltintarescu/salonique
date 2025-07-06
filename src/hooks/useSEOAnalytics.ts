import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}

export const usePageTracking = (trackingId?: string) => {
    const location = useLocation();

    useEffect(() => {
        if (trackingId && window.gtag) {
            // Track page views for Google Analytics
            window.gtag('config', trackingId, {
                page_path: location.pathname + location.search,
                page_title: document.title,
            });
        }
    }, [location, trackingId]);
};

// SEO Performance monitoring
export const useSEOMonitoring = () => {
    useEffect(() => {
        // Monitor Core Web Vitals
        const observeWebVitals = () => {
            if ('PerformanceObserver' in window) {
                // Largest Contentful Paint (LCP)
                const lcpObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        console.log('LCP:', entry.startTime);
                        // Send to analytics if needed
                    }
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

                // First Input Delay (FID)
                const fidObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        const fidEntry = entry as any; // Type assertion for FID specific properties
                        console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
                        // Send to analytics if needed
                    }
                });
                fidObserver.observe({ entryTypes: ['first-input'] });

                // Cumulative Layout Shift (CLS)
                const clsObserver = new PerformanceObserver((list) => {
                    let clsValue = 0;
                    for (const entry of list.getEntries()) {
                        const clsEntry = entry as any; // Type assertion for CLS specific properties
                        if (!clsEntry.hadRecentInput) {
                            clsValue += clsEntry.value;
                        }
                    }
                    console.log('CLS:', clsValue);
                    // Send to analytics if needed
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            }
        };

        observeWebVitals();
    }, []);
};

// Schema markup validation in development
export const validateStructuredData = () => {
    if (process.env.NODE_ENV === 'development') {
        const scripts = document.querySelectorAll('script[type="application/ld+json"]');
        scripts.forEach((script, index) => {
            try {
                const data = JSON.parse(script.textContent || '');
                console.log(`Structured Data ${index + 1}:`, data);

                // Basic validation
                if (!data['@context'] || !data['@type']) {
                    console.warn(`Structured data ${index + 1} missing @context or @type`);
                }
            } catch (error) {
                console.error(`Invalid JSON-LD in script ${index + 1}:`, error);
            }
        });
    }
};

// Meta tags validation in development
export const validateMetaTags = () => {
    if (process.env.NODE_ENV === 'development') {
        const requiredMeta = [
            'description',
            'viewport',
            'og:title',
            'og:description',
            'og:url',
            'twitter:card',
            'twitter:title',
            'twitter:description'
        ];

        const missingMeta: string[] = [];

        requiredMeta.forEach(name => {
            const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
            if (!meta) {
                missingMeta.push(name);
            }
        });

        if (missingMeta.length > 0) {
            console.warn('Missing meta tags:', missingMeta);
        }

        // Check title length
        const title = document.title;
        if (title.length > 60) {
            console.warn(`Title too long (${title.length} chars):`, title);
        }

        // Check description length
        const description = document.querySelector('meta[name="description"]')?.getAttribute('content');
        if (description) {
            if (description.length > 160) {
                console.warn(`Description too long (${description.length} chars):`, description);
            }
            if (description.length < 120) {
                console.warn(`Description too short (${description.length} chars):`, description);
            }
        }
    }
};
