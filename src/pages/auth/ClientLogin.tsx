import { fadeIn, slideInLeft, slideInRight } from "@/components/animations/PageTransition";
import { ClientLoginForm } from "@/components/auth/client-login-form";
import { Logo } from "@/components/navbar/logo";
import SEO from "@/components/SEO";
import { seoConfigs } from "@/config/seo";
import { motion } from "framer-motion";
import login_banner from '../../assets/login_banner.webp';

export default function ClientLogin() {
    return (
        <>
            <SEO {...seoConfigs.clientLogin} />
            <div className="grid min-h-svh lg:grid-cols-2">
                <motion.div
                    className="flex flex-col gap-4 p-6 md:p-10"
                    variants={slideInLeft}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div
                        className="flex justify-center gap-2 md:justify-start"
                        variants={fadeIn}
                        transition={{ delay: 0.2 }}
                    >
                        <Logo />
                    </motion.div>
                    <motion.div
                        className="flex flex-1 items-center justify-center"
                        variants={fadeIn}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="w-full max-w-xs">
                            <ClientLoginForm />
                        </div>
                    </motion.div>
                </motion.div>
                <motion.div
                    className="bg-muted relative hidden lg:block"
                    variants={slideInRight}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.img
                        src={(login_banner)}
                        alt="Image"
                        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />
                </motion.div>
            </div>
        </>
    )
}
