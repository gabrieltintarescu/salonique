import SEO from "@/components/SEO";
import { seoConfigs } from "@/config/seo";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            staggerChildren: 0.2,
            delayChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 30,
        filter: "blur(10px)"
    },
    visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            duration: 0.8,
            ease: "easeOut" as const
        }
    }
};

const numberVariants = {
    hidden: {
        opacity: 0,
        scale: 0.8,
        rotateX: -15
    },
    visible: {
        opacity: 1,
        scale: 1,
        rotateX: 0,
        transition: {
            duration: 1,
            ease: "easeOut" as const,
            delay: 0.2
        }
    }
};

const buttonVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.9
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const
        }
    }
};

export default function NotFound() {
    return (
        <>
            <SEO {...seoConfigs.notFound} />
            <motion.div
                className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div className="text-center">
                    <motion.h1
                        className="text-7xl font-bold mb-4"
                        variants={numberVariants}
                    >
                        404
                    </motion.h1>

                    <motion.h2
                        className="text-2xl font-semibold mb-2"
                        variants={itemVariants}
                    >
                        Pagină inexistentă
                    </motion.h2>

                    <motion.p
                        className="mb-6 text-gray-500 dark:text-gray-400 text-center max-w-md"
                        variants={itemVariants}
                    >
                        Ne pare rău, pagina pe care o cauți nu există sau a fost mutată.
                    </motion.p>

                    <motion.div variants={buttonVariants}>
                        <motion.a
                            href="/"
                            className="px-6 py-2 rounded bg-black text-white dark:bg-white dark:text-black font-medium transition hover:bg-gray-800 dark:hover:bg-gray-200"
                            whileHover={{
                                y: -2,
                                scale: 1.02
                            }}
                            whileTap={{
                                scale: 0.98,
                                transition: { duration: 0.1 }
                            }}
                        >
                            Înapoi acasă
                        </motion.a>
                    </motion.div>
                </motion.div>
            </motion.div>
        </>
    );
}
