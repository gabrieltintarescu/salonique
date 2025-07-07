import { fadeIn, staggerContainer, staggerItem } from "@/components/animations/PageTransition";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { motion } from "framer-motion";
import { ChevronDown, HelpCircle, MessageCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem } from "./ui/accordion";

const faq = [
    {
        question: "Cum îmi pot crea un cont?",
        answer:
            "Apasă pe butonul de înregistrare și completează datele necesare. Vei primi un email de confirmare pentru activarea contului.",
        category: "Primii pași"
    },
    {
        question: "Cum pot programa o întâlnire?",
        answer:
            "După autentificare, accesează secțiunea 'Programează' și selectează serviciul, data și ora dorite. Vei primi o confirmare pe email.",
        category: "Programări"
    },
    {
        question: "Pot anula sau modifica o programare?",
        answer:
            "Da, poți anula sau modifica o programare din contul tău, la secțiunea 'Programările mele'. Vei primi o notificare cu modificarea efectuată.",
        category: "Programări"
    },
    {
        question: "Cum primesc notificări despre programări?",
        answer:
            "Platforma trimite automat notificări pe email și/sau SMS înainte de fiecare programare, pentru a nu uita de întâlnire.",
        category: "Notificări"
    },
    {
        question: "Este platforma potrivită pentru afacerea mea?",
        answer:
            "Da! Platforma este ideală pentru saloane, clinici, cabinete sau orice afacere care lucrează cu programări.",
        category: "General"
    },
    {
        question: "Cum pot contacta echipa de suport?",
        answer:
            "Ne poți scrie oricând la suport@platforma-ta.ro sau direct din secțiunea de contact din platformă. Suntem aici să te ajutăm!",
        category: "Suport"
    },
];

const FAQ = () => {
    return (
        <div className="py-20 bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Modern background elements */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-300 to-purple-400 rounded-full opacity-15 blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-10 blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <motion.div
                    className="text-center mb-16"
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <HelpCircle className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="text-3xl xs:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                        Întrebări frecvente
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Găsește răspunsuri la cele mai comune întrebări despre platformă și serviciile noastre
                    </p>
                </motion.div>

                <motion.div
                    className="grid gap-6"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {faq.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={staggerItem}
                            custom={index}
                            className="group"
                        >
                            <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value={`item-${index}`} className="border-none">
                                    <AccordionPrimitive.Trigger className="w-full bg-white/70 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/90 transition-all duration-300 group-hover:shadow-lg border border-purple-100/50">
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                    <MessageCircle className="w-6 h-6 text-white" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-sm font-medium text-purple-600 mb-1">
                                                        {item.category}
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {item.question}
                                                    </h3>
                                                </div>
                                            </div>
                                            <ChevronDown className="w-5 h-5 text-gray-500 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                                        </div>
                                    </AccordionPrimitive.Trigger>
                                    <AccordionContent className="pt-4 pb-0">
                                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 ml-16">
                                            <p className="text-gray-700 leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Contact CTA */}
                <motion.div
                    className="mt-16 text-center"
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-purple-100/50">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Nu găsești răspunsul căutat?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Echipa noastră de suport este aici să te ajute cu orice întrebare
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg transition-shadow">
                                Contactează suportul
                            </button>
                            <button className="px-8 py-3 border border-purple-200 text-purple-600 rounded-full font-medium hover:bg-purple-50 transition-colors">
                                Vezi documentația
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQ;
