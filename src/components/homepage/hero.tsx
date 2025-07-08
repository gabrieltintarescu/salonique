import { AppRoutes } from "@/AppRouter";
import { fadeIn, hoverScale, slideInLeft, slideInRight, tapScale } from "@/components/animations/PageTransition";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="min-h-screen w-full gradient-bg relative overflow-hidden flex items-center">
      {/* Floating elements - Hidden on mobile, positioned safely on larger screens */}
      <motion.div
        className="absolute top-16 left-4 md:left-8 lg:left-12 w-14 h-14 lg:w-16 lg:h-16 bg-white/95 rounded-full shadow-soft flex items-center justify-center hidden md:flex backdrop-blur-sm"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-purple-500" />
      </motion.div>

      <motion.div
        className="absolute top-24 right-4 md:right-8 lg:right-16 w-16 h-16 lg:w-20 lg:h-20 bg-white/95 rounded-full shadow-soft flex items-center justify-center hidden md:flex backdrop-blur-sm"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Clock className="w-8 h-8 lg:w-10 lg:h-10 text-gray-600" />
      </motion.div>

      <motion.div
        className="absolute bottom-32 left-4 md:left-12 lg:left-20 w-10 h-10 lg:w-12 lg:h-12 bg-white/95 rounded-full shadow-soft flex items-center justify-center hidden lg:flex backdrop-blur-sm"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Users className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" />
      </motion.div>

      <div className="max-w-7xl w-full flex flex-col lg:flex-row mx-auto items-center justify-between gap-y-12 lg:gap-x-16 px-6 py-16 relative z-10">
        <motion.div
          className="max-w-2xl lg:max-w-xl flex-1 text-center lg:text-left"
          variants={slideInLeft}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={fadeIn}
            transition={{ delay: 0.2 }}
          >
            <Badge className="rounded-full py-2 px-4 gradient-purple-soft border-none shadow-soft">
              <Zap className="w-4 h-4 mr-1 text-purple-500" />
              <span className="text-purple-700 font-medium">Nou! V1.0.0</span>
            </Badge>
          </motion.div>

          <motion.h1
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900"
            variants={fadeIn}
            transition={{ delay: 0.4 }}
          >
            Transformă modul în care{" "}
            <span className="text-gradient">
              gestionezi programările
            </span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg lg:text-xl text-gray-700 leading-relaxed"
            variants={fadeIn}
            transition={{ delay: 0.6 }}
          >
            Automatizează procesele, optimizează timpul și oferă clienților o experiență excepțională cu platforma noastră modernă de management al programărilor.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            variants={fadeIn}
            transition={{ delay: 0.8 }}
          >
            <Link to={AppRoutes.PROFESSIONAL_LOGIN}>
              <motion.div
                whileHover={hoverScale}
                whileTap={tapScale}
              >
                <Button
                  size="lg"
                  className="rounded-full text-base btn-gradient border-none shadow-purple px-8 py-6 text-lg"
                >
                  Începe acum <ArrowUpRight className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
            <Link to={AppRoutes.CLIENT_LOGIN}>
              <motion.div
                whileHover={hoverScale}
                whileTap={tapScale}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full text-base shadow-soft bg-white/95 border-gradient text-gray-700 hover:bg-white px-8 py-6 text-lg"
                >
                  Conectare clienți
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative lg:max-w-lg xl:max-w-xl w-full flex-1 lg:pl-10"
          variants={slideInRight}
          initial="hidden"
          animate="visible"
        >
          {/* Mock app interface */}
          <div className="relative flex justify-center lg:justify-end">
            <motion.div
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-sm text-gray-500 hidden">Dashboard</div>
              </div>

              <div className="space-y-3">
                <div className="gradient-card rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Programare nouă</div>
                      <div className="text-xs text-gray-500">Azi, 14:30</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>

                <div className="gradient-card rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 gradient-purple-soft rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">5 clienți noi</div>
                      <div className="text-xs text-gray-500">Săptămâna aceasta</div>
                    </div>
                  </div>
                </div>

                <div className="gradient-card rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 gradient-purple-soft rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Eficiență +32%</div>
                      <div className="text-xs text-gray-500">Față de luna trecută</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
