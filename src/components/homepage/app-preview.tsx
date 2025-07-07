import { fadeIn, hoverLift, slideInLeft, slideInRight, staggerContainer, staggerItem } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { Bell, Calendar, ChartBar, Clock, Star, Users } from "lucide-react";

const AppPreview = () => {
    return (
        <div className="py-16 gradient-purple-soft relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 left-20 w-40 h-40 bg-purple-200 rounded-full opacity-30 blur-2xl"></div>
                <div className="absolute bottom-20 right-20 w-48 h-48 bg-gray-200 rounded-full opacity-30 blur-2xl"></div>
            </div>

            <div className="max-w-(--breakpoint-xl) mx-auto px-6 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl xs:text-4xl font-bold text-gray-900 mb-4">
                        Experimentează puterea unei{" "}
                        <span className="text-gradient">
                            platforme complete
                        </span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Interfață intuitivă, funcționalități avansate și experiență de utilizare fără cusur pentru tine și clienții tăi
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left side - App mockups */}
                    <motion.div
                        className="relative"
                        variants={slideInLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="relative">
                            {/* Main app mockup */}
                            <motion.div
                                className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto"
                                whileHover={hoverLift}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Dashboard</h3>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Today's appointments */}                    <div className="gradient-card rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <Calendar className="w-5 h-5 text-purple-500" />
                                            <span className="font-medium text-gray-900">Programări astăzi</span>
                                        </div>
                                        <div className="text-2xl font-bold text-purple-500">12</div>
                                    </div>

                                    {/* Recent appointments */}
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">Ana Popescu</div>
                                                <div className="text-xs text-gray-500">Coafură - 14:00</div>
                                            </div>
                                            <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                Confirmat
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                                                <Clock className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">Mihai Ionescu</div>
                                                <div className="text-xs text-gray-500">Masaj - 15:30</div>
                                            </div>
                                            <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                În așteptare
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}                    <div className="gradient-card rounded-xl p-4">
                                        <div className="flex items-center gap-3 mb-3">
                                            <ChartBar className="w-5 h-5 text-purple-500" />
                                            <span className="font-medium text-gray-900">Statistici</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <div className="text-lg font-bold text-purple-500">94%</div>
                                                <div className="text-xs text-gray-500">Rata de prezență</div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-purple-400">4.8</div>
                                                <div className="text-xs text-gray-500">Rating mediu</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating notification */}
                            <motion.div
                                className="absolute -top-6 -right-6 bg-white rounded-xl shadow-lg p-4 max-w-xs"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                            >
                                <div className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-purple-500" />
                                    <div>
                                        <div className="font-medium text-sm">Programare nouă!</div>
                                        <div className="text-xs text-gray-500">Elena M. - Mâine 10:00</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Right side - Features list */}
                    <motion.div
                        className="space-y-8"
                        variants={slideInRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.div
                            className="space-y-6"
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            {[
                                {
                                    icon: Calendar,
                                    title: "Programări în timp real",
                                    description: "Vezi și gestionează toate programările dintr-un singur loc, cu actualizări instantanee.",
                                    color: "from-purple-500 to-purple-600"
                                },
                                {
                                    icon: Bell,
                                    title: "Notificări inteligente",
                                    description: "Primește alerte pentru programări noi, modificări și reamintiri importante.",
                                    color: "from-purple-500 to-purple-600"
                                },
                                {
                                    icon: ChartBar,
                                    title: "Analiză detaliată",
                                    description: "Înțelege-ți afacerea cu rapoarte complete despre performanță și tendințe.",
                                    color: "from-purple-400 to-purple-500"
                                },
                                {
                                    icon: Star,
                                    title: "Experiență premium",
                                    description: "Interfață elegantă și intuitivă, optimizată pentru productivitate maximă.",
                                    color: "from-purple-300 to-purple-400"
                                }
                            ].map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    className="flex items-start gap-4"
                                    variants={staggerItem}
                                    custom={index}
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.div
                            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                        >
                            <h3 className="font-semibold text-gray-900 mb-4">
                                Începe gratuit astăzi!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Fără costuri ascunse, fără abonamente obligatorii. Testează toate funcționalitățile timp de 30 de zile.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button className="btn-gradient px-6 py-3 rounded-full font-medium hover:shadow-lg transition-shadow">
                                    Încearcă gratuit
                                </button>
                                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors">
                                    Vezi demo
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default AppPreview;
