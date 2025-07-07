import { fadeIn, hoverLift, staggerContainer, staggerItem } from "@/components/animations/PageTransition";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CircleCheck, Star, Zap } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const plans = [
  {
    name: "Start",
    price: 149,
    period: "lună",
    description:
      "Ideal pentru profesioniști la început de drum. Gestionează până la 50 de programări pe lună și trimite notificări automate clienților.",
    features: [
      "Până la 50 programări/lună",
      "Notificări automate pe email",
      "Calendar integrat",
      "Gestionare clienți de bază",
      "Suport prin email",
    ],
    buttonText: "Începe cu Start",
    color: "from-purple-500 to-purple-600",
  },
  {
    name: "Avansat",
    price: 299,
    period: "lună",
    isRecommended: true,
    description:
      "Pentru afaceri în creștere. Include programări nelimitate, SMS reminders și rapoarte detaliate.",
    features: [
      "Programări nelimitate",
      "Notificări pe email și SMS",
      "Rapoarte detaliate",
      "Gestionare avansată clienți",
      "Suport prioritar",
    ],
    buttonText: "Alege Avansat",
    isPopular: true,
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Premium",
    price: 499,
    period: "lună",
    description:
      "Soluție completă pentru echipe mari sau saloane cu mai multe locații. Include funcții avansate de management și integrare cu website-ul.",
    features: [
      "Toate funcțiile Avansat",
      "Conturi multiple utilizatori",
      "Integrare website",
      "Asistență dedicată",
      "Personalizare platformă",
    ],
    buttonText: "Alege Premium",
    color: "from-purple-400 to-purple-500",
  },
];

const Pricing = () => {
  return (
    <div className="py-16 gradient-bg relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-40 h-40 gradient-purple-soft rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gray-200 rounded-full opacity-30 blur-2xl"></div>
      </div>

      <motion.div
        id="preturi"
        className="max-w-7xl mx-auto px-6 relative z-10"
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
          <h2 className="text-3xl xs:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            Pachete și{" "}
            <span className="text-gradient">
              prețuri
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Alege planul potrivit pentru afacerea ta. Toate planurile includ perioada de testare gratuită de 30 de zile
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              variants={staggerItem}
              custom={index}
            >
              <motion.div
                className={cn(
                  "relative bg-white rounded-2xl p-8 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300",
                  {
                    "ring-2 ring-purple-200 shadow-purple scale-105": plan.isPopular,
                  }
                )}
                whileHover={hoverLift}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {plan.isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="btn-gradient border-none px-4 py-2 rounded-full">
                      <Star className="w-4 h-4 mr-1" />
                      Cel mai popular
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center`}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500">Plan {plan.name.toLowerCase()}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">lei/{plan.period}</span>
                  </div>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CircleCheck className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={cn(
                    "w-full rounded-full py-6 text-base font-medium transition-all duration-200",
                    plan.isPopular
                      ? "btn-gradient border-none shadow-purple"
                      : "bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300"
                  )}
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional info */}
        <motion.div
          className="text-center mt-16"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl p-8 max-w-4xl mx-auto shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Toate planurile includ
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mb-3">
                  <CircleCheck className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">30 zile gratuit</h4>
                <p className="text-sm text-gray-600">Testează toate funcțiile</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Fără contract</h4>
                <p className="text-sm text-gray-600">Anulezi oricând</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">Suport 24/7</h4>
                <p className="text-sm text-gray-600">Echipa noastră te ajută</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Pricing;
