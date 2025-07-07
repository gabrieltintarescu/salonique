import { ScrollOptimizer } from "@/utils/scrollOptimizer";
import { useEffect, useRef } from "react";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const scrollOptimizerRef = useRef<ScrollOptimizer | null>(null);

  useEffect(() => {
    // Initialize scroll optimizer
    scrollOptimizerRef.current = ScrollOptimizer.getInstance();
    scrollOptimizerRef.current.initializeScrollOptimization();

    return () => {
      if (scrollOptimizerRef.current) {
        scrollOptimizerRef.current.cleanup();
      }
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
