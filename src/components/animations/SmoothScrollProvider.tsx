import { useEffect } from "react";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Enable smooth scrolling
        document.documentElement.style.scrollBehavior = "smooth";

        // Add scroll event listener for performance optimizations
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Add any scroll-based animations here
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.documentElement.style.scrollBehavior = "auto";
        };
    }, []);

    return <>{children}</>;
}

// Enhanced CSS for better performance
export const animationStyles = `
  * {
    scroll-behavior: smooth;
  }

  @media (prefers-reduced-motion: no-preference) {
    :root {
      --spring-easing: cubic-bezier(0.175, 0.885, 0.32, 1.275);
      --smooth-easing: cubic-bezier(0.4, 0.0, 0.2, 1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  /* GPU acceleration for better performance */
  .transform-gpu {
    transform: translateZ(0);
    will-change: transform;
  }

  /* Smooth transitions for interactive elements */
  .transition-smooth {
    transition: all 200ms cubic-bezier(0.4, 0.0, 0.2, 1);
  }

  .transition-spring {
    transition: all 300ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
`;
