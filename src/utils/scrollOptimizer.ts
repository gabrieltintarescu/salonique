// Scroll performance optimizer
export class ScrollOptimizer {
    private static instance: ScrollOptimizer;
    private scrollTimeout: NodeJS.Timeout | null = null;
    private isScrolling = false;
    private lastScrollTop = 0;
    private scrollThreshold = 10;

    private constructor() { }

    public static getInstance(): ScrollOptimizer {
        if (!ScrollOptimizer.instance) {
            ScrollOptimizer.instance = new ScrollOptimizer();
        }
        return ScrollOptimizer.instance;
    }

    public initializeScrollOptimization(): void {
        // Initially disable smooth scrolling
        document.documentElement.style.scrollBehavior = 'auto';

        // Add optimized scroll listener
        window.addEventListener('scroll', this.handleScroll.bind(this), {
            passive: true,
            capture: false
        });

        // Preload next sections on idle
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                this.preloadNextSections();
            });
        }
    }

    private handleScroll(): void {
        if (!this.isScrolling) {
            this.isScrolling = true;

            requestAnimationFrame(() => {
                const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const scrollDifference = Math.abs(currentScrollTop - this.lastScrollTop);

                // Only update if scroll is significant
                if (scrollDifference > this.scrollThreshold) {
                    this.lastScrollTop = currentScrollTop;

                    // Clear existing timeout
                    if (this.scrollTimeout) {
                        clearTimeout(this.scrollTimeout);
                    }

                    // Enable smooth scrolling after scroll ends
                    this.scrollTimeout = setTimeout(() => {
                        document.documentElement.style.scrollBehavior = 'smooth';
                    }, 150);
                }

                this.isScrolling = false;
            });
        }
    }

    private preloadNextSections(): void {
        // Preload critical images
        const criticalImages = [
            '/assets/home/salon.svg',
            '/assets/login_banner.webp',
            '/assets/register_banner.webp'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }

    public cleanup(): void {
        window.removeEventListener('scroll', this.handleScroll.bind(this));
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
    }
}
