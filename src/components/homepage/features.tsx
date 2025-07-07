import { fadeIn, hoverLift, staggerContainer, staggerItem } from "@/components/animations/PageTransition";
import { Card, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Calendar,
  ChartPie,
  Clock,
  MessageCircle,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Programări inteligente",
    description: "Sistem automat de programări cu detectarea conflictelor și optimizarea timpului liber.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Users,
    title: "Gestionare clienți",
    description: "Bază de date completă cu istoricul și preferințele fiecărui client pentru servicii personalizate.",
    color: "from-purple-400 to-purple-500"
  },
  {
    icon: MessageCircle,
    title: "Notificări automate",
    description: "Reamintiri prin SMS și email pentru clienți, reducând absențele cu până la 80%.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: ChartPie,
    title: "Analiză avansată",
    description: "Rapoarte detaliate despre performanță, venituri și tendințe pentru decizii informate.",
    color: "from-purple-400 to-purple-500"
  },
  {
    icon: Smartphone,
    title: "Aplicație mobilă",
    description: "Acces complet din orice dispozitiv - desktop, tabletă sau smartphone.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Clock,
    title: "Economisire timp",
    description: "Automatizează taskurile repetitive și concentrează-te pe ceea ce contează cu adevărat.",
    color: "from-purple-400 to-purple-500"
  },
];

const Features = () => {
  return (
    <div className="py-16 bg-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-40 left-20 w-24 h-24 bg-gray-100 rounded-full opacity-30 blur-xl"></div>
        <div className="absolute bottom-40 right-20 w-32 h-32 gradient-purple-soft rounded-full opacity-30 blur-xl"></div>
      </div>

      <motion.div
        id="avantaje"
        className="max-w-(--breakpoint-xl) mx-auto w-full px-6 relative z-10"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div
          className="text-center mb-16"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl xs:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Totul ce ai nevoie pentru{" "}
            <span className="text-gradient">
              programări perfecte
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Funcționalități avansate pentru profesioniști care vor să-și optimizeze activitatea și să oferă clienților o experiență de neuitat
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              custom={index}
            >
              <motion.div
                whileHover={hoverLift}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="h-full"
              >
                <Card className="border-0 shadow-sm floating-card rounded-2xl overflow-hidden h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="p-8">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardHeader>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional CTA Section */}
        <motion.div
          className="text-center mt-16"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="gradient-card rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 btn-gradient rounded-full flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Gata să revoluționezi modul în care lucrezi?
            </h3>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Alătură-te miilor de profesioniști care și-au transformat afacerea cu ajutorul platformei noastre. Începe gratuit astăzi!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 btn-gradient rounded-full font-medium shadow-purple transition-shadow">
                Încearcă gratuit
              </button>
              <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-colors">
                Rezervă demo
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Features;
