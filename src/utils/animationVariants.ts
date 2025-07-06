import { type Variants } from "framer-motion";

// Enhanced animation variants with better performance
export const enhancedVariants = {
    // Page transitions
    pageSlideIn: {
        hidden: {
            opacity: 0,
            x: 100,
            scale: 0.95,
            filter: "blur(10px)"
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15,
                mass: 0.8
            }
        },
        exit: {
            opacity: 0,
            x: -100,
            scale: 1.05,
            filter: "blur(10px)",
            transition: {
                duration: 0.3
            }
        }
    },

    // Card animations
    cardReveal: {
        hidden: {
            opacity: 0,
            y: 60,
            rotateX: -15,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 12,
                mass: 0.8
            }
        }
    },

    // Text animations
    textSlideUp: {
        hidden: {
            opacity: 0,
            y: 30,
            skewY: 3
        },
        visible: {
            opacity: 1,
            y: 0,
            skewY: 0,
            transition: {
                type: "spring" as const,
                stiffness: 80,
                damping: 12
            }
        }
    },

    // Floating animation
    float: {
        initial: { y: 0 },
        animate: {
            y: [-10, 10, -10],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    },

    // Pulse glow effect
    pulseGlow: {
        initial: {
            boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.7)"
        },
        animate: {
            boxShadow: [
                "0 0 0 0 rgba(59, 130, 246, 0.7)",
                "0 0 0 10px rgba(59, 130, 246, 0)",
                "0 0 0 0 rgba(59, 130, 246, 0)"
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    },

    // Magnetic effect
    magnetic: {
        rest: { scale: 1 },
        hover: {
            scale: 1.05,
            transition: {
                type: "spring" as const,
                stiffness: 400,
                damping: 10
            }
        },
        tap: {
            scale: 0.95,
            transition: {
                type: "spring" as const,
                stiffness: 600,
                damping: 15
            }
        }
    }
} as const satisfies Record<string, Variants>;

// Transition presets
export const transitions = {
    smooth: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
        mass: 0.8
    },
    snappy: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
    },
    bouncy: {
        type: "spring" as const,
        stiffness: 400,
        damping: 10
    },
    gentle: {
        type: "tween" as const,
        duration: 0.6,
        ease: "easeOut" as const
    }
} as const;

// Stagger configurations
export const staggerConfigs = {
    container: (delayChildren: number = 0.1) => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren
            }
        }
    }),

    item: {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: transitions.smooth
        }
    }
} as const;

// Scroll-triggered animations
export const scrollAnimations = {
    slideInLeft: {
        hidden: { opacity: 0, x: -100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: transitions.smooth
        }
    },
    slideInRight: {
        hidden: { opacity: 0, x: 100 },
        visible: {
            opacity: 1,
            x: 0,
            transition: transitions.smooth
        }
    },
    slideInUp: {
        hidden: { opacity: 0, y: 100 },
        visible: {
            opacity: 1,
            y: 0,
            transition: transitions.smooth
        }
    },
    slideInDown: {
        hidden: { opacity: 0, y: -100 },
        visible: {
            opacity: 1,
            y: 0,
            transition: transitions.smooth
        }
    },
    scaleIn: {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: transitions.bouncy
        }
    },
    rotateIn: {
        hidden: { opacity: 0, rotate: -180, scale: 0.8 },
        visible: {
            opacity: 1,
            rotate: 0,
            scale: 1,
            transition: transitions.bouncy
        }
    }
} as const;
