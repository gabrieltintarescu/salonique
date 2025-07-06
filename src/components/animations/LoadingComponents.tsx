import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    variant?: "default" | "dots" | "pulse";
}

export function LoadingSpinner({ size = "md", className = "", variant = "default" }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: "h-4 w-4",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    };

    if (variant === "dots") {
        return (
            <div className={`flex items-center gap-1 ${className}`}>
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={`${size === "sm" ? "h-1.5 w-1.5" : size === "md" ? "h-2 w-2" : "h-3 w-3"} bg-primary rounded-full`}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.7, 1, 0.7],
                        }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            delay: i * 0.2,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        );
    }

    if (variant === "pulse") {
        return (
            <motion.div
                className={`${sizeClasses[size]} bg-primary/20 rounded-full flex items-center justify-center ${className}`}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <motion.div
                    className={`${size === "sm" ? "h-2 w-2" : size === "md" ? "h-4 w-4" : "h-6 w-6"} bg-primary rounded-full`}
                    animate={{
                        scale: [0.8, 1, 0.8],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            </motion.div>
        );
    }

    return (
        <motion.div
            className={`${sizeClasses[size]} border-2 border-muted border-t-primary rounded-full ${className}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
    );
}

export function PageLoader({ message = "Loading..." }: { message?: string }) {
    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <motion.div
                    className="flex flex-col items-center gap-6 p-8"
                    initial={{ y: 30, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -30, opacity: 0, scale: 0.9 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                >
                    {/* Animated icon container */}
                    <motion.div
                        className="relative"
                        animate={{
                            rotateY: [0, 360],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <motion.div
                            className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center relative overflow-hidden"
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            {/* Background pulse effect */}
                            <motion.div
                                className="absolute inset-0 bg-primary/20 rounded-2xl"
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0, 0.3, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            <Calendar className="h-7 w-7 text-primary relative z-10" />

                            {/* Small floating clock icon */}
                            <motion.div
                                className="absolute -top-1 -right-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center"
                                animate={{
                                    scale: [1, 1.1, 1],
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    scale: {
                                        duration: 1.5,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    },
                                    rotate: {
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "linear",
                                    },
                                }}
                            >
                                <Clock className="h-3 w-3 text-primary-foreground" />
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Loading dots */}
                    <LoadingSpinner size="md" variant="dots" />

                    {/* Message */}
                    <motion.p
                        className="text-sm text-muted-foreground font-medium text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.4 }}
                    >
                        {message}
                    </motion.p>
                </motion.div>

                {/* Subtle background animation */}
                <motion.div
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    {[...Array(3)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-primary/3"
                            style={{
                                width: 120 + i * 60,
                                height: 120 + i * 60,
                                left: `${30 + i * 20}%`,
                                top: `${20 + i * 30}%`,
                            }}
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.3, 0.1, 0.3],
                                x: [0, 20, 0],
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 6 + i * 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.5,
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// Helper function to add minimum delay to loading states
export const withMinimumDelay = async (
    promise: Promise<any>,
    minimumDelayMs: number = 2500
): Promise<any> => {
    const [result] = await Promise.all([
        promise,
        new Promise(resolve => setTimeout(resolve, minimumDelayMs))
    ]);
    return result;
};

// Animated background patterns
export function AnimatedBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-primary/5"
                    style={{
                        width: Math.random() * 300 + 50,
                        height: Math.random() * 300 + 50,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, Math.random() * 40 - 20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );
}
