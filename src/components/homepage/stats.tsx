import { fadeIn, hoverLift, staggerContainer, staggerItem } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { ArrowUpRight, Award, Calendar, Star, Users } from "lucide-react";

const Stats = () => {
    const stats = [
        {
            icon: Users,
            value: "15,370",
            label: "Profesioniști activi",
            description: "folosesc platforma zilnic"
        },
        {
            icon: Calendar,
            value: "248,921",
            label: "Programări gestionate",
            description: "în ultima lună"
        },
        {
            icon: Star,
            value: "4.9",
            label: "Rating mediu",
            description: "din 5 stele"
        },
        {
            icon: Award,
            value: "99.9%",
            label: "Uptime",
            description: "disponibilitate garantată"
        }
    ];

    const testimonials = [
        {
            name: "Maria Ionescu",
            role: "Salon de frumusețe",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b376?w=150&h=150&fit=crop&crop=face",
            content: "Platforma a revolutionat modul în care îmi gestionez programările. Economisesc 3 ore pe zi!"
        },
        {
            name: "Alexandru Popescu",
            role: "Cabinet stomatologic",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            content: "Clienții mei sunt mult mai mulțumiți de când folosesc sistemul de notificări automate."
        },
        {
            name: "Elena Marinescu",
            role: "Centru de masaj",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
            content: "Interfața este intuitivă și elegantă. Exact ce căutam pentru afacerea mea!"
        }
    ];

    return (
        <div className="py-16 bg-gray-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-20 left-10 w-32 h-32 gradient-purple-soft rounded-full opacity-50 blur-xl"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-gray-100 rounded-full opacity-50 blur-xl"></div>
            </div>

            <div className="max-w-(--breakpoint-xl) mx-auto px-6 relative z-10">
                {/* Stats Section */}
                <motion.div
                    className="text-center mb-16"
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl xs:text-4xl font-bold text-gray-900 mb-4">
                        Mii de profesioniști ne-au ales deja
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Alătură-te comunității noastre în creștere și transformă-ți modul de lucru
                    </p>
                </motion.div>

                <motion.div
                    className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            variants={staggerItem}
                            custom={index}
                        >
                            <motion.div
                                className="text-center stat-card rounded-2xl p-6 h-full"
                                whileHover={hoverLift}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <div className="w-12 h-12 btn-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                                <div className="text-sm font-medium text-gray-900 mb-1">{stat.label}</div>
                                <div className="text-xs text-gray-500">{stat.description}</div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Testimonials Section */}
                <div className="hidden lg:block">
                    <motion.div
                        className="text-center mb-12"
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <h3 className="text-2xl xs:text-3xl font-bold text-gray-900 mb-4">
                            Ce spun clienții noștri
                        </h3>
                        <p className="text-lg text-gray-600">
                            Experiențele reale ale profesioniștilor care ne folosesc platforma
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.name}
                                variants={staggerItem}
                                custom={index}
                            >
                                <motion.div
                                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full"
                                    whileHover={hoverLift}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <img
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-gray-500">{testimonial.role}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-gray-400 fill-current" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 leading-relaxed">{testimonial.content}</p>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Call to Action */}
                    <motion.div
                        className="text-center mt-16"
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <div className="inline-flex items-center gap-2 btn-gradient px-6 py-3 rounded-full font-medium shadow-purple transition-shadow cursor-pointer">
                            Începe gratuit astăzi
                            <ArrowUpRight className="w-4 h-4" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
