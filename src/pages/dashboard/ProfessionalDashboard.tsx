
import { fadeIn, slideUp, staggerContainer, staggerItem } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";

export default function ProfessionalDashboard() {
    return (
        <motion.div
            className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
            >
                <motion.h1
                    className="text-2xl font-bold mb-4"
                    variants={fadeIn}
                    transition={{ delay: 0.4 }}
                >
                    Professional Dashboard
                </motion.h1>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.p
                        variants={staggerItem}
                        className="text-muted-foreground"
                    >
                        Manage appointments, accept/decline/reschedule/cancel
                    </motion.p>
                    {/* TODO: Add more dashboard content with animations */}
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
