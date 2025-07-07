import { AnimatePresence, motion } from "framer-motion";
import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1
    },
    out: {
        opacity: 0,
        y: -20,
        scale: 1.02
    }
};

const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.5
};

export function PageTransition({ children, className = "" }: PageTransitionProps) {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className={`min-h-screen ${className}`}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

// Optimized stagger animation for better performance
export const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.2
        }
    }
};

export const staggerItem = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 120,
            damping: 15,
            mass: 0.8
        }
    }
};

// Fade in animation
export const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const
        }
    }
};

// Slide in from bottom
export const slideUp = {
    hidden: {
        opacity: 0,
        y: 60,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 80,
            damping: 15,
            mass: 1
        }
    }
};

// Slide in from left
export const slideInLeft = {
    hidden: {
        opacity: 0,
        x: -60,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 80,
            damping: 15
        }
    }
};

// Slide in from right
export const slideInRight = {
    hidden: {
        opacity: 0,
        x: 60,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 80,
            damping: 15
        }
    }
};

// Scale animation
export const scaleIn = {
    hidden: {
        opacity: 0,
        scale: 0.8
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100,
            damping: 12
        }
    }
};

// Hover animations
export const hoverScale = {
    scale: 1.05,
    transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
    }
};

export const hoverLift = {
    y: -8,
    scale: 1.02,
    transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
    }
};

// Button tap animation
export const tapScale = {
    scale: 0.95,
    transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
    }
};
